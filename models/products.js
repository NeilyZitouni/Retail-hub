const { name } = require("@adminjs/express");
const { required } = require("joi");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name to the product"],
    maxLength: [20, "name must be at most 20 characters long"],
    minLenght: [3, "name must have at least 3 characters"],
  },
  description: {
    type: Text,
    required: false,
    maxLength: [120, "description must have at most 120 characters"],
  },
});

module.exports = mongoose.model("Product", ProductSchema);
