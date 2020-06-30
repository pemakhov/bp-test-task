const { Schema } = require('mongoose');
const connections = require('../../db/connection');

const AuthSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    refreshTokens: {
      type: [String],
    },
  },
  {
    collection: 'refresh_tokens',
    versionKey: false,
  },
);

module.exports = connections.model('AuthModel', AuthSchema);
