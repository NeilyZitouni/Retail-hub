const redisClient = require("./redis");
require("dotenv").config();

(async () => {
  try {
    console.log(process.env.REDIS_URI);
    await redisClient.set("hello", "world", { EX: 10 }); // expires in 10s

    const value = await redisClient.get("hello");
    console.log("Redis value:", value);

    process.exit(0);
  } catch (err) {
    console.error("Redis test failed:", err);
    process.exit(1);
  }
})();
