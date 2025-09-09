const express = require("express");
const router = express.Router();

const {
  deleteUser,
  getAllUsers,
  getUser,
  changeUser,
  getUsersCountriesStatistics,
} = require("../controllers/adminController");

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(changeUser).delete(deleteUser);
router.route("/statistics/coutry").get(getUsersCountriesStatistics);

module.exports = router;
