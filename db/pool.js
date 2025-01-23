const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "a",
  password: "a",
  database: "clubhouse",
  port: 5432,
});

module.exports = { pool }