require("dotenv").config();
const connectDB = require("./db/connectDB");
const User = require("./models/user");
const script = require("./script.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await User.deleteMany();
    await User.create(script);
    console.log("connected to db...");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
