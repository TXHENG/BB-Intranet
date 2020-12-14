const moment = require("moment");
const User = require("../../models/user");
const Award = require("../../models/award");
const ObjectId = require('mongodb').ObjectID;

module.exports.list = (req,res)=>{
    let data = [];
	data['year'] = req.query.year ? req.query.year : moment().year();
    res.render('admin/awards/list',data);
}

module.exports.col_json = async (req,res)=>{
    res.json([
        {name:"awardName",      title:"Award",          "filterable":true,  "sortable":true,    type:"text"},
        {name:"level",          title:"Level",          "filterable":true,  "sortable":true,    type:"text"},
        {name:"classDate",      title:"Class Date",     "filterable":true,  "sortable":true,    type:"date"},
        {name:"participants",   title:"Participants",   "filterable":false, "sortable":true,    type:"number",  breakpoints:"xs sm"},
        {name:"action",         title:"Actions",        "filterable":false, "sortable":false,   type:"text",    breakpoints:"xs sm"},
    ]);
};

module.exports.row_json = async (req,res)=>{
	let rows = [];
	let year = req.query.year ? moment(req.query.year).year() : moment().year();

	let awards =  await Award.aggregate([
        { $addFields: { "objBadgeId" : { "$toObjectId" : "$badgeId" } } },
        { $sort: { classDate: -1 } },
		{ $lookup:
			{
				from: "badges",
				localField: "objBadgeId",
				foreignField: "_id",
				as: 'badge'
			}
		},
		{ $match: { $expr: { $eq: [{ "$year": "$classDate" }, year]}}},
        { $addFields: {'badge':{$arrayElemAt:["$badge",0]}}},
	]);

    awards.forEach(award => {
        rows.push({
            awardName     :award.badge.name + ' Badge',
            level         :award.level,
            classDate     :moment(award.classDate).format('DD-MMM-YYYY'),
            participants  :award.members.length ,
            action        :
                '<div class="btn-group"><a class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Details" href="/admin/awards/'+ award._id +'" target="_blank"><i class="fa fa-search"></i></a>'+
                '<button class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Edit" data-ajax-modal="/admin/awards/'+award._id+'/edit"><i class="fa fa-pen"></i></button>'+
                '<button class="btn-danger btn btn-sm" data-toggle="tooltip" title="Delete" data-delete-id="'+award._id+'"><i class="far fa-trash-alt"></i></button></div>'
        }); 
    });
    res.json(rows);
};

module.exports.new = async (req,res) => {
    if(req.method == 'POST'){
        const {level, badge_id, class_date} = req.body;
        try{
            const award = await Award.create({
                level: level,
                badgeId: badge_id,
                classDate: class_date,
            });
            res.status(201).json({award});
        } catch (err) {
            res.status(400).json({err});
        }
    }
    res.render('admin/awards/new-modal');
}

module.exports.delete = async (req,res) => {
    const id = req.params.id;
    try{
        let award = await Award.findById(id);
        if(award){
            await Award.findByIdAndDelete(id);
            res.status(201).json({success:'success'});
        }
    } catch (err) {
        res.status(400).json({errors: "Activity id not found, please try again"});
    }
}

module.exports.edit = async (req,res) => {
    let data = [];
    const id = ObjectId.createFromHexString(req.params.id);

    if(req.method == 'POST'){
        const {class_date, level} = req.body;
        try{
            const award = await Award.findById(id);
            if(award){
                const data = await Award.findByIdAndUpdate(id,{level:level,classDate:class_date});
                res.status(201).json({award:data});
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({errors: "Activity id not found, please try again"});
        }
    }

    try{
        let award = await Award.aggregate([
            { $match: { _id : id }},
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
        data['award'] = award[0];
        res.render('admin/awards/edit-modal',data);
    } catch (err) {
        console.log(err);
        res.redirect('/admin/404');
    }
}

module.exports.detail = async (req,res) => {
    let data = [];
    const id = ObjectId.createFromHexString(req.params.id);
    try{
        let award =  await Award.aggregate([
            { $match: { _id : id }},
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
        data['award'] = award[0];
        res.render('admin/awards/detail',data);
    } catch (err) {
        console.log(err);
        res.redirect('/admin/404');
    }
}
module.exports.detail_col_json = async (req,res)=>{
    res.json([
        {name:"rank",   title:"Rank",   filterable:true, sortable:true, type:"text"},
        {name:"name",   title:"Name",   filterable:true, sortable:true, type:"text"},
        {name:"squad",  title:"Squad",  filterable:true, sortable:true, type:"text",breakpoints:"xs sm"},
        {name:"action", title:"Actions",filterable:false,sortable:false,type:"text",breakpoints:"xs sm"}
    ]);
}

module.exports.detail_row_json = async (req,res)=>{
    const id = req.params.id;
    let result = [];
    const award = await Award.findById(id);
    
    if(award.members != ""){
        const users = await User.find({
            _id:{$in:award.members}
        });
        users.forEach(user => {
            result.push({
                rank:user.rank,
                name:user.name,
                squad:user.squad,
                action: 
                '<div class="btn-group"><a class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Details" href="/admin/members/'+ user._id +'" target="_blank"><i class="fa fa-search"></i></a>'+
                '<button class="btn-danger btn btn-sm" data-toggle="tooltip" title="Delete" data-delete-id="'+ user._id +'"><i class="far fa-trash-alt"></i></button></div>'
            });
        });
    }
    res.json(result);
}

module.exports.members = async (req,res)=>{
    const award_id = req.params.id;
    const award = await Award.findById(award_id);
    let users = await User.find(
        {_id:{$nin:award.members}},
        {password:0,badges:0,email:0});
    res.json(users);
}

module.exports.add_members = async (req,res) => {
    let data = [];
    const award_id = req.params.id;
    if(req.method == "POST"){
        const {members_ids} = req.body;
        try{
            let result = await Award.findByIdAndUpdate( award_id,
                { $addToSet : { members : { $each : members_ids }}}
            ).then(()=>{
                res.json({success:'success'});
            });
        } catch (err){
            console.log(err);
            res.json({errors:'fail'});
        }
    }
    let award =  await Award.aggregate([
        { $match: { _id : ObjectId(award_id) }},
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
    data['award'] = award[0];
    res.render('admin/awards/add-member-modal',data);
}

module.exports.remove_member = async (req,res) => {
    const award_id = req.params.id;
    const member_id = req.params.member_id;
    try{
        await Award.update(
            {_id:award_id},
            {$pull:{'members':member_id}}
        );
        const member = await (User.findById(member_id));
        res.json({name:member.name});
    }catch(err){
        console.log(err);
        res.json({errors:'fail'});
    }
}