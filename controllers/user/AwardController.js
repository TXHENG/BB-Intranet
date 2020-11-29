const { resolveInclude } = require('ejs');
const moment = require('moment');
const Award = require('../../models/Award');
module.exports.list = async (req,res) => {
    res.render('user/awards/list');
}

module.exports.list_col = async (req,res) => {
    res.json([
        {name:"awardName",      title:"Award",          "filterable":true,  "sortable":true,    type:"text"},
        {name:"level",          title:"Level",          "filterable":true,  "sortable":true,    type:"text"},
        {name:"classDate",      title:"Class Date",     "filterable":true,  "sortable":true,    type:"date"},
    ]);
}

module.exports.list_row = async (req,res) => {
    let awards =  await Award.aggregate([
        { $addFields: { "objBadgeId" : { "$toObjectId" : "$badgeId" } } },
        { $sort: { classDate: -1 } },
        { $match: {'members': res.locals.user._id.toString()}},
		{ $lookup:
			{
				from: "badges",
				localField: "objBadgeId",
				foreignField: "_id",
				as: 'badge'
			}
        },
        { $addFields: {'badge':{$arrayElemAt:["$badge",0]}}},
    ]);
    let result = [];
    awards.forEach(award => {
        result.push({
            awardName: award.badge.name,
            level: award.level,
            classDate: moment(award.classDate).format('DD-MMM-YYYY'),
        });
    });
    res.json(result);
}
