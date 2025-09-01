const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/database");
const playerRoutes = require("./routes/playerRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";
// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", playerRoutes);

app.listen(PORT, HOST, () => {
  console.log(`Server is running and listening on http://${HOST}:${PORT}`);
});
