const express = require("express");
const cors = require("cors");
require("dotenv").config();
const initializeDatabase = require("./config/database");
const playerRoutes = require("./routes/playerRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initializeDatabase();

// API Routes
app.use("/api", playerRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running and listening on port ${PORT}`);
});
