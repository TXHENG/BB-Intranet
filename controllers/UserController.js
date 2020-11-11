const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// error handler
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email:'', password:'' };

    // Incorrect email
    if(err.message === "Incorrect email"){
        errors.email = 'Email is not registered';
    }

    // Incorrect password
    if(err.message === "Incorrect password"){
        errors.password = 'This password is incorrect';
    }

    if(err.code === 11000){
        errors.email = 'Email has been registered';
    }

    // validation err
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

const maxAge = 3*24*60*60; //3days
const createToken = (id) => {
    return jwt.sign({id},'txhengCreateBBIntranet',{
       expiresIn: maxAge
    });
}

module.exports.signup_get = (req,res)=>{
    res.render('user/sign_up');
}

module.exports.signup_post = async(req,res)=>{
    const {name,email,rank,gender,password} = req.body;
    try{
        const user = await User.create({
            name: name,
            email: email,
            rank: rank,
            gender: gender,
            password: password
        });
        res.status(201).json({user:user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.signin_get = (req,res)=>{
    res.render('user/sign_in');
}

module.exports.signin_post = async (req,res)=>{
    const {email, password} = req.body;
    
    try{
        const user = await User.login(email,password);
        const token = await createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(200).json({user:user._id});
    }
    catch (err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.signout_get = (req, res)=>{
    res.cookie('jwt','',{ maxAge:1 });
    res.redirect('/sign-in');
}