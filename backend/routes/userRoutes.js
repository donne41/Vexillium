const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CREATE
router.post('/', userController.createUser);

// READ
router.get('/', userController.getAllUsers);
router.get('/username/:username', userController.getUserByUsername);
router.get('/email/:email', userController.getUserByEmail);
router.get('/:id', userController.getUserById);

// UPDATE
router.put('/:id', userController.updateUser);

// DELETE
router.delete('/:id', userController.deleteUser);

module.exports = router;