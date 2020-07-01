const UserService = require('./service');
const UserValidator = require('./UserValidator');
const ValidationError = require('../../errors/ValidationError');
const { decodeToken } = require('../Auth/index');

/**
 * A function extracting from database and returning all users
 * It was not required by the task
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
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

/**
 * A function creating and storing a user
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 * @throws ValidationError
 */
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
    req.body = { id: user.id, password: user.password };

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ message: error.name, details: error.message });
    }
    res.status(500).json({ message: error.name, details: error.message });

    return next(error);
  }
};

/**
 * A function getting info from the token's payload
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
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
