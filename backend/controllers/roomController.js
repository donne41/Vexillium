const roomService = require('../service/roomService');

exports.createRoom = async (req, res) => {
    try {
        if (!req.user ||!req.user.id) {
            return res.status(401).json({
                error: 'Du måste vara inloggad för att skapa ett rum.'
            })
        }

        const { roomName, isPublic } = req.body;

        if (
            typeof roomName !== 'string' ||
            roomName.trim().length < 3 ||
            roomName.trim().length > 100
        ) {
            return res.status(400).json({
                error: 'Rumsnamnet måste vara mellan 3 och 100 tecken.'
            });
        }

        if (typeof isPublic !== 'boolean') {
            return res.status(400).json({
                error: 'Du måste välja om rummet är offentligt.'
            });
        }

        const room = await roomService.createRoom(
            roomName.trim(),
            req.user.id,
            isPublic
        );

        if (room.isPublic) {
            req.app.get('io').emit('rooms:updated');
        }

        return res.status(201).json(room);
    } catch (error) {
        console.error('Kunde inte skapa rum', error);

        return res.status(500).json({
            error: 'Kunde inte skapa quizrummet.'
        });
    }
};

exports.getPublicRooms = async (req, res) => {
    try {
        const rooms = await roomService.getPublicRooms();

        return res.json(rooms);
    } catch (error) {
        console.error('Kunde inte hämta rum:', error);

        return res.status(500).json({
            error: 'Kunde inte hämta quizrum.'
        });
    }
};

exports.getRoomByCode = async (req, res) => {
    try {
        const inviteCode = String(req.params.inviteCode).toUpperCase();

        if (!/^[A-Z0-9]{6}$/.test(inviteCode)) {
            return res.status(400).json({
                error: 'Ogiltig inbjudningskod.'
            });
        }

        const room = await roomService.getRoomByCode(inviteCode);

        if (!room) {
            return res.status(404).json({
                error: 'Quizrummet finns inte.'
            });
        }

        return res.json(room);
    } catch (error) {
        console.error('Kunde inte hitta rum:', error);

        return res.status(500).json({
            error: 'Kunde inte hitta quizrummet.'
        });
    }
};

exports.joinRoom = async (req, res) => {
    try {
        const inviteCode = String(req.body.inviteCode || '')
            .trim()
            .toUpperCase();

        const guestName = req.body.guestName;

        if (!/^[A-Z0-9]{6}$/.test(inviteCode)) {
            return res.status(400).json({
                error: 'Ange en giltig inbjudningskod.'
            });
        }

        if (
            typeof guestName !== 'string' ||
            guestName.trim().length < 2 ||
            guestName.trim().length > 50
        ) {
            return res.status(400).json({
                error: 'Spelarnamnet måste vara mellan 2 och 50 tecken.'
            });
        }

        const result = await roomService.joinRoom(
            inviteCode,
            guestName.trim()
        );

        return res.status(201).json(result);
    } catch (error) {
        if (
            error.message === 'Rummet finns inte.' ||
            error.message === 'Quizet har redan startat eller avslutats.' ||
            error.message === 'Använd listan över offentliga rum för att gå med.'
        ) {
            return res.status(400).json({
                error: error.message
            });
        }

        console.error('Kunde inte gå med i rum:', error);

        return res.status(500).json({
            error: 'Kunde inte gå med i quizrummet.'
        });
    }
};


exports.joinPublicRoom = async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const guestName = req.body?.guestName;

        if (!Number.isSafeInteger(roomId) || roomId <= 0) {
            return res.status(400).json({
                error: 'Ogiltigt rums-ID.'
            });
        }

        if (
            typeof guestName !== 'string' ||
            guestName.trim().length < 2 ||
            guestName.trim().length > 50
        ) {
            return res.status(400).json({
                error: 'Spelarnamnet måste vara mellan 2 och 50 tecken.'
            });
        }

        const result = await roomService.joinPublicRoom(
            roomId,
            guestName.trim()
        );

        return res.status(201).json(result);
    } catch (error) {
        if (error.message === 'Rummet finns inte.') {
            return res.status(404).json({
                error: error.message
            });
        }

        if (error.message === 'Quizet har redan startat eller avslutats.') {
            return res.status(400).json({
                error: error.message
            });
        }

        console.error('Kunde inte gå med i offentligt rum:', error);

        return res.status(500).json({
            error: 'Kunde inte gå med i quizrummet.'
        });
    }
};

exports.getRoomPlayers = async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);

        if (!Number.isSafeInteger(roomId) || roomId <= 0) {
            return res.status(400).json({
                error: 'Ogiltigt rums-ID.'
            });
        }

        const guestToken = req.get('X-Guest-Token')

        if (!await roomService.validateGuestSession(roomId, guestToken)) {
            return res.status(403).json({
                error: 'Du måste vara med i rummet'
            });
        }

        const players = await roomService.getRoomPlayers(roomId);

        return res.json(players);
    } catch (error) {
        console.error('Kunde inte hämta spelare:', error);

        return res.status(500).json({
            error: 'Kunde inte hämta deltagarna.'
        });
    }
};

exports.leaveRoom = async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const { guestToken } = req.body || {};

        if (!Number.isSafeInteger(roomId) || roomId <= 0) {
            return res.status(400).json({
                error: 'Ogiltigt rums-ID.'
            });
        }

        if (
            typeof guestToken !== 'string' ||
            !/^[a-f0-9]{64}$/.test(guestToken)
        ) {
            return res.status(400).json({
                error: 'Ogiltig gästtoken.'
            });
        }

        const removed = await roomService.leaveRoom(roomId, guestToken);

        if (!removed) {
            return res.status(404).json({
                error: 'Spelaren hittades inte i rummet.'
            });
        }

        return res.json({
            message: 'Du har lämnat rummet.'
        });
    } catch (error) {
        console.error('Kunde inte lämna rum:', error);

        return res.status(500).json({
            error: 'Kunde inte lämna quizrummet.'
        });
    }
};

exports.validateGuestSession = async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const { guestToken } = req.body || {};

        if (!Number.isSafeInteger(roomId) || roomId <= 0) {
            return res.status(400).json({
                error: 'Ogiltigt rums-ID.'
            });
        }

        if (
            typeof guestToken !== 'string' ||
            !/^[a-f0-9]{64}$/.test(guestToken)
        ) {
            return res.status(400).json({
                error: 'Ogiltig gästtoken.'
            });
        }

        const valid = await roomService.validateGuestSession(
            roomId,
            guestToken
        );

        return res.json({ valid });
    } catch (error) {
        console.error('Kunde inte kontrollera gästsession:', error);

        return res.status(500).json({
            error: 'Kunde inte kontrollera gästsessionen.'
        });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                error: 'Du behöver logga in för att ta bort quizrummet.'
            });
        }

        const roomId = Number(req.params.roomId);

        if (!Number.isSafeInteger(roomId) || roomId <= 0) {
            return res.status(400).json({
                error: 'Ogiltigt rums-ID.'
            });
        }

        const result = await roomService.deleteRoom(
            roomId,
            req.user.id
        );

        if (result === 'not_found') {
            return res.status(404).json({
                error: 'Quizrummet finns inte längre.'
            });
        }

        if (result === 'forbidden') {
            return res.status(403).json({
                error: 'Bara den som skapade quizrummet får ta bort det.'
            });
        }

        if (result === 'not_waiting') {
            return res.status(409).json({
                error: 'Du kan bara avbryta ett quizrum innan quizet har startat.'
            });
        }

        req.app.get('io')?.emit('rooms:updated');

        return res.status(204).send();
    } catch (error) {
        console.error('Kunde inte ta bort quizrum:', error);

        return res.status(500).json({
            error: 'Kunde inte ta bort quizrummet. Försök igen senare.'
        });
    }
};
