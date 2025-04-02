import mongoose from "mongoose";

let isConnected = false; // Singleton indicator for the connection status

const ConnectDb = async () => {
  try {
    // Check if the connection is already established
    if (isConnected) {
      console.log("Using existing MongoDB connection.");
      return;
    }

    // Establish a new connection
    const dbConnection = await mongoose.connect(process.env.MONGO_URL);
    
    isConnected = dbConnection.connections[0].readyState === 1; // Set connection status
    console.log("Connected to the database");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
    throw err; // Rethrow the error to handle it outside if needed
  }
};

export default ConnectDb;
