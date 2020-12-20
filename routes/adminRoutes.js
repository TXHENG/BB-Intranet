const{ Router } = require('express');
const AdminController = require('../controllers/admin/AdminController');
const ActivityController = require('../controllers/admin/ActivityController');
const AwardController = require('../controllers/admin/AwardController');
const BadgeController = require('../controllers/admin/BadgeController');
const UserController = require('../controllers/admin/UserController');
const { requireAdminAuth, checkAdmin } = require('../middleware/AdminMiddleware');
// const Badge = require('../models/Badge');
const router = Router();

router.get('/sign-in',AdminController.signin_get);
router.post('/sign-in',AdminController.signin_post);

router.use(checkAdmin);

router.get('*',(req,res,next)=>{res.locals.path1 = "home";res.locals.title = "Home"; next();});
router.get('/',requireAdminAuth,AdminController.index);
router.get('/home',requireAdminAuth,AdminController.index);
router.get('/sign-up',requireAdminAuth,AdminController.signup_get);
router.post('/sign-up',requireAdminAuth,AdminController.signup_post);
router.get('/sign-out',requireAdminAuth,AdminController.signout_get);

const memberRoute = Router();
router.use('/members',requireAdminAuth,memberRoute);
memberRoute.get('*',(req,res,next)=>{res.locals.path1 = "members";res.locals.title = "Members Management"; next();});
memberRoute.get('/',UserController.list);
memberRoute.get('/row-json',UserController.row_json);
memberRoute.get('/col-json',UserController.col_json);
memberRoute.get('/squad-list',UserController.squad_list);
memberRoute.get('/:id',UserController.details);

const activityRoute = Router();
router.use('/activities',requireAdminAuth,activityRoute);
activityRoute.get('*',(req,res,next)=>{res.locals.path1 = "activities";res.locals.title = "Activities Management"; next();});
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

const awardRoute = Router();
router.use('/awards',requireAdminAuth,awardRoute);
awardRoute.get('*',(req,res,next)=>{res.locals.path1 = "awards";res.locals.title = "Awards Management"; next();});
awardRoute.get('/',AwardController.list);
awardRoute.get('/col-json',AwardController.col_json);
awardRoute.get('/row-json',AwardController.row_json);
awardRoute.get('/new',AwardController.new);
awardRoute.post('/new',AwardController.new);
awardRoute.get('/:id',AwardController.detail);
awardRoute.get('/detail/detail-col-json',AwardController.detail_col_json);
awardRoute.get('/:id/detail-row-json',AwardController.detail_row_json);
awardRoute.get('/:id/edit',AwardController.edit);
awardRoute.post('/:id/edit',AwardController.edit);
awardRoute.post('/:id/delete',AwardController.delete);
awardRoute.get('/:id/members',AwardController.members);
awardRoute.get('/:id/add-members',AwardController.add_members);
awardRoute.post('/:id/add-members',AwardController.add_members);
awardRoute.post('/:id/:member_id/remove-member',AwardController.remove_member);

const badgeRoute = Router();
router.use('/badges',requireAdminAuth,badgeRoute);
badgeRoute.get('/groupNames',BadgeController.group_names);
badgeRoute.get('/badges',BadgeController.badges);

router.get('/404',(req,res)=>{
    res.status(404).render('admin/404');
});

router.use((req,res)=>{
	res.redirect('/404');
});

module.exports = router;

// router.get('/badge-init',requireAdminAuth,async (req,res)=>{
//     var badges = [
//         {name: 'Target',                                groupName: 'Compulsory' },
//         {name: 'Cristian Education',                    groupName: 'Compulsory' },
//         {name: 'Drill',                                 groupName: 'Compulsory' },
//         {name: 'Recruitment',                           groupName: 'Compulsory' },

//         {name: 'Arts',                      group: 'A', groupName: 'Interest' },
//         {name: 'Crafts',                    group: 'A', groupName: 'Interest' },
//         {name: 'Hobbies',                   group: 'A', groupName: 'Interest' },
//         {name: 'Bandsman\'s',               group: 'A', groupName: 'Interest' },
//         {name: 'Bugler\'s',                 group: 'A', groupName: 'Interest' },
//         {name: 'Drummer\'s',                group: 'A', groupName: 'Interest' },
//         {name: 'Piper\'s',                  group: 'A', groupName: 'Interest' },
//         {name: 'Communication',             group: 'A', groupName: 'Interest' },
//         {name: 'Computer Knowledge',        group: 'A', groupName: 'Interest' },
//         {name: 'International Relations',   group: 'A', groupName: 'Interest' },
//         {name: 'Naturalist\'s',             group: 'A', groupName: 'Interest' },

//         {name: 'Camper\'s',                 group: 'B', groupName: 'Adventure' },
//         {name: 'Expedition',                group: 'B', groupName: 'Adventure' },
//         {name: 'Water Adventure',           group: 'B', groupName: 'Adventure' },

//         {name: 'Citizenship',               group: 'C', groupName: 'Community' },
//         {name: 'Community Service',         group: 'C', groupName: 'Community' },
//         {name: 'Environmental Conservation',group: 'C', groupName: 'Community' },
//         {name: 'Fireman',                   group: 'C', groupName: 'Community' },
//         {name: 'First Aid',                 group: 'C', groupName: 'Community' },
//         {name: 'Life Saving',               group: 'C', groupName: 'Community' },
//         {name: 'Safety',                    group: 'C', groupName: 'Community' },

//         {name: 'Athletics',                 group: 'D', groupName: 'Physical' },
//         {name: 'Gymnastics',                group: 'D', groupName: 'Physical' },
//         {name: 'Martial Art',               group: 'D', groupName: 'Physical' },
//         {name: 'Physical Training',         group: 'D', groupName: 'Physical' },
//         {name: 'Sportsman\'s',              group: 'D', groupName: 'Physical' },
//         {name: 'Swimming',                  group: 'D', groupName: 'Physical' },
		
//         {name: 'Gold',                                  groupName: 'Scholastic' },
//         {name: 'Silver',                                groupName: 'Scholastic' },
//         {name: 'Bronze',								groupName: 'Scholastic' },

//         {name: 'One Year',								groupName: 'Service' },
//         {name: 'Three Year',							groupName: 'Service' },
//         {name: 'Long Year',								groupName: 'Service' },

//         {name: 'President\'s',							groupName: 'Special' },
//         {name: 'Founder\'s',							groupName: 'Special' },
//         {name: 'NCO Proficiency',						groupName: 'Special' },
//         {name: 'Cross Of Heroism',						groupName: 'Special' },
//         {name: 'Diploma for Gallant Conduct',			groupName: 'Special' },
//         {name: 'Gold Award',							groupName: 'Special' },
//     ];
//     // await Badge.insertMany(badges);
//     res.send('complete');
// });