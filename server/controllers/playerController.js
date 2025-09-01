const db = require("../config/database");

// Controller function to get all players
exports.getAllPlayers = (req, res) => {
  const sql = "SELECT * FROM players ORDER BY name";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ players: rows });
  });
};

// Controller function to register a new player
exports.registerPlayer = (req, res) => {
  const { name, age, email, team, position } = req.body;

  if (!name || !age || !email) {
    return res
      .status(400)
      .json({ error: "Name, Age, and Email are required fields." });
  }

  const sql = `INSERT INTO players (name, age, email, team, position) VALUES (?, ?, ?, ?, ?)`;
  const params = [name, age, email, team, position];

  db.run(sql, params, function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res
          .status(409)
          .json({ error: "This email address is already registered." });
      }
      return res
        .status(500)
        .json({ error: "An error occurred while registering the player." });
    }
    res.status(201).json({
      message: "Player registered successfully!",
      playerId: this.lastID,
    });
  });
};
