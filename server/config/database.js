const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "./database.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            email TEXT NOT NULL UNIQUE,
            team TEXT,
            position TEXT,
            registeredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          console.log("Players table created or already exists.");
        }
      }
    );
  }
});

module.exports = db;
