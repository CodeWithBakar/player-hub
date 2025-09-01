const express = require("express");
const cors = require("cors"); // Corrected: require('cors') not 'cors'
require("dotenv").config();
const { initializeDatabase } = require("./config/database");
const playerRoutes = require("./routes/playerRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// Middleware
app.use(cors()); // Corrected: app.use(cors()) to enable it
app.use(express.json());

// API Routes
app.use("/api", playerRoutes);

const startServer = async () => {
  try {
    // Ensure the database is initialized before the server starts
    await initializeDatabase();

    app.listen(PORT, HOST, () => {
      console.log(`Server is running and listening on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    // This will catch any errors during startup (like DB connection issues)
    // and log them, preventing the silent crash.
    console.error("Failed to start server:", error);
    process.exit(1); // Exit with an error code
  }
};

startServer();
