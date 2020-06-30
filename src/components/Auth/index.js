const UserService = require('../User/service');
const AuthService = require('./service');
const AuthValidator = require('./AuthValidator');
const ValidationError = require('../../errors/ValidationError');
const AuthenticacionError = require('../../errors/AuthenticationError');
const { generateAccessToken, generateRefreshToken, decodeRefreshToken } = require('./token');

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
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    AuthService.saveRefreshToken(user.id, refreshToken);

    return res.status(200).json({ accessToken, refreshToken });
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

const updateToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.sendStatus(401);
    }

    const user = decodeRefreshToken(refreshToken);

    // Object containing id and tokens, related to this id
    const tokensFromDb = await AuthService.findTokens(user.id);

    if (!tokensFromDb || !tokensFromDb.refreshTokens.includes(refreshToken)) {
      return res.sendStatus(403);
    }

    const payload = { id: user.id, id_type: user.id_type, password: user.password };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    AuthService.saveRefreshToken(user.id, newRefreshToken);

    return res.status(200).json({ newAccessToken, newRefreshToken });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signIn,
  updateToken,
};
