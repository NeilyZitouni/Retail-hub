const express = require("express");
const router = express.Router();

const {
  deleteUser,
  getAllUsers,
  getUser,
  changeUser,
  getUsersCountriesStatistics,
  productCategoryStatistics,
  productSubcategoryStatistics,
  productPricecategoryStatistics,
} = require("../controllers/adminController");

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(changeUser).delete(deleteUser);
router.route("/statistics/coutry").get(getUsersCountriesStatistics);
router.route("/statistics/product/category").get(productCategoryStatistics);
router.route("/statistics/product/subcategory").get(productSubcategoryStatistics);
router.route("/statistics/product/pricecategory").get(productPricecategoryStatistics);

module.exports = router;
