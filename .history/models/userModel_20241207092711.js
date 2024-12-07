const pg = require('../db/db');
const bcrypt = require('bcrypt');
const zod = require('zod');
const jwt = require('jsonwebtoken');
//register a new user

const userValidate = zod.object({
    name: zod.string().min(1, 'Name is required'),
    number: zod.string().min(10).max(10),
    email: zod.string().regex(
        /^[a-zA-Z0-9._+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/,
        "Email must be from Gmail, Yahoo, or Outlook!"
    ),
    password: zod.string().min(6, "Password must be of 6 length in size")
    .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]+$')) 
})

const User = {
    async registerUser(userDetails){
        try{
            const {name, number, email, password} = userValidate.parse(userDetails);

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
    },

    async loginUser(email, password){

        const result = await pg.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const comparePassword = bcrypt.compare(password, result.rows[0].password_hash);

        if(comparePassword){
            //create jwt token

        }
    }
}