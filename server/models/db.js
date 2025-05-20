// utils/db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",               // ✅ Make sure this is your actual username
  password: "MySQL@{1521}",  // ✅ Replace with your real MySQL password
  database: "acevihaari",     // ✅ Replace with your actual database name
});

module.exports = pool;