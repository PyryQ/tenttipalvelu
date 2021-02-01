const { Pool } = require('pg')

var connectInfo = {};

if(process.env.HEROKU){
  connectInfo = {
    user: 'xsztrqfjstsozv',
    host: 'ec2-3-248-4-172.eu-west-1.compute.amazonaws.com',
    database: 'd1i1949tdgr30l',
    password: '2b23c0f774378c5ea8b5fe2257c56d6eb651d2dfc45a42f23dff7e5a454eb66b',
    port: 5432
  }
}
else {
  connectInfo = {
    user: 'postgres',
    host: 'localhost',
    database: 'Tenttikanta',
    password: 'MnoP1994',
    port: 5432
  }
}
const pool = new Pool(connectInfo)



module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}