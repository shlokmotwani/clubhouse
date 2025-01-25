const { Pool } = require("pg");

const pool = new Pool({
  connectionString:process.env.DB_CONNECTION_URL,
});

module.exports = { pool };
