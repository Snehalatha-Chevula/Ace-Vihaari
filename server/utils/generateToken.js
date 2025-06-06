// utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (userID, role) => {
  return jwt.sign({ userID, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = generateToken;