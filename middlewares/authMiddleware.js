// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (!token) {
//         return res.status(403).json({ message: 'No token provided' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(500).json({ message: 'Failed to authenticate token' });
//         }
//         req.user = decoded; // Add the decoded user info to the request
//         next();
//     });
// };

// module.exports = authMiddleware;
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    req.user = decoded; // Attach decoded token payload to request
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authMiddleware;




