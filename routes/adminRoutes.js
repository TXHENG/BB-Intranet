const{ Router } = require('express');
const AdminController = require('../controllers/admin/AdminController');
const UserController = require('../controllers/admin/UserController');
const ActivityController = require('../controllers/admin/ActivityController');
const { requireAdminAuth, checkAdmin } = require('../middleware/AdminMiddleware');
const router = Router();

router.get('/sign-in',AdminController.signin_get);
router.post('/sign-in',AdminController.signin_post);

router.use(checkAdmin);

router.get('/',requireAdminAuth,AdminController.index);
router.get('/home',requireAdminAuth,AdminController.index);
router.get('/sign-up',requireAdminAuth,AdminController.signup_get);
router.post('/sign-up',requireAdminAuth,AdminController.signup_post);
router.get('/sign-out',requireAdminAuth,AdminController.signout_get);

const memberRoute = Router();
router.use('/members',requireAdminAuth,memberRoute);
memberRoute.get('/',UserController.list);
memberRoute.get('/row-json',UserController.row_json);
memberRoute.get('/col-json',UserController.col_json);
memberRoute.get('/:id',UserController.details);

const activityRoute = Router();
router.use('/activities',requireAdminAuth,activityRoute);
activityRoute.get('/',ActivityController.list);
activityRoute.get('/list-col-json',ActivityController.list_col_json);
activityRoute.get('/list-row-json',ActivityController.list_row_json);
activityRoute.get('/new',ActivityController.new);
activityRoute.post('/new',ActivityController.new);
activityRoute.get('/detail-list-col-json',ActivityController.detail_col);
activityRoute.get('/:id/detail-list-row-json',ActivityController.detail_row);
activityRoute.get('/:id/members',ActivityController.members);
activityRoute.get('/:id/add-members',ActivityController.add_members);
activityRoute.post('/:id/add-members',ActivityController.add_members);
activityRoute.post('/:id/:member_id/remove-member',ActivityController.remove_members);
activityRoute.get('/:id',ActivityController.detail);
activityRoute.post('/:id/delete',ActivityController.delete);
activityRoute.get('/:id/info',ActivityController.info);
activityRoute.get('/:id/edit',ActivityController.edit);
activityRoute.post('/:id/edit',ActivityController.edit);

router.get('/404',(req,res)=>{
    res.status(404).render('admin/404');
});

router.use((req,res)=>{
    res.redirect('/admin/404');
});

module.exports = router;