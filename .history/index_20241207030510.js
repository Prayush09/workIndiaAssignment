const express = require('express');
const {connectToDb} = require('./db/db');
const app = express();

connectToDb(); //connecting to db when the app runs



