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


router.get('/activities',requireAdminAuth,ActivityController.list);
router.get('/activities/list-col-json',requireAdminAuth,ActivityController.list_col_json);
router.get('/activities/list-row-json',requireAdminAuth,ActivityController.list_row_json);
router.post('/activities/new',requireAdminAuth,ActivityController.new);
router.get('/activities/detail-list-col-json',requireAdminAuth,ActivityController.detail_col);
router.get('/activities/:id/detail-list-row-json',requireAdminAuth,ActivityController.detail_row);
router.get('/activities/:id/members',requireAdminAuth,ActivityController.members);
router.get('/activities/:id',requireAdminAuth,ActivityController.detail);
router.post('/activities/:id/delete',requireAdminAuth,ActivityController.delete);
router.get('/activities/:id/info',requireAdminAuth,ActivityController.info);
router.post('/activities/:id/edit',requireAdminAuth,ActivityController.edit);

router.get('/404',(req,res)=>{
    res.status(404).render('admin/404');
});

router.use((req,res)=>{
    res.redirect('/admin/404');
});

module.exports = router;