const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => jwt.sign(payload,
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });

const generateRefreshToken = (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

const decodeAccessToken = (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
const decodeRefreshToken = (token) => jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

module.exports = {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
};
