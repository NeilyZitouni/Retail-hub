const express = require("express");
const router = express.Router();

const {
  getAllproducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsCreatedByUser,
  getAllProductsByCategory,
  getAllProductsBySubCategory,
  getAllProductsByPriceCategory,
} = require("../controllers/products");

router.route("/").get(getAllproducts).post(createProduct);
router.route("/created").get(getAllProductsCreatedByUser);
router.route("/category").get(getAllProductsByCategory);
router.route("/subcategory").get(getAllProductsBySubCategory);
router.route("/pricecategory").get(getAllProductsByPriceCategory);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
