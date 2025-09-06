const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ username: user.getName(), token });
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
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.username }, token });
};

module.exports = {
  login,
  register,
};
