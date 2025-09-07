const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/authentication");
const { registerSchema } = require("../validator/authSchema");
const refreshAccessToken = require("../controllers/refreshTokenController");
const validate = require("../middleware/validate");

router.post("/login", login);
router.post("/register", validate(registerSchema), register);
router.post("/logout", logout);
router.post("/refreshtoken", refreshAccessToken);

module.exports = router;
