const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add SSL configuration for production connections
  ssl: {
    rejectUnauthorized: false,
  },
});

const initializeDatabase = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        team VARCHAR(255),
        "position" VARCHAR(255)
      );
    `;
    await pool.query(createTableQuery);
    console.log("PostgreSQL database connected and table is ready.");
  } catch (err) {
    console.error("Error initializing PostgreSQL database:", err);
    // Exit the process if the database connection fails, as the app cannot run without it.
    process.exit(1);
  }
};

module.exports = {
  pool,
  initializeDatabase,
};
