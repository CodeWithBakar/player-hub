const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/database");
const playerRoutes = require("./routes/playerRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // This is the crucial line for container environments

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", playerRoutes);

// Listen on the assigned port and host to accept connections from outside the container
app.listen(PORT, HOST, () => {
  console.log(`Server is running and listening on http://${HOST}:${PORT}`);
});
