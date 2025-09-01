const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase } = require("./config/database");
const {
  getAllPlayers,
  registerPlayer,
} = require("./controllers/playerController");

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Player Hub API is running!");
});

app.get("/api/players", getAllPlayers);
app.post("/api/register", registerPlayer);

const startServer = async () => {
  try {
    // Ensure the database is initialized before the server starts
    await initializeDatabase();

    app.listen(PORT, HOST, () => {
      console.log(`Server is running and listening on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
