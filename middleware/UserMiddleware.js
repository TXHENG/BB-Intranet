const User = require('../models/User');
const jwt = require('jsonwebtoken');

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        // token exist, verify now
        jwt.verify(token,'txhengCreateBBIntranet',(err,decodedToken)=>{
            if(err){ // invalid token
                console.log(err.message);
                res.redirect('/sign-in');        
            } else {
                console.log(decodedToken);
                next();
            }
        });
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