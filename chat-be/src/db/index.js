import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected MongoDB");
  } catch (error) {
    console.error("Failed to connect mongoDB", error);
  }
};

export default connectDB;
