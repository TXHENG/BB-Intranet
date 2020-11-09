const User = require('../models/User');

// error handler
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email:'', password:'' };

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

module.exports.signup_get = (req,res)=>{
    var data = [];
    data['ranks'] = ['Recruit','Private','Lance Corporal','Corporal','Sergeant','Staff Sergeant'];
    res.render('user/sign_up', data);
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
        res.status(201).json({script:{title:'Success',icon:'success',text:'User created success fully, you will be redirect to the login page soon.',showCancelButton: false,showConfirmButton: false}, reload:false});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(handleErrors(err));
    }
}
module.exports.signin_get = (req,res)=>{
    res.render('user/sign_in');
}

module.exports.signin_post = async (req,res)=>{
    const {email, password} = req.body;
    console.log(email, password);
    res.render('user/sign_in');
}