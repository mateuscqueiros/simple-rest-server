// db.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:"); // ou especifique um caminho para persistência

// Criação da tabela de usuários
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
});

module.exports = db;
