const pg = require('../db/db');

//register a new user
const User = {
    async registerUser(userDetails){
        try{
            const {name, number, email} = userDetails;

            const result = await pg.query(
                //TODO: ADD PASSWORD HASHED FUC
                'INSERT INTO Users (name, number, email'
            )
        }
    }
}