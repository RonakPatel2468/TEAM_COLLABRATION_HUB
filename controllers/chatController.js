const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
// Create a new chat room
// exports.createChatRoom = async (req, res) => {
//   const { roomName } = req.body;
//   try {
//     // Check if room already exists
//     const existingRoom = await ChatRoom.findOne({ roomName });
//     if (existingRoom) {
//       return res.status(400).json({ message: 'Chat room already exists' });
//     }

//     // Create a new chat room
//     const chatRoom = new ChatRoom({ roomName });
//     await chatRoom.save();

//     res.status(201).json({ chatRoom });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.createChatRoom = async (req, res) => {
  const { roomName, members } = req.body; // Extract members from the request body

  // Ensure createdBy is set from the authenticated user
  const createdBy = req.user.id; // Assuming req.user is populated by authentication middleware

  try {
    // Check if room already exists
    const existingRoom = await ChatRoom.findOne({ roomName });
    if (existingRoom) {
      return res.status(400).json({ message: 'Chat room already exists' });
    }

    // Create a new chat room
    const chatRoom = new ChatRoom({ 
      roomName, 
      createdBy, 
      members // Include members here
    });
    await chatRoom.save();

    res.status(201).json({ chatRoom });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all chat rooms
exports.getChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find();
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get messages for a specific chat room
exports.getChatMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ chatRoom: roomId }).populate('sender', 'name');
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Send a message to a specific chat room
exports.sendMessage = async (req, res) => {
  const { content, chatRoom } = req.body;
  try {
    const message = new Message({ content, sender: req.user.id, chatRoom });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
