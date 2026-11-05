const express = require('express');
const router = express.Router();

const requireAuth = require('../middleware/requireAuth');
const gameController = require('../controllers/gameController');



router.get('/recent', gameController.getRecentGames);

router.get('/me/recent', requireAuth, gameController.getMyRecentGames);
router.post('/complete', requireAuth, gameController.completeGame);



module.exports = router;

