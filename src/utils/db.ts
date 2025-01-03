import mongoose from "mongoose";

const url = "mongodb://localhost:27017";

export const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      dbName: "Ecommerce_TS",
    });
    console.log("Connected to the database successfully.");
  } catch (error:unknown) {
    if(error instanceof Error)
    console.error("Failed to connect to the database:", error.message);
    else
    console.error("An unknown error occurred",error)
    process.exit(1); 
  }
};
