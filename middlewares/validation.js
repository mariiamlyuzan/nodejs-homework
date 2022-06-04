const Joi = require("joi");

module.exports = {
  contactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }

    next();
  },

  contactFavoriteValidation: (req, res, next) => {
    const schema = Joi.object({
      favorite: Joi.string().valid(true, false).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }

    next();
  },
  userRegisterValidation: (req, res, next) => {
    const schema = Joi.object({
      password: Joi.string().min(2).max(30).required(),
      email: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }

    next();
  },
  userLogInValidation: (req, res, next) => {
    const schema = Joi.object({
      password: Joi.string().min(2).max(30).required(),
      email: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }

    next();
  },
  userSubscriptionValidation: (req, res, next) => {
    const schema = Joi.object({
      subscription: Joi.string().valid("starter", "pro", "business"),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }

    next();
  },
};
