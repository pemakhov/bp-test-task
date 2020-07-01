const { Schema } = require('mongoose');
const connections = require('../../db/connection');

/**
 * The model for the token storage document
 */
const AuthSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    tokens: {
      type: [String],
    },
  },
  {
    collection: 'refresh_tokens',
    versionKey: false,
  },
);

module.exports = connections.model('AuthModel', AuthSchema);
