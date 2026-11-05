const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Publik profil, kräver ingen inloggning.
router.get('/:id', profileController.getProfile);

module.exports = router;