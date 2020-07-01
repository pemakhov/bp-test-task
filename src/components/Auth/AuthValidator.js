const Joi = require('@hapi/joi');

/**
 * Class validating input for Auth component routs
 */
class AuthValidator {
  constructor() {
    this.Joi = Joi;
  }

  /**
   * Validates /signin route
   * @param {Object} profile contains 'id' and 'password'
   */
  signIn(profile) {
    return this.Joi.object({
      id: this.Joi.string()
        .required(),
      password: this.Joi.string()
        .required(),
    })
      .validate(profile);
  }
}

module.exports = new AuthValidator();
