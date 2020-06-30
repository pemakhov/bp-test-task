const Joi = require('@hapi/joi');

class AuthValidator {
  constructor() {
    this.Joi = Joi;
  }

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
