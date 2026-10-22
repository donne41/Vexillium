const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');

// Max 10 misslyckade inloggningsförsök per IP-adress och 15 minuter.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'För många inloggningsförsök. Försök igen om en stund.' }
});

router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);

module.exports = router;