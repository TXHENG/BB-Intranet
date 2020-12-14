const moment = require("moment");
const Activity = require("../../models/activity");

module.exports.list = async (req,res) => {
    let data = [];
    data['path1'] = 'activities';
    if(req.query.year)
        data['year'] = req.query.year;
    res.render('user/activities/list',data);
}

module.exports.list_col = async (req,res) => {
    res.json([
        {name:"activityName",   title:"Activity Name",  "filterable":true, "sortable":true, type:"text"},
        {name:"startDate",      title:"Start Date",     "filterable":true, "sortable":true, type:"date"},
        {name:"endDate",        title:"End Date",       "filterable":true, "sortable":true, type:"date","breakpoints":"xs sm"},
        {name:"duration",       title:"Duration(Days)", "filterable":true, "sortable":true, type:"number","breakpoints":"xs sm"},
    ]);
}

module.exports.list_row = async (req,res) => {
    let rows = [], activities = null;
    if(req.query.year){
        activities = await Activity.find({ 
            members: res.locals.user._id, 
            "$expr": { 
                "$eq": [
                    { "$year": "$startDate" }, 
                    moment(req.query.year).year()
                ] 
            }
        });
    } else {
        activities = await Activity.find({ 
            members: res.locals.user._id, 
            "$expr": { 
                "$eq": [
                    { "$year": "$startDate" }, 
                    moment().year()
                ] 
            }
        });
    }
    activities.forEach(activity => {
        rows.push({
            activityName:activity.name,
            startDate   :moment(activity.startDate).format('DD-MMM-YYYY'),
            endDate     :moment(activity.endDate).format('DD-MMM-YYYY'),
            duration    :moment(activity.endDate).diff(moment(activity.startDate),'days') + 1,
        }); 
    });
    res.json(rows);
}