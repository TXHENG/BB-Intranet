const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const moment = require('moment');
const cookieParser = require('cookie-parser');

// Models
const User = require('./models/User');
const Badge = require('./models/Badge');

mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.set('useFindAndModify', false);

// express app
const app = express();

//connect to db
const dbURI = "mongodb+srv://TXHeng:@TXHeng1419@bbintranet.66t77.mongodb.net/BBintranet?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.use('/node_modules',express.static('node_modules'));
app.use('/resources',express.static('resources'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

// routes (will automatically find in "views" folder)

app.use(morgan('dev'));

// auth route
const userroute = require('./routes/authRoutes');
app.use(userroute);

app.get('/',function(req,res){
    res.redirect('/home');
});

app.get('/home',function(req, res){
    var data = [];
    data['path1'] = 'home';
    res.render('user/index',data);
});

app.get('/badges',function(req, res){
    var data = [];
    data['path1'] = 'badges';
    data['moment'] = moment;
    User.findOne().then((result)=>{
        data['user'] = result;
        res.render('user/badges/badges-list',data);
    })
    .catch((err)=>{
        console.log(err);
    });
});

app.get('/profile/:name', function(req, res){
    res.render('user/index',{person: req.params.name});
});

app.use((req,res)=>{
    res.status(404).render('user/404');
});