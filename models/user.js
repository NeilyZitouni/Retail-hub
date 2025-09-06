const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ROLES = require("./utils/constant");
const { required } = require("joi");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please provide a username"],
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "please provide an email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      ],
      minlength: [8, "password must be at least 6 characters long"],
    },
    profilePicture: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER,
    },
    refreshToken: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("refreshToken") && this.refreshToken) {
    const salt = await bcrypt.genSalt(10);
    this.refreshToken = await bcrypt.hash(this.refreshToken, salt);
  }
});

UserSchema.methods.compareRefreshToken = async function (cookiesRefreshToken) {
  const isMatch = await bcrypt.compare(cookiesRefreshToken, this.refreshToken);
  return isMatch;
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.username, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
    }
  );
};

UserSchema.methods.promoteToAdmin = async function () {
  if (this.role === ROLES.ADMIN) {
    throw new Error("user is already an admit");
  }
  this.role = ROLES.ADMIN;
  await this.save();
  return this;
};

UserSchema.methods.getName = function () {
  return this.username;
};

module.exports = mongoose.model("User", UserSchema);
