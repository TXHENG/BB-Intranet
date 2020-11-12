const User = require("../../models/User");

module.exports.list = async (req,res)=>{
    var data = [];
    data['path1'] = 'members';
    data['users'] = await User.find();
    res.render('admin/users/list',data);
}