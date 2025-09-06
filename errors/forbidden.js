const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customAPIError");

class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.StatusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
