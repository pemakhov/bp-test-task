const UserModel = require('./model');

/**
 * Function extracting all users from the database
 */
const findAll = () => UserModel.find({}).exec();

/**
 * Function saving a new user in the database
 * @param {Object} profile should contain 'phone' or 'email', 'password'
 *                          and 'id_type' ('phone' or 'email')
 */
const create = (profile) => UserModel.create(profile);

/**
 * Function extracting a user by 'id'
 * @param {String} id
 */
const findById = (id) => UserModel.findOne({ id });

module.exports = {
  findAll,
  create,
  findById,
};
