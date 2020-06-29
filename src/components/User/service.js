const UserModel = require('./model');

const findAll = () => UserModel.find({}).exec();

const create = (profile) => UserModel.create(profile);

const findById = (id) => UserModel.findOne({ id });

module.exports = {
  findAll,
  create,
  findById,
};
