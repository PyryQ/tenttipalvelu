const { Pool } = require('pg')

var connectInfo = {};

var pool = null;
if (process.env.HEROKU) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
}
else {
  connectInfo = {
    user: 'postgres',
    host: 'localhost',
    database: 'Tenttikanta',
    password: 'MnoP1994',
    port: 5432,
  }
  pool = new Pool(connectInfo)
}

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}
