require('dotenv/config')
const { Pool } = require('pg')

const databaseUrl = process.env.DATABASE_URL

if(!databaseUrl) {
  throw new Error('Database url not defined')
}

const pool = new Pool ({
  connectionString: databaseUrl
})

async function connectDatabase () {
  await pool.query('SELECT 1')
}

module.exports = {
  pool,
  connectDatabase
}