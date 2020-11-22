const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt  = require('bcrypt');

const Schema = mongoose.Schema;

const Badge = require('./Badge.js');

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [isEmail,'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [8, 'Minimum passoword length is 8 characters'],
    },
    rank: {
        type: String,
        required: [true, 'Please provide your rank'],
    },
    age: {
        type: Number,
        // required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    squad:  {
        type: String
    },
    badges: [Badge.schema],
});

// hash password before save
UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

// static method to login
UserSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('user',UserSchema);

module.exports = User;