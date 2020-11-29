const express = require('express');
const{ Router } = require('express');
const UserController = require('../controllers/user/UserController');
const ActivityController = require('../controllers/user/ActivityController');
const AwardController = require('../controllers/user/AwardController');
const { requireAuth, checkUser } = require('../middleware/UserMiddleware');
const router = Router();

router.get('/sign-up',UserController.signup_get);
router.post('/sign-up',UserController.signup_post);
router.get('/sign-in',UserController.signin_get);
router.post('/sign-in',UserController.signin_post);

router.use(checkUser);
router.get('/sign-out',requireAuth,UserController.signout_get);
router.get('/',(req,res)=>{
    res.redirect('/home');
});

router.get('/home',requireAuth,(req, res)=>{
    var data = [];
    data['path1'] = 'home';
    res.render('user/index',data);
});

const activityRoute = Router();
router.use('/activities',requireAuth,activityRoute);
activityRoute.get('/',ActivityController.list);
activityRoute.get('/list-col',ActivityController.list_col);
activityRoute.get('/list-row',ActivityController.list_row);

const awardRoute = Router();
router.use('/awards',requireAuth,awardRoute);
awardRoute.get('*',(req,res,next)=>{res.locals.path1="awards";next();})
awardRoute.get('/',AwardController.list);
awardRoute.get('/list-row',AwardController.list_row);
awardRoute.get('/list-col',AwardController.list_col);

router.get('/404',(req,res)=>{
    res.status(404).render('user/404');
});

router.use((req,res)=>{
    res.redirect('/404');
});

module.exports = router;