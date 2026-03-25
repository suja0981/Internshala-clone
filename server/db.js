const mongoose = require('mongoose');
require('dotenv').config();
database = process.env.DATABASE_URL;

const url=database
module.exports.connect=()=> {
    mongoose.connect(url,console.log("Connected to database"))
}