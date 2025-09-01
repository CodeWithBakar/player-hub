const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "../database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    const createTableSql = `
            CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                email TEXT NOT NULL UNIQUE,
                team TEXT,
                position TEXT
            )
        `;
    db.run(createTableSql, (err) => {
      if (err) {
        console.error("Error creating players table:", err.message);
      } else {
        console.log("Players table created or already exists.");
      }
    });
  }
});

module.exports = db;
