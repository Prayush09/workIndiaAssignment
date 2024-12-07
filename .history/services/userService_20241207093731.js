const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const userService = {
    async register(userDetails){
        return User.registerUser(userDetails);
    },

    async login(email, password)
}