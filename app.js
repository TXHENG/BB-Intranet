// modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.set('useFindAndModify', false);

// Auth Middleware
const { requireAuth, checkUser } = require('./middleware/UserMiddleware');

// Models
const User = require('./models/User');
const Badge = require('./models/Badge');

// Routes
const UserRoutes = require('./routes/authRoutes');

// Connect to MongoDB Atlas
const dbURI = "mongodb+srv://TXHeng:@TXHeng1419@bbintranet.66t77.mongodb.net/BBintranet?retryWrites=true&w=majority";
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.use(morgan('dev'));
// Resoureces
app.use('/node_modules',express.static('node_modules'));
app.use('/resources',express.static('resources'));

// routes (will automatically find in "views" folder)
app.get('*',checkUser,(req,res,next)=>{
    var data=[];
    res.locals.moment = moment;
    res.locals.ranks = ['Recruit','Private','Lance Corporal','Corporal','Sergeant','Staff Sergeant'];
    next();
});
app.use(UserRoutes);
app.get('/',requireAuth,(req,res)=>{
    res.redirect('/home');
});

app.get('/home',requireAuth,(req, res)=>{
    var data = [];
    data['path1'] = 'home';
    res.render('user/index',data);
});

app.get('/badges',requireAuth,(req, res)=>{
    var data = [];
    data['path1'] = 'badges';
    res.render('user/badges/badges-list',data);
});

app.use((req,res)=>{
    res.status(404).render('user/404');
});