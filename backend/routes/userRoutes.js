const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const requireOwnerOrAdmin = require('../middleware/requireOwnerOrAdmin');

// CREATE
router.post('/', userController.createUser);

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
    userController.updateUser
);

// DELETE
router.delete(
    '/:id',
    requireAuth,
    requireOwnerOrAdmin,
    userController.deleteUser
);

module.exports = router;