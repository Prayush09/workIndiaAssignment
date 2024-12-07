const pg = require('../db/db');
const bcrypt = require('bcrypt');
const zod = require('zod');
//register a new user

const userValidate = zod.object({
    name: zod.string().min(1, 'Name is required'),
    email: zod.string().regex(
        /$
    )
})

const User = {
    async registerUser(userDetails){
        try{
            const {name, number, email, password} = userDetails;

            const hashedPassword = bcrypt.hash(password, 10);//10 salt rounds for a strong hash

            const result = await pg.query(
                //TODO: ADD PASSWORD HASHED Function using bcrypt, and start working on the services...
                'INSERT INTO users (name, number, password_hash, email) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, number, hashedPassword, email]
            );

            return result.rows[0];//return the newly added user
        }catch(error){
            throw new Error("Error occurred during registration of user");
        }
    }
}