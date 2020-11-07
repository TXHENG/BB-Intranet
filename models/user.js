const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Badge = require('./badge.js');

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    rank: String,
    age: Number,
    badges: [Badge.schema],
});

const User = mongoose.model('user',UserSchema);

module.exports = User;