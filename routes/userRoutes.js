const{ Router } = require('express');
const UserController = require('../controllers/user/UserController');
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

router.get('/badges',requireAuth,(req, res)=>{
    var data = [];
    data['path1'] = 'badges';
    res.render('user/badges/badges-list',data);
});

router.get('/404',(req,res)=>{
    res.status(404).render('user/404');
});

router.use((req,res)=>{
    res.redirect('/404');
});

module.exports = router;