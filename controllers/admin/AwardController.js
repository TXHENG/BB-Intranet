const moment = require("moment");
// const User = require("../../models/User");
const Award = require("../../models/Award");
const Badge = require("../../models/Badge");

module.exports.list = (req,res)=>{
    let data = [];
	data['path1'] = 'badges-classes';
	data['year'] = req.query.year ? req.query.year : moment().year();
    res.render('admin/awards/list',data);
}

module.exports.col_json = async (req,res)=>{
    res.json([
        {name:"awardName",      title:"Award",          "filterable":true,  "sortable":true,    type:"text"},
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
		{ $lookup:
			{
				from: "badges",
				localField: "objBadgeId",
				foreignField: "_id",
				as: 'badge'
			}
		},
		{ $match: { $expr: { $eq: [{ "$year": "$classDate" }, year]}}},
		{ $addFields: {'badge':{$arrayElemAt:["$badge",0]}}}
	]);

    awards.forEach(award => {
        rows.push({
            awardName     :award.badge.name + ' Badge',
            classDate     :moment(award.classDate).format('DD-MMM-YYYY'),
            participants  :(award.members).length ,
            action        :''
                // '<div class="btn-group"><a class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Details" href="/admin/activities/'+ activity._id +'" target="_blank"><i class="fa fa-search"></i></a>'+
                // '<button class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Edit" data-ajax-modal="/admin/activities/'+activity._id+'/edit"><i class="fa fa-pen"></i></button>'+
                // '<button class="btn-danger btn btn-sm" data-toggle="tooltip" title="Delete" data-delete-id="'+activity._id+'"><i class="far fa-trash-alt"></i></button></div>'
        }); 
    });
    res.json(rows);
};

module.exports.new = async (req,res) => {
    if(req.method == 'POST'){
        const {badge_id, class_date} = req.body;
        try{
            const award = await Award.create({
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