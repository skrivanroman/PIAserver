const mysql = require('mysql');
const env = require('dotenv');
const {promisify} = require('util');

env.config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'pia_user',
  password: process.env.DB_PASSWORD,
  database: 'pia',
  insecureAuth : true
});

connection.connect( (err) => {
  if(err)
    console.log(err);
});

connection.query = promisify(connection.query);

module.exports = connection;