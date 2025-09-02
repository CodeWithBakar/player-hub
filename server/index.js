// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const { initializeDatabase } = require("./config/database");
// const {
//   getAllPlayers,
//   registerPlayer,
// } = require("./controllers/playerController");

// const app = express();
// const PORT = process.env.PORT || 8080;
// const HOST = "0.0.0.0";

// // Middleware
// // app.use(
// //   cors({
// //     origin: [
// //       "https://player-hub-012.netlify.app",
// //       "http://localhost:3000",
// //       "http://localhost:5173",
// //       "http://localhost:8080",
// //       "http://127.0.0.1:8080",
// //     ],
// //     credentials: true,
// //     methods: ["GET", "POST", "PUT", "DELETE"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //   })
// // );
// if (process.env.NODE_ENV === "development") {
//   app.use(cors()); // allow all origins in dev
// } else {
//   app.use(
//     cors({
//       origin: [
//         "https://player-hub-012.netlify.app",
//         "http://localhost:3000",
//         "http://localhost:5173",
//       ],
//       credentials: true,
//     })
//   );
// }

// app.use(express.json());

// // Debug middleware
// app.use((req, res, next) => {
//   console.log(`[DEBUG] ${req.method} ${req.path}`);
//   next();
// });

// app.get("/", (req, res) => {
//   console.log("Root route hit");
//   res.status(200).json({
//     message: "Player Hub API is running!",
//     timestamp: new Date().toISOString(),
//   });
// });

// // Direct routes (bypass router for now)
// app.get("/api/players", (req, res) => {
//   console.log("Direct /api/players route hit");
//   getAllPlayers(req, res);
// });

// app.post("/api/register", (req, res) => {
//   console.log("Direct /api/register route hit");
//   registerPlayer(req, res);
// });

// // 404 handler
// app.use((req, res) => {
//   console.log(`[404] Route not found: ${req.method} ${req.path}`);
//   res.status(404).json({
//     error: "Route not found",
//     method: req.method,
//     path: req.path,
//     availableRoutes: ["GET /", "GET /api/players", "POST /api/register"],
//   });
// });

// const startServer = async () => {
//   try {
//     await initializeDatabase();
//     app.listen(PORT, HOST, () => {
//       console.log(`Server is running and listening on http://${HOST}:${PORT}`);
//       console.log("Direct routes registered:");
//       console.log("  GET  /");
//       console.log("  GET  /api/players");
//       console.log("  POST /api/register");
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// };

// startServer();

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
      origin: "https://player-hub-012.netlify.app", // Your production frontend URL
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
