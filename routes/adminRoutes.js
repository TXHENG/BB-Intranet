const{ Router } = require('express');
const AdminController = require('../controllers/admin/AdminController');
const UserController = require('../controllers/admin/UserController');
const ActivityController = require('../controllers/admin/ActivityController');
const { requireAdminAuth, checkAdmin } = require('../middleware/AdminMiddleware');
const router = Router();

router.get('/sign-in',AdminController.signin_get);
router.post('/sign-in',AdminController.signin_post);

router.use(checkAdmin);

router.get('/sign-up',requireAdminAuth,AdminController.signup_get);
router.post('/sign-up',requireAdminAuth,AdminController.signup_post);
router.get('/sign-out',requireAdminAuth,AdminController.signout_get);
router.get('/',requireAdminAuth,AdminController.index);
router.get('/home',requireAdminAuth,AdminController.index);

router.get('/member-list',requireAdminAuth,UserController.list);

router.get('/activity',requireAdminAuth,ActivityController.list);
router.post('/activity/new',requireAdminAuth,ActivityController.new);
router.get('/activity/:id',requireAdminAuth,ActivityController.detail);

router.get('/404',(req,res)=>{
    res.status(404).render('admin/404');
});

router.use((req,res)=>{
    res.redirect('/admin/404');
});

module.exports = router;