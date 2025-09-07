const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const adminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "most provide a token" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "must provide a token" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role === "admin") {
      req.user = payload;
      next();
    } else {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "this route is unauthorized for you" });
    }
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Authentication failed : invalid token please try again later",
    });
  }
};
module.exports = adminAuthMiddleware;
