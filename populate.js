require("dotenv").config();
const connectDB = require("./db/connectDB");
const Product = require("./models/products");
const script = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(script);
    console.log("connected to db...");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
