const CustomAPIError = require("./customAPIError");
const BadRequestError = require("./bad-request");
const ForbiddenError = require("./forbidden");
const NotFoundError = require("./not-found");
const UnauthorizedError = require("./unauthorized-error");

module.exports = {
  CustomAPIError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
};
