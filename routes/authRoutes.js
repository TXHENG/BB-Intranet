const{Router} = require('express');
const UserController = require('../controllers/UserController');
const router = Router();

router.get('/sign-up',UserController.signup_get);
router.post('/sign-up',UserController.signup_post);
router.get('/sign-in',UserController.signin_get);
router.post('/sign-in',UserController.signin_post);
router.get('/sign-out',UserController.signout_get);
module.exports = router;