import jwt from 'jsonwebtoken';

/**
 * Generate signed JWT Token for authenticated users
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {string} - JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

export default generateToken;
