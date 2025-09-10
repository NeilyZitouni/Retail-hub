const express = require("express");
const router = express.Router();
const Searchtest = require("../controllers/search");

router.route("/").get(Searchtest);

module.exports = router;
