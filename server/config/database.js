const { Pool } = require("pg");
require("dotenv").config();

// Define the SSL configuration based on the environment.
// For production (like Railway), we enable SSL.
// For anything else (like your local machine), we disable it.
const sslConfig =
  process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Players Table (existing)
    await client.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        email TEXT NOT NULL UNIQUE,
        team TEXT,
        position TEXT
      );
    `);

    // Events Table (new)
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        date TIMESTAMP NOT NULL,
        location TEXT,
        image_url TEXT
      );
    `);

    // Ticket Types Table (new)
    await client.query(`
      CREATE TABLE IF NOT EXISTS ticket_types (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        price INTEGER NOT NULL, -- Price in cents
        description TEXT
      );
    `);

    // Event Registrations Table (new)
    await client.query(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        ticket_type_id INTEGER REFERENCES ticket_types(id),
        user_email TEXT NOT NULL,
        stripe_session_id TEXT NOT NULL UNIQUE,
        quantity INTEGER NOT NULL DEFAULT 1,
        status VARCHAR(50) NOT NULL DEFAULT 'pending' -- e.g., pending, paid, cancelled
      );
    `);

    console.log("PostgreSQL database connected and tables are ready.");
  } catch (err) {
    console.error("Database initialization error:", err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { pool, initializeDatabase };
