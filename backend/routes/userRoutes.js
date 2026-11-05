const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const requireOwnerOrAdmin = require('../middleware/requireOwnerOrAdmin');
const attachUser = require('../middleware/attachUser');
const rateLimit = require('express-rate-limit');

// Högst 10 profiländringsförsök per användare under 15 minuter.
const updateUserLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: function (req) {
        return String(req.user.id);
    },
    message: {
        error: 'För många försök att ändra kontot. Försök igen om 15 minuter.'
    }
});

// CREATE
router.post('/', userController.createUser);

// Hämta aktuell användare för de återstående användarvägarna.
router.use(attachUser);

// READ
router.get(
    '/',
    requireAuth,
    requireAdmin,
    userController.getAllUsers
);

router.get(
    '/username/:username',
    requireAuth,
    requireAdmin,
    userController.getUserByUsername
);

router.get(
    '/email/:email',
    requireAuth,
    requireAdmin,
    userController.getUserByEmail
);

router.get(
    '/:id',
    requireAuth,
    requireOwnerOrAdmin,
    userController.getUserById
);

// UPDATE
router.put(
    '/:id',
    requireAuth,
    requireOwnerOrAdmin,
    updateUserLimiter,
    userController.updateUser
);

// DELETE
router.delete(
    '/:id',
    requireAuth,
    requireOwnerOrAdmin,
    updateUserLimiter,
    userController.deleteUser
);

module.exports = router;