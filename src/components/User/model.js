const { Schema } = require('mongoose');
const connections = require('../../db/connection');

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    id_type: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'users',
    versionKey: false,
  },
);

module.exports = connections.model('UserModel', UserSchema);
