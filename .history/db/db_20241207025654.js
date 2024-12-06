const {Client} = require('pg');
require('dotenv').config;

//creating a client that will connect to the database: 
const pg = new Client({
    host: 'localhost',
    user:'postgres',
    database:'postgres',
    password: process.env.postgresql,
    port: 5432
});


async function connectToDb(){
    
}