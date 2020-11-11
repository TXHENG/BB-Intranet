const mongoose = require('mongoose');
mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.set('useFindAndModify',false);
mongoose.Promise = global.Promise;

// connect to db before doing other things
before(function(done){
    mongoose.connect('mongodb://localhost/BBintranet');

    mongoose.connection.once('open',function (param) {
        console.log('connected');
        done();
    }).on('error',function(error){
        console.log('error: ' + error);
    });
});

// drop table before each test
beforeEach(function(done){
    // drop collectioni
    mongoose.connection.collections.users.drop(function(){
        done();
    })
});
