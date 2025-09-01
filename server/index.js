const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase } = require("./config/database");
const playerRoutes = require("./routes/playerRoutes");

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

// Middleware
app.use(
  cors({
    origin: [
      "https://candid-jalebi-19e038.netlify.app",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Player Hub API is running!",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", playerRoutes);

const startServer = async () => {
  try {
    console.log("Environment PORT:", process.env.PORT);
    console.log("Using PORT:", PORT);

    await initializeDatabase();

    app.listen(PORT, HOST, () => {
      console.log(`Server is running and listening on http://${HOST}:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
