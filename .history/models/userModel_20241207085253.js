const pg = require('../db/db');
const bcrypt = require('bcrypt');

//register a new user
const User = {
    async registerUser(userDetails){
        try{
            const {name, number, email, password} = userDetails;

            const hashedPassword = bcrypt.

            const result = await pg.query(
                //TODO: ADD PASSWORD HASHED Function using bcrypt, and start working on the services...
                'INSERT INTO Users (name, number, email'
            )
        }
    }
}