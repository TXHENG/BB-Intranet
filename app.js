// modules
if(process.env.NODE_ENV){
	require("dotenv").config({
		path: `${__dirname}/.env.${process.env.NODE_ENV}`,
	});
} else {
	require("dotenv").config();
}
const {to_cache} = require('./middleware/cacheResourceMiddleware');
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
const User = require('./models/user');
const Badge = require('./models/badge');
const Admin = require('./models/admin');

// Routes
const UserRoutes = require('./routes/userRoutes');
const AdminRoutes = require('./routes/adminRoutes');

// Connect to MongoDB Atlas
let url = (process.env.DB_URL).replace("%user",process.env.DB_USER).replace("%password",process.env.DB_PASSWORD).replace('%dbname',process.env.DB_NAME);
const dbURI = url;
mongoose.connect(dbURI,{
	useCreateIndex: true
})
	.then((result) => app.listen(process.env.PORT||3000))
	.catch((err) => console.log(err));

app.use(morgan('dev'));
// Resoureces
app.use('/node_modules',to_cache,express.static('node_modules'));
app.use('/resources',to_cache,express.static('resources'));

// routes (will automatically find in "views" folder)
app.set('subdomain offset', 1);

app.get('*',(req,res,next)=>{
	console.log(process.env.NODE_ENV);
	console.log('x');
	res.locals.moment = moment;
	res.locals.ranks = [
		{abv:'RCT',		name:'Recruit'},
		{abv:'PTE',		name:'Private'},
		{abv:'L/CPL',	name:'Lance Corporal'},
		{abv:'CPL',		name:'Corporal'},
		{abv:'SGT',		name:'Sergeant'},
		{abv:'SSGT',	name:'Staff Sergeant'}
	];
	res.locals.activity_levels = [
		{name: 'Company / School Level', point: 1},
		{name: 'State Level / Community', point: 2},
		{name: 'National / BBM Level', point: 3}
	];
	res.locals.activity_levels = {
		'Company / School Level': 1,
		'State Level / Community': 2,
		'National / BBM Level': 3
	};
	next();
});

// admin route
app.use('/admin', AdminRoutes);

// user route
app.use(UserRoutes);