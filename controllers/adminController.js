const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const user = require("../models/user");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "customer" }).select(
    "username email _id"
  );
  if (!users || users.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json({ msg: "there is no customers in the data base" });
  }
  res.status(StatusCodes.OK).json({
    nbHits: users.length,
    users: users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
    })),
  });
};

const getUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "no id provided" });
  }
  const user = await User.findById(id).select("username email _id");
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no user with ${id}` });
  }
  res.status(StatusCodes.OK).json(user);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "no id provided" });
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no user with ${id}` });
  }
  res.status(StatusCodes.OK).json({ msg: `deleted user with id : ${id}` });
};

const changeUser = async (req, res) => {
  const { id } = req.params;
  if (req.body.password || req.body.email) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "you can only change the username of the user" });
  }
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "no id provided" });
  }
  const newUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!newUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no user with id : ${id}` });
  }
  res.status(StatusCodes.OK).json({
    msg: "updated user",
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
};

const getUsersCountriesStatistics = async (req, res) => {
  const results = await User.aggregate([
    { $match: { role: { $in: ["customer", "seller"] } } },
    { $group: { _id: "$coordinates.country", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  if (!results) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong please try again later" });
  }
  res.status(StatusCodes.OK).json({ results });
};

module.exports = {
  getAllUsers,
  getUser,
  deleteUser,
  changeUser,
  getUsersCountriesStatistics,
};
