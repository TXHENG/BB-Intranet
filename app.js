var express = require('express');
var app = express();
app.listen(3000);
app.use('/node_modules',express.static('node_modules'));
app.use('/resources',express.static('resources'));
app.set('view engine', 'ejs');

app.get('/',function(req, res){
    res.render('user/index');
});

app.get('/profile/:name', function(req, res){
    res.render('/user/index',{person: req.params.name});
});