const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id, user.role);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`Entered Password: ${password}`); // Debugging log
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Password mismatch"); // Debugging log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// exports.assignRole = async (req, res) => {
//   const { userId, role } = req.body; // Assume `userId` and `role` are provided in the body
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' }); // Not Found
//     }
//     if (!['user', 'admin'].includes(role)) {
//       return res.status(400).json({ message: 'Invalid role' }); // Bad Request
//     }
//     user.role = role;
//     await user.save();
//     res.status(200).json({ message: 'Role assigned successfully', user }); // OK
//   } catch (error) {
//     res.status(500).json({ message: 'Server error: ' + error.message }); // Internal Server Error
//   }
// };
