const express = require('express');
const router = express.Router();

const attachUser = require('../middleware/attachUser');
const requireAuth = require('../middleware/requireAuth');
const roomGameService = require('../services/roomGameService');

function sendError(res, error) {
    if (!error.status) {
        console.error(error);
    }

    return res.status(error.status || 500).json({
        error: error.status
            ? error.message
            : 'Ett serverfel uppstod.'
    });
}

router.get('/:roomId/game', attachUser, async (req, res) => {
    try {
        const state = await roomGameService.getState(
            Number(req.params.roomId),
            req.user,
            req.get('X-Guest-Token'),
            req.app.get('io')
        );

        res.json(state);
    } catch (error) {
        sendError(res, error);
    }
});

router.post(
    '/:roomId/game/start',
    attachUser,
    requireAuth,
    async (req, res) => {
        try {
            const state = await roomGameService.start(
                Number(req.params.roomId),
                req.user,
                req.body?.category,
                req.body?.count,
                req.app.get('io')
            );

            res.status(201).json(state);
        } catch (error) {
            sendError(res, error);
        }
    }
);

router.post(
    '/:roomId/game/answer',
    attachUser,
    async (req, res) => {
        try {
            const state = await roomGameService.answer(
                Number(req.params.roomId),
                req.user,
                req.get('X-Guest-Token'),
                req.body?.questionIndex,
                req.body?.choice,
                req.body?.roundId,
                req.app.get('io')
            );

            res.json(state);
        } catch (error) {
            sendError(res, error);
        }
    }
);

module.exports = router;