const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

const validToken = (token) => {
    var flag = false;
    jwt.verify(token,'txhengCreateBBIntranetAdmin',(err,decodedToken)=>{
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

const requireAdminAuth = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        // token exist, verify now
        if(validToken(token)){
            next();
        } else {
            res.redirect('/admin/sign-in');
        }
    } else {
        // no token
        res.redirect('/admin/sign-in');
    }
}

const checkAdmin = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        // token exist, verify now
        jwt.verify(token,'txhengCreateBBIntranetAdmin', async (err,decodedToken)=>{
            if(err){ // invalid token
                console.log(err.message);
                res.locals.admin = null;
                next();        
            } else {
                let admin = await Admin.findById(decodedToken.id);
                res.locals.admin = admin;
                next();
            }
        });
    } else {
        res.locals.admin = null;
        next();
    }
}

module.exports = {requireAdminAuth, checkAdmin};