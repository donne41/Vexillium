const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const attachUser = require('../middleware/attachUser');

router.get('/', roomController.getPublicRooms);
router.get('/:inviteCode', roomController.getRoomByCode);
router.get('/:roomId/players', roomController.getRoomPlayers);

router.post('/', attachUser, roomController.createRoom);
router.post('/join', attachUser, roomController.joinRoom);
router.post('/:roomId/join-public', attachUser, roomController.joinPublicRoom);
router.post('/:roomId/leave', roomController.leaveRoom);
router.post('/:roomId/validate-session', roomController.validateGuestSession);
router.delete('/:roomId', attachUser, roomController.deleteRoom);

module.exports = router;