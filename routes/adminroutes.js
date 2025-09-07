const express = require("express");
const router = express.Router();

const {
  deleteUser,
  getAllUsers,
  getUser,
  changeUser,
} = require("../controllers/adminController");

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(changeUser).delete(deleteUser);

module.exports = router;
