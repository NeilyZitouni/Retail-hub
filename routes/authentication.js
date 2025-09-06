const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/authentication");
const refreshAccessToken = require("../controllers/refreshTokenController");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refreshtoken", refreshAccessToken);

module.exports = router;
