const assert = require('assert');
const User = require('../models/user');

// desc test
describe('Nest record test', function(){
    var user;
    // create user
    it('create user', function(){
        user = new User({
            name: "Tan Xu Heng",
            email: "txh0607@gmail.com",
            rank: "SSGT",
            age: 19,
            badges:[
                {
                    name: 'hobby',
                    basicDate:'2020-11-07'
                }
            ]
        });

        user.save().then(function(){
            User.findOne({name: "Tan Xu Heng"}).then(function(record, done){
                assert(record.books.length === 1);
                done();
            })
        });
    });

    it('add badge', function(){
        User.findOne({name: 'Tan Xu Heng'}).then(function(record){
            record.badges.push({name: "judo", basicDate:"2020-11-07"});
            record.save().then(function(done){
                User.findOne({name: "Tan Xu Heng"}).then(function(record, done){
                    assert(record.books.length === 2);
                    done();
                })
            })
        });
    }); 

    // it('increase age by 1', function(){
    //     User.update({}, {$inc:{age:1}}).then(function(){
    //         User.findOne({name: "Tan Xu Heng"}).then(function(result,done){
    //             assert(result.age === 20);
    //             done();
    //         });
    //     });
    // }); 
});