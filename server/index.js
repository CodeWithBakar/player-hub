const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/database");
const playerRoutes = require("./routes/playerRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", playerRoutes);

// Health check route (important for Railway)
app.get("/", (req, res) => {
  res.send("Player Hub API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
