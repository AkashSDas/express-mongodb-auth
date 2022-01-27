// Loading env vars
import { config } from "dotenv";
config();

// Connect to MongoDB
import { connectToMongoDB } from "./config/db";
connectToMongoDB();

import { app } from "./api";

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () =>
  console.log(`API is available on http://localhost:${port}`)
);
