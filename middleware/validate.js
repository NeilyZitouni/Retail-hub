const { StatusCodes } = require("http-status-codes");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: error.details.map((err) => err.message),
      });
    }
    next();
  };
};

module.exports = validate;
