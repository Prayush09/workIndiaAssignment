const pg = require('../db/db');
const bcrypt = require('bcrypt');

//register a new user
const User = {
    async registerUser(userDetails){
        try{
            const {name, number, email, password} = userDetails;

            const hashedPassword = bcrypt.hash(password, 10);//10 salt rounds for a strong hash

            const result = await pg.query(
                //TODO: ADD PASSWORD HASHED Function using bcrypt, and start working on the services...
                'INSERT INTO users (name, number, password_hash, email) VALUES ($1, $2, $3, $4'
            )
        }
    }
}