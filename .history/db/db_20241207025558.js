const pg = require('pg');
require('dotenv').config;
//connecting to the database: 
const client = new pg.Client({
    host: 'localhost',
    user:'postgres',
    database:'postgres',
    password: process.env.postgresql,
    port: 5432
})