const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "MarketAdmin",
  password: "Y@8e=nZNJgnQhC@a",
  database: "MarketServices",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
