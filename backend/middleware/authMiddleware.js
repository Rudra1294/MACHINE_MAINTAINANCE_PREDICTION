const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  try {
    // Remove "Bearer " if included in the header
    const cleanToken = token.replace('Bearer ', '');
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.admin = verified;
    next(); 
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = verifyToken;