const express = require("express");
const cors = "cors";
require("dotenv").config();
const { initializeDatabase } = require("./config/database");
const playerRoutes = require("./routes/playerRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// Middleware
app.use(express.json());

// API Routes
app.use("/api", playerRoutes);

const startServer = async () => {
  // Ensure the database is initialized before the server starts
  await initializeDatabase();

  app.listen(PORT, HOST, () => {
    console.log(`Server is running and listening on http://${HOST}:${PORT}`);
  });
};

startServer();
