const mongoose = require("mongoose");
const ProductCategories = require("./utils/ProductCategories");
const priceCategories = require("./utils/priceRange");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name to the product"],
      maxlength: [20, "name must be at most 20 characters long"],
      minlength: [3, "name must have at least 3 characters"],
    },
    description: {
      type: String,
      required: false,
      maxlength: [120, "description must have at most 120 characters"],
    },
    brand: {
      type: String,
      required: [true, "must enter a company"],
      maxlength: [120, "company name must be less than 120 characters long"],
    },
    category: {
      type: String,
      enum: Object.keys(ProductCategories),
      required: [true, "must enter products categorie"],
      index: true,
    },
    subCategory: {
      type: String,
      required: [true, "Please enter a subcategory for your product"],
      validate: {
        validator: function (val) {
          return (
            ProductCategories[this.category] &&
            ProductCategories[this.category].includes(val)
          );
        },
        message: (props) => `${props.value} is not a valid subcategory `,
      },
      index: true,
    },
    price: {
      type: Number,
      required: [true, "must enter a price"],
    },
    priceCategory: {
      type: String,
      enum: Object.values(priceCategories),
      index: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "must provide a user"],
    },
    picture: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

ProductSchema.pre("save", function () {
  if (this.isModified("price")) {
    if (0 < this.price && this.price <= 50) {
      this.priceCategory = priceCategories.CHEAP;
    } else {
      if (this.price <= 150) {
        this.priceCategory = priceCategories.MEDIUM;
      } else {
        this.priceCategory = priceCategories.EXPENSIVE;
      }
    }
  }
});

ProductSchema.methods.getName = function () {
  return this.name;
};

ProductSchema.methods.getCategory = function () {
  return this.category;
};

ProductSchema.methods.getSubcategory = function () {
  return this.subCategory;
};

ProductSchema.methods.getPrice = function () {
  return this.price;
};

ProductSchema.methods.getBrand = function () {
  return this.brand;
};

ProductSchema.methods.changeName = async function (name) {
  this.name = name;
  await this.save({ validateModifiedOnly: true });
  return this;
};

ProductSchema.methods.changePrice = async function (newPrice) {
  this.price = newPrice;
  await this.save({ validateModifiedOnly: true });
  return this;
};

ProductSchema.methods.changeDescription = async function (newDescription) {
  this.description = newDescription;
  await this.save({ validateModifiedOnly: true });
  return this;
};

ProductSchema.methods.changeBrand = async function (newCompany) {
  this.brand = newCompany;
  await this.save({ validateModifiedOnly: true });
  return this;
};

module.exports = mongoose.model("Product", ProductSchema);
