const pg = require('../db/db');

//register a new user
const User = {
    async registerUser(userDetails){
        try{
            const {name, number, email} = userDetails;

            const result = await pg.query(
                'INSERT INTO Users (name, number, email'
            )
        }
    }
}