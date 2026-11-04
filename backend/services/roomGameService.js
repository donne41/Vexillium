const crypto = require('crypto');
const db = require('../connectionMySQL');
const questionService = require('./questionService');
const roomService = require('./roomService');

const games = new Map();
const hostTimers = new Map();

const categories = [
    'flags',
    'capitals',
    'neighbours',
    'population',
    'area'
];

function fail(status, message) {
    const error = new Error(message);
    error.status = status;
    throw error;
}

async function getPlayer(roomId, user, token) {
    if (!Number.isSafeInteger(roomId) || roomId <= 0) {
        fail(400, 'Ogiltigt rums-ID.');
    }

    const [rooms] = await db.execute(
        'SELECT OwnerUserID, RoomStatus FROM Rooms WHERE RoomID = ?',
        [roomId]
    );

    const room = rooms[0];

    if (!room) {
        fail(404, 'Rummet finns inte.');
    }

    if (user && Number(room.OwnerUserID) === Number(user.id)) {
        return {
            key: 'host:' + user.id,
            name: user.username,
            isHost: true,
            room
        };
    }

    if (
        typeof token !== 'string' ||
        !/^[a-f0-9]{64}$/.test(token)
    ) {
        fail(403, 'Du måste vara med i rummet.');
    }

    const hash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const [guests] = await db.execute(
        `SELECT GuestID, GuestName
         FROM RoomGuests
         WHERE RoomID = ? AND GuestTokenHash = ?`,
        [roomId, hash]
    );

    if (!guests.length) {
        fail(403, 'Du måste vara med i rummet.');
    }

    return {
        key: 'guest:' + guests[0].GuestID,
        name: guests[0].GuestName,
        isHost: false,
        room
    };
}

function makeQuestion(data, category) {
    if (
        !Array.isArray(data.countries) ||
        data.countries.length !== 4 ||
        !Number.isInteger(data.correctIndex) ||
        data.correctIndex < 0 ||
        data.correctIndex > 3
    ) {
        fail(500, 'Kunde inte skapa en quizfråga.');
    }

    const correct = data.countries[data.correctIndex];

    let prompt = data.prompt;
    let image = null;

    if (category === 'flags') {
        prompt = 'Vilket land tillhör flaggan?';
        image = correct.Flag;
    } else if (category === 'capitals') {
        prompt =
            'Vilket land har ' +
            correct.Capital +
            ' som huvudstad?';
    }

    return {
        prompt,
        image,
        capital: category === 'capitals' ? correct.Capital : null,
        options: data.countries.map(function (country) {
            return country.Countryname;
        }),
        correctIndex: data.correctIndex
    };
}

async function advance(game, io) {
    const now = Date.now();

    if (
        game.phase === 'playing' &&
        (
            now >= game.deadline ||
            game.answers.size === game.players.size
        )
    ) {
        const correctIndex =
            game.questions[game.index].correctIndex;

        for (const [key, answer] of game.answers) {
            if (answer === correctIndex) {
                game.players.get(key).score++;
            }
        }

        game.phase = 'reveal';
        game.deadline = now + 3000;

        io.emit('rooms:updated');
    } else if (
        game.phase === 'reveal' &&
        now >= game.deadline
    ) {
        game.index++;
        game.answers.clear();

        if (game.index >= game.questions.length) {
            game.phase = 'finished';
            game.deadline = null;

            await db.execute(
                `UPDATE Rooms
                 SET RoomStatus = 'finished'
                 WHERE RoomID = ?`,
                [game.roomId]
            );
        } else {
            game.phase = 'playing';
            game.deadline = now + 20000;
        }

        io.emit('rooms:updated');
    }
}

function publicState(game, player) {
    const finished = game.phase === 'finished';

    const question = finished
        ? null
        : game.questions[game.index];

    return {
        roundId: game.roundId,
        phase: game.phase,
        isHost: player.isHost,
        category: game.category,

        questionNumber: finished
            ? game.questions.length
            : game.index + 1,

        totalQuestions: game.questions.length,
        questionIndex: game.index,
        deadline: game.deadline,
        serverTime: Date.now(),

        question: question
            ? {
                prompt: question.prompt,
                image: question.image,
                capital: question.capital,
                options: question.options
            }
            : null,

        correctIndex: game.phase === 'reveal'
            ? question.correctIndex
            : null,

        myAnswer: game.answers.get(player.key) ?? null,
        myScore: game.players.get(player.key).score,
        answeredCount: game.answers.size,
        playerCount: game.players.size,

        scores: Array.from(game.players.values())
            .map(function (player) {
                return {
                    name: player.name,
                    score: player.score
                };
            })
            .sort(function (a, b) {
                return b.score - a.score;
            })
    };
}

function keepHostAlive(roomId, userId, io) {
    clearTimeout(hostTimers.get(roomId));

    const timer = setTimeout(async () => {
        try {
            await roomService.deleteRoom(roomId, userId);
            removeGame(roomId);
            io.emit('rooms:updated');
        } catch (error) {
            console.error('Kunde inte stänga övergivet rum:', error);
            keepHostAlive(roomId, userId, io);
        }
    }, 90000);

    timer.unref();
    hostTimers.set(roomId, timer);
}

async function getState(roomId, user, token, io) {
    const player = await getPlayer(roomId, user, token);

    if (player.isHost) {
        keepHostAlive(roomId, user.id, io);
    }

    const game = games.get(roomId);

    if (!game || game.phase === 'preparing') {
        if (!game && player.room.RoomStatus !== 'waiting') {
            fail(
                409,
                'Spelet finns inte kvar på servern. Skapa ett nytt rum.'
            );
        }

        const participants = await roomService.getRoomPlayers(roomId);

        return {
            phase: game ? 'preparing' : 'waiting',
            deadline: game?.deadline ?? null,
            serverTime: Date.now(),
            isHost: player.isHost,
            players: [
                ...participants.accounts.map(function (account) {
                    return {
                        name: account.name,
                        isHost: true
                    };
                }),
                ...participants.guests.map(function (guest) {
                    return {
                        name: guest.name,
                        isHost: false
                    };
                })
            ]
        };
    }

    if (!game.players.has(player.key)) {
        fail(403, 'Du var inte med när spelet startade.');
    }

    await advance(game, io);

    const result = publicState(game, player);

    if (game.phase === 'finished') {
        const participants = await roomService.getRoomPlayers(roomId);
        result.playerCount = participants.accounts.length + participants.guests.length;
    }

    return result;
}

async function start(roomId, user, category, count, io) {
    const player = await getPlayer(roomId, user, null);

    if (!player.isHost) {
        fail(403, 'Bara värden får starta quizet.');
    }

    if (
        !categories.includes(category) ||
        ![5, 10, 15, 20].includes(count)
    ) {
        fail(400, 'Välj en giltig kategori och antal frågor.');
    }

    const previousGame = games.get(roomId);

    if (
        (previousGame && previousGame.phase !== 'finished') ||
        !['waiting', 'finished'].includes(player.room.RoomStatus)
    ) {
        fail(409, 'En quizomgång pågår redan.');
    }

    const preparingGame = { phase: 'preparing', deadline: Date.now() + 20000 };

    games.set(roomId, preparingGame);

    try {
        await db.execute(
            "UPDATE Rooms SET RoomStatus = 'waiting' WHERE RoomID = ?",
            [roomId]
        );
        io.emit('rooms:updated');

        const questions = [];

        for (let i = 0; i < count; i++) {
            const data = await questionService.getRandom(
                undefined,
                0,
                category
            );

            questions.push(makeQuestion(data, category));
        }

        await new Promise(resolve => {
            setTimeout(resolve, Math.max(0, preparingGame.deadline - Date.now()));
        });

        if (games.get(roomId) !== preparingGame) {
            fail(404, 'Quizrummet har avslutats.');
        }

        const [result] = await db.execute(
            `UPDATE Rooms
             SET RoomStatus = 'playing'
             WHERE RoomID = ?
               AND OwnerUserID = ?
               AND RoomStatus IN ('waiting', 'finished')`,
            [roomId, user.id]
        );

        if (result.affectedRows !== 1) {
            fail(409, 'Rummet kunde inte startas.');
        }

        const [guests] = await db.execute(
            `SELECT GuestID, GuestName
             FROM RoomGuests
             WHERE RoomID = ?`,
            [roomId]
        );

        if (guests.length === 0) {
            fail(409, 'Minst två spelare krävs för att starta quizet.');
        }

        const players = new Map();

        players.set(player.key, {
            name: player.name,
            score: 0
        });

        for (const guest of guests) {
            players.set('guest:' + guest.GuestID, {
                name: guest.GuestName,
                score: 0
            });
        }

        const game = {
            roundId: crypto.randomUUID(),
            roomId,
            category,
            questions,
            players,
            phase: 'playing',
            index: 0,
            answers: new Map(),
            deadline: Date.now() + 20000
        };

        games.set(roomId, game);

        io.emit('rooms:updated');

        return publicState(game, player);

    } catch (error) {
        if (games.get(roomId) === preparingGame) {
            games.delete(roomId);
            await db.execute(
                "UPDATE Rooms SET RoomStatus = 'waiting' WHERE RoomID = ?",
                [roomId]
            );
            io.emit('rooms:updated');
        }

        throw error;
    }
}

async function answer(roomId, user, token, index, choice, roundId, io) {
    const player = await getPlayer(roomId, user, token);
    const game = games.get(roomId);

    if (!game || !game.players?.has(player.key)) {
        fail(403, 'Du deltar inte i spelet.');
    }

    await advance(game, io);

    if (
    game.roundId !== roundId ||
    game.phase !== 'playing' ||
    index !== game.index
) {
        fail(409, 'Frågan är inte längre öppen.');
    }

    if (
        !Number.isInteger(choice) ||
        choice < 0 ||
        choice > 3
    ) {
        fail(400, 'Ogiltigt svar.');
    }

    if (game.answers.has(player.key)) {
        fail(409, 'Du har redan svarat.');
    }

    game.answers.set(player.key, choice);

    await advance(game, io);

    return publicState(game, player);
}

async function removePlayer(roomId, guestId) {
    const game = games.get(roomId);

    if (!game || !game.players || game.phase === 'finished') {
        return;
    }

    const playerKey = 'guest:' + guestId;

    game.players.delete(playerKey);
    game.answers.delete(playerKey);

    if (game.players.size === 1) {
        await db.execute(
            `UPDATE Rooms
             SET RoomStatus = 'waiting'
             WHERE RoomID = ?`,
            [roomId]
        );

        games.delete(roomId);
    }
}

function removeGame(roomId) {
    clearTimeout(hostTimers.get(roomId));
    hostTimers.delete(roomId);
    games.delete(roomId);
}

module.exports = {
    getState,
    start,
    answer,
    removePlayer,
    removeGame,
    keepHostAlive
};