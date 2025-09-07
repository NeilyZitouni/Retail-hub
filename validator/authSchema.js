const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).*$'
      )
    )
    .message(
      "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character"
    )
    .required(),
  role: Joi.string().valid("customer").default("customer").messages({
    "any.only": "You can only register as a customer",
  }),
});

module.exports = { registerSchema };
