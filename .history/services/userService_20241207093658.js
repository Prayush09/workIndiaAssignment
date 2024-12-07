const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

async register(userDetails){
    return User.registerUser(userDetails);
}