const AuthModel = require('./model');

const TOKENS_NUMBER_TO_STORE = 4;

/**
 * Function saving a token
 * @param {String} id
 * @param {String} token
 */
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

/**
 * Function extructing all tokens owned by a user with passed 'id'
 * @param {String} id
 */
const findTokens = (id) => AuthModel.findOne({ id });

/**
 * Function extrarcing all tokens
 */
const findAll = () => AuthModel.find({}).exec();

/**
 * Function deleting stored tokens
 * @param {Object} target empty, or containing user id
 */
const deleteTokens = (target) => AuthModel.deleteMany(target);

module.exports = {
  saveToken,
  findTokens,
  findAll,
  deleteTokens,
};
