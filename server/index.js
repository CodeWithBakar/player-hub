// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const playerRoutes = require("./routes/playerRoutes");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// API Routes
// All routes related to players will be prefixed with /api/players
app.use("/api/players", playerRoutes);

// Global Error Handler (simple version)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
