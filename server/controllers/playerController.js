const db = require("../config/database");

/**
 * Get all registered players.
 */
const getAllPlayers = (req, res) => {
  console.log("Attempting to fetch all players...");
  const sql = "SELECT * FROM players ORDER BY name";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching players:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("Successfully fetched players.");
    res.json({ players: rows });
  });
};

/**
 * Register a new player.
 */
const registerPlayer = (req, res) => {
  console.log("Received request to register a new player.");
  const { name, age, email, team, position } = req.body;

  console.log("Request Body:", req.body);

  if (!name || !age || !email) {
    console.error("Validation failed: Name, Age, and Email are required.");
    return res
      .status(400)
      .json({ error: "Name, Age, and Email are required." });
  }

  const sql = `INSERT INTO players (name, age, email, team, position) VALUES (?, ?, ?, ?, ?)`;
  const params = [name, age, email, team, position];

  console.log("Executing SQL insert statement...");

  db.run(sql, params, function (err) {
    if (err) {
      console.error("SQL Error during insert:", err.message);
      res
        .status(500)
        .json({ error: "Email already exists or a server error occurred." });
      return;
    }
    console.log(`Successfully inserted player with ID: ${this.lastID}`);
    res.status(201).json({
      message: "Player registered successfully!",
      playerId: this.lastID,
    });
  });
};

module.exports = {
  getAllPlayers,
  registerPlayer,
};
