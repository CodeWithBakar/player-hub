const { pool } = require("../config/database");

/**
 * Get all registered players.
 */
const getAllPlayers = async (req, res) => {
  // Debugging line to confirm this function is being called
  console.log("--- GET /api/players route hit ---");

  try {
    const sql = "SELECT * FROM players ORDER BY name";
    const result = await pool.query(sql);
    res.json({ players: result.rows });
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({ error: "Failed to retrieve players." });
  }
};

/**
 * Register a new player.
 */
const registerPlayer = async (req, res) => {
  // Log the incoming request body to see exactly what we're receiving.
  console.log("Received registration request with body:", req.body);

  const { name, age, email, team, position } = req.body;

  if (!name || !age || !email) {
    console.log("Validation failed: Missing required fields.");
    return res
      .status(400)
      .json({ error: "Name, Age, and Email are required." });
  }

  try {
    const sql = `INSERT INTO players (name, age, email, team, "position") VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const params = [name, age, email, team, position];

    console.log("Executing SQL insert statement...");
    const result = await pool.query(sql, params);
    console.log("Player inserted successfully, ID:", result.rows[0].id);

    res.status(201).json({
      message: "Player registered successfully!",
      playerId: result.rows[0].id,
    });
  } catch (err) {
    console.error("CRITICAL ERROR during registration:", err);

    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "This email address is already registered." });
    }

    res
      .status(500)
      .json({ error: "A server error occurred during registration." });
  }
};

module.exports = {
  getAllPlayers,
  registerPlayer,
};
