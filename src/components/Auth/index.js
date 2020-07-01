const jwt = require('jsonwebtoken');
const UserService = require('../User/service');
const AuthService = require('./service');
const AuthValidator = require('./AuthValidator');
const ValidationError = require('../../errors/ValidationError');
const AuthenticacionError = require('../../errors/AuthenticationError');

const generateToken = (payload) => jwt.sign(payload, process.env.TOKEN_SECRET,
  { expiresIn: process.env.TOKEN_EXPIRES_IN });

const decodeToken = (token) => jwt.verify(token, process.env.TOKEN_SECRET);

const signIn = async (req, res, next) => {
  try {
    const { error } = AuthValidator.signIn(req.body);

    if (error) {
      throw new ValidationError(error.details);
    }

    const user = await UserService.findById(req.body.id);

    if (!user.id || user.id !== req.body.id) {
      throw new AuthenticacionError();
    }

    const payload = { id: user.id, id_type: user.id_type, password: user.password };
    const token = generateToken(payload);

    AuthService.saveToken(user.id, token);

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ message: error.name, details: error.message });
    }

    if (error instanceof AuthenticacionError) {
      return res.status(404).json({ message: error.name, details: error.message });
    }

    res.status(500).json({ message: error.name, details: error.message });

    return next(error);
  }
};

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) {
      return res.sendStatus(401);
    }

    const user = decodeToken(token);

    // Object containing id and tokens, related to this id
    const tokensFromDb = await AuthService.findTokens(user.id);

    if (!tokensFromDb || !tokensFromDb.tokens.includes(token)) {
      return res.sendStatus(403);
    }
    req.body.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { user } = req.body;

    const payload = { id: user.id, id_type: user.id_type, password: user.password };
    const newToken = generateToken(payload);

    AuthService.saveToken(user.id, newToken);

    // send refreshed token
    res.cookie('token', newToken);
    return next();
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { user } = req.body;
    const target = (!req.query.all || req.query.all === 'false') ? { id: user.id } : {};

    await AuthService.deleteTokens(target);
    next();
  } catch (error) {
    next(error);
  }
};

const getTokens = async (req, res, next) => {
  try {
    const tokens = await AuthService.findAll();
    return res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  decodeToken,
  signIn,
  authenticateToken,
  refreshToken,
  logout,
  getTokens,
};
