const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const { UnauthorizedError, NotFoundError } = require("../errors");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const accessToken = user.createJWT();
  const refreshToken = user.createRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res
    .status(StatusCodes.CREATED)
    .json({ username: user.getName(), accessToken });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "must provide an email and password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no user with email ${email}` });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "invalid password" });
  }
  const accessToken = user.createJWT();
  const refreshToken = user.createRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateModifiedOnly: true });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.username }, accessToken });
};

const logout = async (req, res) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  if (!cookieRefreshToken) {
    throw new UnauthorizedError(
      "Must provide refresh token please try again later"
    );
  }
  const { userId, username, role } = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError(`No users with id ${userId}`);
  }
  const isMatch = await user.compareRefreshToken(cookieRefreshToken);
  if (!isMatch) {
    throw new UnauthorizedError("invalid refresh token");
  }
  user.refreshToken = null;
  await user.save({ validateModifiedOnly: true });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(StatusCodes.OK).json({ msg: "logout successful!!" });
};

module.exports = {
  login,
  register,
  logout,
};
