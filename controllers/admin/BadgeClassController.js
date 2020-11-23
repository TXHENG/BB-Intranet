const moment = require("moment");
// const User = require("../../models/User");
const BadgeClass = require("../../models/badge_class");

module.exports.list = (req,res)=>{
    let data = [];
    data['path1'] = 'badges-classes';
    res.render('admin/badge-classes/list');
}

module.exports.col_json = async (req,res)=>{
    res.json([
        {name:"badgeClassName", title:"Badge Name",     "filterable":true,  "sortable":true,    type:"text"},
        {name:"classDate",      title:"Class Date",     "filterable":true,  "sortable":true,    type:"date"},
        {name:"participants",   title:"Participants",   "filterable":false, "sortable":true,    type:"number",  breakpoints:"xs sm"},
        {name:"action",         title:"Actions",        "filterable":false, "sortable":false,   type:"text",    breakpoints:"xs sm"},
    ]);
};

module.exports.row_json = async (req,res)=>{
    let rows = [], badge_classes = null;
    if(req.query.year){
        badge_classes = await BadgeClass.find({ "$expr": { "$eq": [{ "$year": "$classDate" }, moment(req.query.year).year()] } });
    } else {
        badge_classes = await BadgeClass.find({ "$expr": { "$eq": [{ "$year": "$classDate" }, moment().year()] } });
    }
    badge_classes.forEach(badge_class => {
        rows.push({
            badgeClassName:badge_class.name,
            classDate     :moment(badge_class.classDate).format('DD-MMM-YYYY'),
            participants  :(badge_class.members).length ,
            action        :''
                // '<div class="btn-group"><a class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Details" href="/admin/activities/'+ activity._id +'" target="_blank"><i class="fa fa-search"></i></a>'+
                // '<button class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Edit" data-ajax-modal="/admin/activities/'+activity._id+'/edit"><i class="fa fa-pen"></i></button>'+
                // '<button class="btn-danger btn btn-sm" data-toggle="tooltip" title="Delete" data-delete-id="'+activity._id+'"><i class="far fa-trash-alt"></i></button></div>'
        }); 
    });
    res.json(rows);
};