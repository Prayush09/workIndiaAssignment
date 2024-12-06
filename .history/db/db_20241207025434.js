const pg = require('pg');
require('dotenv')
//connecting to the database: 
const client = new pg.Client({
    host: 'localhost',
    user:'postgres',
    database:'postgres'
})