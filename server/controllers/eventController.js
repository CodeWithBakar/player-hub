const { pool } = require("../config/database");

const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to retrieve events." });
  }
};

const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const eventResult = await pool.query("SELECT * FROM events WHERE id = $1", [
      id,
    ]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    const ticketsResult = await pool.query(
      "SELECT * FROM ticket_types WHERE event_id = $1 ORDER BY price",
      [id]
    );

    const event = eventResult.rows[0];
    event.tickets = ticketsResult.rows;

    res.json(event);
  } catch (err) {
    console.error(`Error fetching event ${id}:`, err);
    res.status(500).json({ error: "Failed to retrieve event details." });
  }
};

module.exports = { getAllEvents, getEventById };
