// utils/db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "centerbeam.proxy.rlwy.net",
  user: "root",               // ✅ Make sure this is your actual username
  password: "mqHykiVnzPjLBuqRKMYAZZXiDPRlmStp",  // ✅ Replace with your real MySQL password
  database: "acevihaari",     // ✅ Replace with your actual database name
  port: 56854,
});

module.exports = pool;