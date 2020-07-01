const jwt = require('jsonwebtoken');
const UserService = require('../User/service');
const AuthService = require('./service');
const AuthValidator = require('./AuthValidator');
const ValidationError = require('../../errors/ValidationError');
const AuthenticacionError = require('../../errors/AuthenticationError');

/**
 * Generates authentication token
 * @param {Object} payload contains incapsulated into the token useful information
 */
const generateToken = (payload) => jwt.sign(payload, process.env.TOKEN_SECRET,
  { expiresIn: process.env.TOKEN_EXPIRES_IN });

/**
 * Extracts payload from the token
 * @param {String} token authentication token
 */
const decodeToken = (token) => jwt.verify(token, process.env.TOKEN_SECRET);

/**
 * A function managing user signing in
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 * @returns {Promise}
 * @throws AuthenticationError and ValidationError
 */
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

/**
 * A function checking token for its existance and expiration
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
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

/**
 * A function creating a new token and sending it with cookies
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
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

/**
 * A function deleting active tokens
 * @param req.query.all if true - all tokens of all users will be deleted
 *                      if false - all tokens of a current user will be deleted
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
const logout = async (req, res, next) => {
  try {
    const { user } = req.body;
    const target = (!req.query.all || req.query.all === 'false') ? { id: user.id } : {};

    await AuthService.deleteTokens(target);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

/**
 * A function extracting from database and returning all active tokens
 * This function was not required by the task
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
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
