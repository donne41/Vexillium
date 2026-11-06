const crypto = require('crypto');
const db = require('../connectionMySQL')

function generateInviteCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = crypto.randomInt(characters.length);
        code += characters[randomIndex];
    }

    return code;
}

async function createRoom(roomName, userId, isPublic) {
    for (let attempt = 0; attempt < 5; attempt++) {
        const inviteCode = generateInviteCode();

        try {
            const [result] = await db.execute(
                `INSERT INTO Rooms
                     (OwnerUserID, RoomName, InviteCode, IsPublic)
                 VALUES (?, ?, ?, ?)`,
                [userId, roomName, inviteCode, isPublic]
            );

            return {
                id: result.insertId,
                name: roomName,
                inviteCode: inviteCode,
                isPublic: Boolean(isPublic),
                status: 'waiting'
            };
        } catch (error) {
            if (error.code !== 'ER_DUP_ENTRY') {
                throw error;
            }
        }
    }

    throw new Error('Kunde inte skapa en unik inbjudningskod.');
}

async function getPublicRooms() {
    const [rooms] = await db.execute(
        `SELECT
             RoomID AS id,
             RoomName AS name,
             RoomStatus AS status,
             CreatedAt AS createdAt,
             1 + (
                 SELECT COUNT(*)
                 FROM RoomGuests
                 WHERE RoomGuests.RoomID = Rooms.RoomID
             ) AS playerCount
         FROM Rooms
         WHERE IsPublic = TRUE
           AND RoomStatus = 'waiting'
           AND OwnerUserID IS NOT NULL
         ORDER BY CreatedAt DESC`
    );

    return rooms;
}

async function getRoomByCode(inviteCode) {
    const [rooms] = await db.execute(
        `SELECT
            RoomID AS id,
            RoomName AS name,
            InviteCode AS inviteCode,
            RoomStatus AS status,
            IsPublic AS isPublic,
            OwnerUserID AS ownerUserId
         FROM Rooms
         WHERE InviteCode = ?
           AND OwnerUserID IS NOT NULL`,
        [inviteCode]
    );

    return rooms[0] || null;
}

async function joinRoom(inviteCode, guestName, userId) {
    const room = await getRoomByCode(inviteCode);

    if (!room) {
        throw new Error('Rummet finns inte.');
    }

    if (room.isPublic) {
        throw new Error('Använd listan över offentliga rum för att gå med.');
    }

    if (room.status !== 'waiting') {
        throw new Error('Quizet har redan startat eller avslutats.');
    }

    if (userId && Number(room.ownerUserId) === Number(userId)) {
        const error = new Error('Du är redan värd för det här rummet.');
        error.status = 403;
        throw error;
    }

    const guestToken = crypto.randomBytes(32).toString('hex');

    const guestTokenHash = crypto
        .createHash('sha256')
        .update(guestToken)
        .digest('hex');

    const [result] = await db.execute(
        `INSERT INTO RoomGuests (RoomID, GuestName, GuestTokenHash)
         SELECT RoomID, ?, ? FROM Rooms
         WHERE RoomID = ?
           AND RoomStatus = 'waiting'
           AND OwnerUserID IS NOT NULL`,
        [guestName, guestTokenHash, room.id]
    );

    if (result.affectedRows === 0) {
        throw new Error('Quizet har redan startat eller avslutats.');
    }

    return {
        roomId: room.id,
        roomName: room.name,
        guestId: result.insertId,
        guestName: guestName,
        guestToken: guestToken
    };
}

async function joinPublicRoom(roomId, guestName, userId) {
    const [rooms] = await db.execute(
        `SELECT
            RoomID AS id,
            RoomName AS name,
            RoomStatus AS status,
            OwnerUserID AS ownerUserId
         FROM Rooms
         WHERE RoomID = ?
           AND IsPublic = TRUE
           AND OwnerUserID IS NOT NULL`,
        [roomId]
    );

    const room = rooms[0];

    if (!room) {
        throw new Error('Rummet finns inte.');
    }

    if (room.status !== 'waiting') {
        throw new Error('Quizet har redan startat eller avslutats.');
    }

    if (userId && Number(room.ownerUserId) === Number(userId)) {
        const error = new Error('Du är redan värd för det här rummet.');
        error.status = 403;
        throw error;
    }

    const guestToken = crypto.randomBytes(32).toString('hex');

    const guestTokenHash = crypto
        .createHash('sha256')
        .update(guestToken)
        .digest('hex');

    const [result] = await db.execute(
        `INSERT INTO RoomGuests (RoomID, GuestName, GuestTokenHash)
         SELECT RoomID, ?, ? FROM Rooms
         WHERE RoomID = ?
           AND RoomStatus = 'waiting'
           AND OwnerUserID IS NOT NULL`,
        [guestName, guestTokenHash, room.id]
    );

    if (result.affectedRows === 0) {
        throw new Error('Quizet har redan startat eller avslutats.');
    }

    return {
        roomId: room.id,
        roomName: room.name,
        guestId: result.insertId,
        guestName: guestName,
        guestToken: guestToken
    };
}

async function getRoomPlayers(roomId) {
    const [guests] = await db.execute(
        `SELECT
            GuestID AS id,
            GuestName AS name
         FROM RoomGuests
         WHERE RoomID = ?`,
        [roomId]
    );

    const [accounts] = await db.execute(
        `SELECT
             users.id AS id,
             users.username AS name
         FROM Rooms
                  JOIN users
                       ON Rooms.OwnerUserID = users.id
         WHERE Rooms.RoomID = ?`,
        [roomId]
    );

    return {
        guests,
        accounts
    };
}


async function validateGuestSession(roomId, guestToken) {
    if (!guestToken || typeof guestToken !== 'string') {
        return false;
    }

    const guestTokenHash = crypto
        .createHash('sha256')
        .update(guestToken)
        .digest('hex');

    const [guests] = await db.execute(
        `SELECT GuestID
         FROM RoomGuests
         WHERE RoomID = ?
         AND GuestTokenHash = ?
         LIMIT 1`,
        [roomId, guestTokenHash]
    );

    return guests.length > 0;
}

async function leaveRoom(roomId, guestToken) {
    const guestTokenHash = crypto
        .createHash('sha256')
        .update(guestToken)
        .digest('hex');

    const [guests] = await db.execute(
        `SELECT GuestID
         FROM RoomGuests
         WHERE RoomID = ?
         AND GuestTokenHash = ?`,
        [roomId, guestTokenHash]
    );

    if (guests.length === 0) {
        return null;
    }

    const guestId = guests[0].GuestID;

    const [result] = await db.execute(
        `DELETE FROM RoomGuests
         WHERE RoomID = ?
         AND GuestTokenHash = ?`,
        [roomId, guestTokenHash]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return guestId;
}

async function deleteRoom(roomId, userId) {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const [rooms] = await connection.execute(
            `SELECT OwnerUserID, RoomStatus
             FROM Rooms
             WHERE RoomID = ?
             FOR UPDATE`,
            [roomId]
        );

        const room = rooms[0];

        if (!room) {
            await connection.rollback();
            return 'not_found';
        }

        if (Number(room.OwnerUserID) !== Number(userId)) {
            await connection.rollback();
            return 'forbidden';
        }

        await connection.execute(
            'DELETE FROM RoomGuests WHERE RoomID = ?',
            [roomId]
        );

        await connection.execute(
            'DELETE FROM Rooms WHERE RoomID = ?',
            [roomId]
        );

        await connection.commit();
        return 'deleted';
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function clearRooms() {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.execute('DELETE FROM RoomGuests');
        await connection.execute('DELETE FROM Rooms');

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    clearRooms,
    createRoom,
    getPublicRooms,
    getRoomByCode,
    joinRoom,
    joinPublicRoom,
    getRoomPlayers,
    validateGuestSession,
    leaveRoom,
    deleteRoom
};

