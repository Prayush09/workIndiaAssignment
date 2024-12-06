const pg = require('pg');

//connecting to the database: 
const client = new pg.Client({
    host: 'postgres'
})