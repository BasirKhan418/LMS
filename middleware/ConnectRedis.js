import { createClient } from "redis";

let redisClient = null; // Singleton instance

const ConnectRedis = async () => {
  try {
    // Return the existing instance if it already exists
    if (redisClient) {
      console.log("Using existing Redis client instance.");
      return redisClient;
    }

    // Create a new client instance
    redisClient = createClient({
      username: "default",
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
      },
    });

    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    await redisClient.connect();
    console.log("Redis client connected.");

    return redisClient;
  } catch (err) {
    console.log("Error connecting to Redis:", err);
    throw err; // Rethrow the error to handle it outside if needed
  }
};

export default ConnectRedis;
