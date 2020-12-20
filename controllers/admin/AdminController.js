const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Admin = require('../../models/admin');
// error handler
const handleAdminSignUpInErrors = (err) => {
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
    if(err.message.includes('admin validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

const maxAge = 3*24*60*60; //3days
const createToken = (id) => {
    return jwt.sign({id},'txhengCreateBBIntranetAdmin',{
       expiresIn: maxAge
    });
}

module.exports.index = (req, res)=>{
    res.render('admin/index');
}

module.exports.signup_get = (req,res)=>{
    res.render('admin/sign_up');
}

module.exports.signup_post = async(req,res)=>{
    const {name,email,gender,age,password} = req.body;
    try{
        const admin = await Admin.create({
            name: name,
            email: email,
            age: age,
            gender: gender,
            password: password
        });
        res.status(201).json({admin:admin._id});
    } catch (err) {
        const errors = handleAdminSignUpInErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.signin_get = (req,res)=>{
    res.render('admin/sign_in');
}

module.exports.signin_post = async (req,res)=>{
    const {email, password} = req.body;
    
    try{
        const admin = await Admin.login(email,password);
        const token = await createToken(admin._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(200).json({admin:admin._id});
    }
    catch (err){
        const errors = handleAdminSignUpInErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.signout_get = (req, res)=>{
    res.cookie('jwt','',{ maxAge:1 });
    res.redirect('/sign-in');
}