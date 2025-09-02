const express = require("express");
const router = express.Router();
const {
  getAllPlayers,
  registerPlayer,
} = require("../controllers/playerController");

// This route handles GET requests to /api/players
router.get("/players", getAllPlayers);

// This route handles POST requests to /api/register
router.post("/register", registerPlayer);

module.exports = router;
