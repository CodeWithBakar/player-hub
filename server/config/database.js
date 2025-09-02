// const { Pool } = require("pg");
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   // Add SSL configuration for production connections
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// const initializeDatabase = async () => {
//   try {
//     const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS players (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         age INT NOT NULL,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         team VARCHAR(255),
//         "position" VARCHAR(255)
//       );
//     `;
//     await pool.query(createTableQuery);
//     console.log("PostgreSQL database connected and table is ready.");
//   } catch (err) {
//     console.error("Error initializing PostgreSQL database:", err);
//     process.exit(1);
//   }
// };

// module.exports = {
//   pool,
//   initializeDatabase,
// };

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
    throw err; // Throw error to be caught by the server startup logic
  } finally {
    client.release();
  }
};

module.exports = { pool, initializeDatabase };
