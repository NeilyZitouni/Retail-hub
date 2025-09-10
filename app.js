require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const connectDB = require("./db/connectDB");
const PORT = process.env.PORT || 3000;
const authenticationRoute = require("./routes/authentication");
const productsRoute = require("./routes/products");
const authMiddleware = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const AdminRoutes = require("./routes/adminroutes");
const adminAuth = require("./middleware/adminAuth");
const searchRoutes = require("./routes/search");

const { admin, adminRouter } = require("./admin");

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to retail hub</h1>`);
});

app.use(admin.options.rootPath, adminRouter);

app.use("/api/v1/auth", authenticationRoute);
app.use("/api/v1/products", authMiddleware, productsRoute);
app.use("/api/v1/admin", authMiddleware, adminAuth, AdminRoutes);
app.use("/api/v1/search", authMiddleware, searchRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully!");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log(
        `AdminJS available at http://localhost:${PORT}${admin.options.rootPath}`
      );
    });
  } catch (error) {
    console.log("Error:", error);
  }
};

start();
