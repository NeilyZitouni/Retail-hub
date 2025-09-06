const {
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} = require("../errors");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const refreshAccessToken = async (req, res) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  if (!cookieRefreshToken) {
    throw new UnauthorizedError("Refresh token not provided");
  }
  const { userId, username, role } = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError(`no user with id : ${userId}`);
  }
  const isMatch = await user.compareRefreshToken(cookieRefreshToken);
  if (!isMatch) {
    throw new UnauthorizedError("invalid refresh token");
  }
  const newAccessToken = user.createJWT();
  res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
};

module.exports = refreshAccessToken;
