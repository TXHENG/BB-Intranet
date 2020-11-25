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

// Models
const User = require('./models/User');
const Badge = require('./models/Badge');
const Admin = require('./models/Admin');

// Routes
const UserRoutes = require('./routes/userRoutes');
const AdminRoutes = require('./routes/adminRoutes');

// Connect to MongoDB Atlas
const dbURI = "mongodb+srv://TXHeng:@TXHeng1419@bbintranet.66t77.mongodb.net/BBintranet?retryWrites=true&w=majority";
mongoose.connect(dbURI,{
    useCreateIndex: true
})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.use(morgan('dev'));
// Resoureces
app.use('/node_modules',express.static('node_modules'));
app.use('/resources',express.static('resources'));

// routes (will automatically find in "views" folder)
app.set('subdomain offset', 1);

app.get('*',(req,res,next)=>{
    res.locals.moment = moment;
    res.locals.ranks = ['Recruit','Private','Lance Corporal','Corporal','Sergeant','Staff Sergeant'];
    next();
});

// admin route
app.use('/admin', AdminRoutes);

// user route
app.use(UserRoutes);