import { connect } from "mongoose";
import { runAsync } from "../utils/shared";

/**
 * Connect to MongoDB
 */
export const connectToMongoDB = async () => {
  const [_, err] = await runAsync(connect(process.env.MONGODB_CONNECT_URL));
  if (err) {
    console.log(`Failed to connect to MongoDB Atlas\nError: ${err}`);
    process.exit(1);
  }
  console.log("Connected to MongoDB");
};
