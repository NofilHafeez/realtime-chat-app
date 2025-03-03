const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token; // Assuming you're using cookies for token storage

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    req.user = user; // Attach user to the request
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateUser;
