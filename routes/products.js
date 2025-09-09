const express = require("express");
const router = express.Router();

const {
  getAllproducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsCreatedByUser,
} = require("../controllers/products");

router.route("/").get(getAllproducts).post(createProduct);
router.route("/created").get(getAllProductsCreatedByUser);

router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
