const Award = require("../../models/Award");
const User = require("../../models/User");

module.exports.list = async (req,res)=>{
    var data = [];
    data['path1'] = 'members';
    res.render('admin/users/list',data);
}

module.exports.col_json = async (req,res)=>{
    res.json([
        {name:"rank",   title:"Rank",   filterable:true, sortable:true, type:"text"},
        {name:"name",   title:"Name",   filterable:true, sortable:true, type:"text"},
        {name:"squad",  title:"Squad",  filterable:true, sortable:true, type:"text",breakpoints:"xs sm"},
        {name:"action", title:"Actions",filterable:false,sortable:false,type:"text",breakpoints:"xs sm"}
    ]);
}

module.exports.row_json = async (req,res)=>{
    const users = await User.find({});
    let result = [];
    users.forEach(user => {
        result.push({
            rank: user.rank,
            name: user.name,
            squad: user.squad,
            action: 
                '<div class="btn-group"><a class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Details" href="/admin/members/'+ user._id +'" target="_blank"><i class="fa fa-search"></i></a></div>'
        });
    });
    res.json(result);
}

module.exports.details = async (req,res)=>{
    var data = [];
    const member_id = req.params.id;
    data['member'] = await User.findById(member_id);
    data['badges'] = await Award.aggregate([
        { $match: { members : member_id }},
        { $addFields: { "objBadgeId" : { "$toObjectId" : "$badgeId" } } },
        { $lookup:
            {
                from: "badges",
                localField: "objBadgeId",
                foreignField: "_id",
                as: 'badge'
            }
        },
        { $addFields: {'badge':{$arrayElemAt:["$badge",0]}}}
    ]);
    data['path1'] = 'members';
    res.render('admin/users/details',data);
}