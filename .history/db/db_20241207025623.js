const {Client} = require('pg');
require('dotenv').config;

//creating a client that will connect to the database: 
const client = new pg.Client({
    host: 'localhost',
    user:'postgres',
    database:'postgres',
    password: process.env.postgresql,
    port: 5432
});
