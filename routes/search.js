const express = require("express");
const router = express.Router();
const { Searchtest, Searchtest2 } = require("../controllers/search");

router.route("/").get(Searchtest);
router.route("/advanced").get(Searchtest2);

module.exports = router;
