const jwt = require('jsonwebtoken');
const UserService = require('./service');
const UserValidator = require('./UserValidator');
const ValidationError = require('../../errors/ValidationError');
const AuthenticacionError = require('../../errors/AuthenticationError');

const findAll = async (req, res, next) => {
  try {
    const users = await UserService.findAll();

    res.status(200).json({
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: error.status,
    });

    next(error);
  }
};

const create = async (req, res, next) => {
  const createProfile = (data) => {
    const id = data.email ? data.email : data.phone;
    const idType = data.email ? 'email' : 'phone';
    return { id, id_type: idType, password: data.password };
  };

  try {
    const { error } = UserValidator.create(req.body);

    if (error) {
      throw new ValidationError(error.details);
    }

    const user = await UserService.create(createProfile(req.body));

    return res.status(200).json({ data: user });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({
        message: error.name,
        details: error.message,
      });
    }

    res.status(500).json({
      message: error.name,
      details: error.message,
    });

    return next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { error } = UserValidator.signIn(req.body);

    if (error) {
      throw new ValidationError(error.details);
    }

    const user = await UserService.findById(req.body.id);

    if (!user.id || user.id !== req.body.id) {
      throw new AuthenticacionError();
    }

    const payload = {
      id: user.id,
      id_type: user.id_type,
      password: user.password,
    };
    console.log(process.env.ACCESS_TOKEN_SECRET);
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

    return res.status(200).json({ accessToken });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({
        message: error.name,
        details: error.message,
      });
    }

    if (error instanceof AuthenticacionError) {
      return res.status(404).json({
        message: error.name,
        details: error.message,
      });
    }

    res.status(500).json({
      message: error.name,
      details: error.message,
    });

    return next(error);
  }
};

module.exports = {
  findAll,
  create,
  signIn,
};
