const Joi = require('@hapi/joi');

/**
 * Class validating input for User component routs
 */
class UserValidator {
  constructor() {
    this.Joi = Joi;
  }

  /**
   * Validates input for findOne function
   * @param {Object} data should contain 'id'
   */
  findById(data) {
    return this.Joi.object({
      id: this.Joi.string()
        .required()
        .min(5),
    })
      .validate(data);
  }

  /**
   * Validates /signup route
   * @param {Object} profile
   */
  create(profile) {
    return this.Joi.object({
      phone: this.Joi.string()
        .pattern(new RegExp('^[0-9]{5,32}$')),
      email: this.Joi.string()
        .email({}),
      password: this.Joi.string()
        .min(6)
        .max(40),
    })
      .or('phone', 'email')
      .validate(profile);
  }
}

module.exports = new UserValidator();
