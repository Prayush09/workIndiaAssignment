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
    try{
        await pg.connect();
        console.log("Connected to DB");
    }catch(error){
        console.error("Could not connect to database, this is the error: ", error);
    }
}

module.exports = {connectToDb};