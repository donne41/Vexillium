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
                     (RoomAdminID, RoomName, InviteCode, IsPublic)
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
            CreatedAt AS createdAt
         FROM Rooms
         WHERE IsPublic = TRUE
         AND RoomStatus = 'waiting'
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
            IsPublic AS isPublic
         FROM Rooms
         WHERE InviteCode = ?`,
        [inviteCode]
    );

    return rooms[0] || null;
}

async function joinRoom(inviteCode, guestName) {
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

    const guestToken = crypto.randomBytes(32).toString('hex');

    const guestTokenHash = crypto
        .createHash('sha256')
        .update(guestToken)
        .digest('hex');

    const [result] = await db.execute(
        `INSERT INTO RoomGuests
         (RoomID, GuestName, GuestTokenHash)
         VALUES (?, ?, ?)`,
        [room.id, guestName, guestTokenHash]
    );

    return {
        roomId: room.id,
        roomName: room.name,
        guestId: result.insertId,
        guestName: guestName,
        guestToken: guestToken
    };
}

async function joinPublicRoom(roomId, guestName) {
    const [rooms] = await db.execute(
        `SELECT
            RoomID AS id,
            RoomName AS name,
            RoomStatus AS status
         FROM Rooms
         WHERE RoomID = ?
         AND IsPublic = TRUE`,
        [roomId]
    );

    const room = rooms[0];

    if (!room) {
        throw new Error('Rummet finns inte.');
    }

    if (room.status !== 'waiting') {
        throw new Error('Quizet har redan startat eller avslutats.');
    }

    const guestToken = crypto.randomBytes(32).toString('hex');

    const guestTokenHash = crypto
        .createHash('sha256')
        .update(guestToken)
        .digest('hex');

    const [result] = await db.execute(
        `INSERT INTO RoomGuests
         (RoomID, GuestName, GuestTokenHash)
         VALUES (?, ?, ?)`,
        [room.id, guestName, guestTokenHash]
    );

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
            Accounts.AccountID AS id,
            Accounts.Username AS name
         FROM AccountsRooms
         JOIN Accounts
         ON AccountsRooms.AccountID = Accounts.AccountID
         WHERE AccountsRooms.RoomID = ?`,
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

    const [result] = await db.execute(
        `DELETE FROM RoomGuests
         WHERE RoomID = ?
         AND GuestTokenHash = ?`,
        [roomId, guestTokenHash]
    );

    return result.affectedRows > 0;
}

module.exports = {
    createRoom,
    getPublicRooms,
    getRoomByCode,
    joinRoom,
    joinPublicRoom,
    getRoomPlayers,
    validateGuestSession,
    leaveRoom
};

