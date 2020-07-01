const AuthModel = require('./model');

const TOKENS_NUMBER_TO_STORE = 4;

const saveToken = async (id, token) => {
  const userTokens = await AuthModel.findOne({ id });
  if (!userTokens) {
    return AuthModel.create({ id, tokens: [token] });
  }
  // Put new token in the beginning of the array
  userTokens.tokens.unshift(token);
  // Copy TOKENS_NUMBER_TO_STORE tokens into the new array
  const updatedTokens = userTokens.tokens.slice(0, TOKENS_NUMBER_TO_STORE);
  return AuthModel.updateOne({ id }, { tokens: updatedTokens });
};

const findTokens = (id) => AuthModel.findOne({ id });

const findAll = () => AuthModel.find({}).exec();

module.exports = {
  saveToken,
  findTokens,
  findAll,
};
