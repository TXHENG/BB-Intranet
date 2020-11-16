const moment = require("moment");
const { findById } = require("../../models/Activity");
const Activity = require("../../models/Activity");

module.exports.list = async (req,res)=>{
    var data = [];
    data['path1'] = 'activities';
    if(req.body.year)
        data['year'] = req.body.year;
    res.render('admin/activities/list',data);
}

module.exports.list_col_json = async (req,res)=>{
    res.json([
        {name:"activityName",   title:"Activity Name",  "filterable":true, "sortable":true, type:"text"},
        {name:"startDate",      title:"Start Date",     "filterable":true, "sortable":true, type:"date"},
        {name:"endDate",        title:"End Date",       "filterable":true, "sortable":true, type:"date","breakpoints":"xs sm"},
        {name:"duration",       title:"Duration(Days)", "filterable":true, "sortable":true, type:"number","breakpoints":"xs sm"},
        {name:"action",         title:"Actions",        "filterable":false,"sortable":false,type:"text","breakpoints":"xs sm",},
    ]);
};

module.exports.list_row_json = async (req,res)=>{
    let rows = [], activities = null;
    if(req.body.year){
        activities = await Activity.find({ "$expr": { "$eq": [{ "$year": "$startDate" }, req.body.year] } });
    } else {
        activities = await Activity.find({ "$expr": { "$eq": [{ "$year": "$startDate" }, moment().year()] } });
    }
    activities.forEach(activity => {
        rows.push({
            activityName:activity.name,
            startDate   :moment(activity.startDate).format('DD-MMM-YYYY'),
            endDate     :moment(activity.endDate).format('DD-MMM-YYYY'),
            duration    :moment(activity.endDate).diff(moment(activity.startDate),'days')+1,
            action      :
                '<div class="btn-group"><a class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Details" href="/admin/activities/'+ activity._id +'" target="_blank"><i class="fa fa-search"></i></a>'+
                '<button class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Edit" data-edit-id="'+activity._id+'"><i class="fa fa-pen"></i></button>'+
                '<button class="btn-danger btn btn-sm" data-toggle="tooltip" title="Delete" data-delete-id="'+activity._id+'"><i class="far fa-trash-alt"></i></button></div>'
        }); 
    });
    res.json(rows);
};

module.exports.info = async (req,res)=>{
    const id = req.params.id;
    try{
        let activity = await Activity.findById(id);
        return res.json({activity:activity});
    }catch(err){
        res.json({errors:"Not found"});
    }
}

module.exports.new = async (req,res)=>{
    const {activity_name, start_date, end_date} = req.body;
    try{
        const activity = await Activity.create({
            name: activity_name,
            startDate: start_date,
            endDate: end_date,
        });
        res.status(201).json({activity});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.detail = async (req,res)=>{
    var data = [];
    data['path1'] = 'activities';
    const id = req.params.id;
    try{
        data['activity'] = await Activity.findById(id);
        res.render('admin/activities/detail',data);
    } catch(err){
        res.redirect('/admin/404');
    }
    
}

module.exports.delete = async (req,res)=>{
    const id = req.params.id;
    try{
        let activity = await Activity.findById(id);
        if(activity){
            const name = activity.name;
            await Activity.findByIdAndDelete(id);
            res.status(201).json({name});
        }
    } catch (err) {
        res.status(400).json({errors: "Activity id not found, please try again"});
    }
}

module.exports.edit = async (req,res)=>{
    const id = req.params.id;
    const {activity_name, start_date, end_date} = req.body;
    try{
        const activity = await Activity.findById(id);
        if(activity){
            const data = await Activity.findByIdAndUpdate(id,{name:activity_name,startDate:start_date,endDate:end_date});
            console.log(data);
            res.status(201).json({activity:data});
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({errors: "Activity id not found, please try again"});
    }
}