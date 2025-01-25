const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://user:npg_DPcN5TZpbqK9@ep-noisy-mountain-a8da3bcj-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
});

module.exports = { pool };
