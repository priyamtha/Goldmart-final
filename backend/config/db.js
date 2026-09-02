import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/goldmart';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Database connection warning: ${error.message}`);
    console.log(`[MongoDB] Running with in-memory fallback storage mode for instant local testing.`);
    return false;
  }
};

export default connectDB;
