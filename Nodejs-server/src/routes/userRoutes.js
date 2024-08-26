// routes/userRoutes.js
const express = require('express');
const { createUser, getUsers, updateUser, authenticateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.post('/authenticate', authenticateUser);
router.delete('/:id', deleteUser);

module.exports = router;