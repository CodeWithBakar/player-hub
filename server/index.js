const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase } = require("./config/database");

// Import all the route handlers
const playerRoutes = require("./routes/playerRoutes");
const eventRoutes = require("./routes/eventRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const captchaRoutes = require("./routes/captchaRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

// --- Middleware ---

// Set up CORS based on environment
if (process.env.NODE_ENV === "development") {
  app.use(cors()); // Allow all origins in development
} else {
  app.use(
    cors({
      origin: "https://player-hub-012.netlify.app",
      credentials: true,
    })
  );
}

// Stripe webhook needs raw body, so it must be configured before express.json()
app.use("/api", paymentRoutes.webhook);

// Now, use express.json() for all other routes
app.use(express.json());

// --- API Routes ---
app.get("/", (req, res) => {
  res.status(200).json({ message: "Player Hub API is running!" });
});

// Use the router files for clean, modular routing
app.use("/api", playerRoutes); // Handles /api/players and /api/register
app.use("/api", eventRoutes); // Handles /api/events and /api/events/:id
app.use("/api", captchaRoutes); // Handles /api/verify-captcha
app.use("/api", paymentRoutes.router); // Handles /api/create-checkout-session

// --- 404 Handler (for routes not found) ---
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

const startServer = async () => {
  try {
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
