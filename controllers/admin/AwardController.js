const moment = require("moment");
// const User = require("../../models/User");
const Award = require("../../models/Award");
const ObjectId = require('mongodb').ObjectID;

module.exports.list = (req,res)=>{
    let data = [];
	data['path1'] = 'awards';
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
            classDate     :moment(award.classDate).format('DD-MMM-YYYY'),
            participants  :(award.members).length ,
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
    
}

module.exports.detail_row_json = async (req,res)=>{

}