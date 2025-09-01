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

// Listen on the assigned port and the host '0.0.0.0' to accept public connections
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running and listening on port ${PORT}`);
});
