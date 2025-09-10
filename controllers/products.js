const { json } = require("express");
const Product = require("../models/products");
const { StatusCodes } = require("http-status-codes");

const getAllproducts = async (req, res) => {
  const products = await Product.find({});
  if (products.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `the database is empty !!!` });
  }
  res.status(StatusCodes.OK).json({
    nbHits: products.length,
    products,
  });
};

const getAllProductsCreatedByUser = async (req, res) => {
  const { userId } = req.user;
  if (!userId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "User not authenticated" });
  }
  const products = await Product.find({ createdBy: userId });
  if (products.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no product with id : ${id}` });
  }
  if (!products) {
    return res
      .status(StatusCodes.OK)
      .json({ msg: "you havent created anything yet" });
  }
  res.status(StatusCodes.OK).json({ nbHits: products.length, products });
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide the product's id" });
  }
  const product = await Product.findById(id);
  if (!product) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no product with id : ${id}` });
  }
  res.status(StatusCodes.OK).json({ product });
};

const createProduct = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const newProduct = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ newProduct });
};

const updateProduct = async (req, res) => {
  const {
    body: { name, description, company, category, price, priceCategory },
    user: { userId },
    params: { id: productId },
  } = req;
  if (
    name === "" ||
    company === "" ||
    category === "" ||
    price === "" ||
    priceCategory === ""
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json("name, company, category, price and priceCategory cannot be empty");
  }
  const newproduct = await Product.findOneAndUpdate(
    { _id: productId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!newproduct) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `the product you are looking for doesn't exists` });
  }
  res.status(StatusCodes.OK).json({ newproduct });
};

const deleteProduct = async (req, res) => {
  const {
    params: { id: productId },
    user: { userId },
  } = req;
  if (!productId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please enter a product id" });
  }
  const result = await Product.findOneAndDelete({
    _id: productId,
    createdBy: userId,
  });
  if (!result) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no product with id : ${productId}` });
  }
  res.status(StatusCodes.OK).json({ msg: "deleted the product successfully" });
};

const getAllProductsByCategory = async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(StatusCodes.BAD_REQUEST).json("please choose a category");
  }
  const results = await Product.find({ category: { $all: [category] } })
    .select("name price description")
    .sort("-price");
  if (!results) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json("nothing matches the category you have chosen");
  }
  res.status(StatusCodes.OK).json({ nbHits: results.length, results });
};

const getAllProductsBySubCategory = async (req, res) => {
  const { subcategory } = req.query;
  if (!subcategory) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please enter a subcategorty" });
  }
  const results = await Product.find({ subCategory: { $all: [subcategory] } })
    .select("name price description")
    .sort("-price");
  if (!results) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "nothing matches the subcategory you chose" });
  }
  res.status(StatusCodes.OK).json({ nbHits: results.length, results });
};

module.exports = {
  getAllproducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsCreatedByUser,
  getAllProductsByCategory,
  getAllProductsBySubCategory,
};
