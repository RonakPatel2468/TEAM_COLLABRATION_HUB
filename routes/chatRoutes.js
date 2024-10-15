const express = require('express');
const { createChatRoom, getChatRooms, getChatMessages } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new chat room (optional: admin-only)
router.post('/room', authMiddleware, createChatRoom);

// Get all chat rooms
router.get('/rooms', authMiddleware, getChatRooms);

// Get messages for a specific chat room
router.get('/room/:roomId/messages', authMiddleware, getChatMessages);

module.exports = router;
