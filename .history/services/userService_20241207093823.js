const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const userService = {
    async register(userDetails){
        return User.registerUser(userDetails);
    },

    async login(email, password){
        const user = User.findByEmail(email);

        if(!user){
            throw new Error('User not found');
        }

        const isMatch = 
    }
}