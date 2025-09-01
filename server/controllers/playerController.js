const { pool } = require("../config/database");

/**
 * Get all registered players.
 */
const getAllPlayers = async (req, res) => {
  try {
    const sql = "SELECT * FROM players ORDER BY name";
    const result = await pool.query(sql);
    res.json({ players: result.rows });
  } catch (err) {
    console.error("Error fetching players:", err.message);
    res.status(500).json({ error: "Failed to retrieve players." });
  }
};

/**
 * Register a new player.
 */
const registerPlayer = async (req, res) => {
  const { name, age, email, team, position } = req.body;

  if (!name || !age || !email) {
    return res
      .status(400)
      .json({ error: "Name, Age, and Email are required." });
  }

  try {
    // Note: "position" is a reserved keyword in SQL, so we enclose it in double quotes.
    const sql = `INSERT INTO players (name, age, email, team, "position") VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const params = [name, age, email, team, position];

    const result = await pool.query(sql, params);

    res.status(201).json({
      message: "Player registered successfully!",
      playerId: result.rows[0].id,
    });
  } catch (err) {
    // Check for unique constraint violation (duplicate email)
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "This email address is already registered." });
    }
    console.error("Error registering player:", err.message);
    res
      .status(500)
      .json({ error: "A server error occurred during registration." });
  }
};

module.exports = {
  getAllPlayers,
  registerPlayer,
};
