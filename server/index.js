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
app.use(
  cors({
    origin: [
      "https://app.netlify.com/projects/player-hub-012",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  console.log("Root route hit");
  res.status(200).json({
    message: "Player Hub API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Direct routes (bypass router for now)
app.get("/api/players", (req, res) => {
  console.log("Direct /api/players route hit");
  getAllPlayers(req, res);
});

app.post("/api/register", (req, res) => {
  console.log("Direct /api/register route hit");
  registerPlayer(req, res);
});

// 404 handler
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.path,
    availableRoutes: ["GET /", "GET /api/players", "POST /api/register"],
  });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, HOST, () => {
      console.log(`Server is running and listening on http://${HOST}:${PORT}`);
      console.log("Direct routes registered:");
      console.log("  GET  /");
      console.log("  GET  /api/players");
      console.log("  POST /api/register");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
