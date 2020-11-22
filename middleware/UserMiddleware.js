const User = require('../models/User');
const jwt = require('jsonwebtoken');

const validToken = (token) => {
    var flag = false;
    jwt.verify(token,'txhengCreateBBIntranet',(err,decodedToken)=>{
        if(err){ // invalid token
            console.log(err.message);
            flag = false;       
        } else {
            console.log(decodedToken);
            flag = true;
        }
    });
    return flag;
}

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        // token exist, verify now
        if(validToken(token)){
            next();
        } else {
            res.redirect('/sign-in');
        }
    } else {
        // no token
        res.redirect('/sign-in');
    }
}

const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        // token exist, verify now
        jwt.verify(token,'txhengCreateBBIntranet', async (err,decodedToken)=>{
            if(err){ // invalid token
                console.log(err.message);
                res.locals.user = null;
                next();        
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth, checkUser};