const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

// Fetches all registered players
router.get("/", playerController.getAllPlayers);

// Registers a new player
router.post("/register", playerController.registerPlayer);

module.exports = router;
