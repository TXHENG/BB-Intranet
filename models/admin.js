const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt  = require('bcrypt');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
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
    age: {
        type: Number,
        // required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    admin_type: {
        type: String,
    }
});

// hash password before save
AdminSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

// static method to login
AdminSchema.statics.login = async function(email, password){
    const admin = await this.findOne({email});
    if(admin){
        const auth = await bcrypt.compare(password, admin.password);
        if(auth){
            return admin;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const Admin = mongoose.model('admin',AdminSchema);

module.exports = Admin;