import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("========================================");
      console.log(`🚀 Server running on Port ${PORT}`);
      console.log(`🌍 Environment : ${process.env.NODE_ENV}`);
      console.log(`📡 API : http://localhost:${PORT}/api/v1`);
      console.log("========================================");
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();
