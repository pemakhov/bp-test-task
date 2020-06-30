const Joi = require('@hapi/joi');

class UserValidator {
  constructor() {
    this.Joi = Joi;
  }

  findById(data) {
    return this.Joi.object({
      id: this.Joi.string()
        .required()
        .min(5),
    })
      .validate(data);
  }

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
