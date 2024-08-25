require("dotenv").config();
const { Pool } = require('pg');
const app = require("./app");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on: localhost:${PORT}`);
});