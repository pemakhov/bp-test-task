const AuthModel = require('./model');

const TOKENS_NUMBER_TO_STORE = 4;

const saveRefreshToken = async (id, refreshToken) => {
  const tokens = await AuthModel.findOne({ id });
  if (!tokens) {
    return AuthModel.create({ id, refreshTokens: [refreshToken] });
  }
  // Put new refreshToken in the beginning of the array
  tokens.refreshTokens.unshift(refreshToken);
  // Copy TOKENS_NUMBER_TO_STORE tokens into the new array
  const updatedTokens = tokens.refreshTokens.slice(0, TOKENS_NUMBER_TO_STORE);
  return AuthModel.updateOne({ id, refreshTokens: updatedTokens });
};

const findTokens = (id) => AuthModel.findOne({ id });

module.exports = {
  saveRefreshToken,
  findTokens,
};
