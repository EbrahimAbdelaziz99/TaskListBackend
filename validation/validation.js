const Joi = require("joi");

module.exports.taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports.userSchema = Joi.object({
  admin: Joi.boolean().optional(),
  email: Joi.string().required(),
  username: Joi.string().required,
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmPassword: Joi.ref("password"),
});
