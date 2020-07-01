const UserService = require('./service');
const UserValidator = require('./UserValidator');
const ValidationError = require('../../errors/ValidationError');
const { decodeToken } = require('../Auth/index');

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

const getInfo = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.sendStatus(401);
    }
    const user = decodeToken(token);

    res.status(200).send({ id: user.id, id_type: user.id_type });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findAll,
  create,
  getInfo,
};
