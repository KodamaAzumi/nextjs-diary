import mongoose from "mongoose";

const connectDB = async (): Promise<boolean> => {
  // すでに接続されている
  if (mongoose.connections[0].readyState) {
    return true;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("MongoDBと接続中・・・");
    return true;
  } catch (err) {
    console.error("MongoDB接続エラー:", err);
    return false;
  }
};

export default connectDB;
