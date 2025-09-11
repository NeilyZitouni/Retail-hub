require("dotenv").config();

const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URI,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
  try {
    await redisClient.connect();
    console.log(" Connected to Redis Cloud");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

module.exports = redisClient;
