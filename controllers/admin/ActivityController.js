const moment = require("moment");
const Activity = require("../../models/Activity");
const User = require("../../models/User");

module.exports.list = async (req,res)=>{
    var data = [];
    data['path1'] = 'activities';
    if(req.query.year)
        data['year'] = req.query.year;
    res.render('admin/activities/list',data);
}

module.exports.list_col_json = async (req,res)=>{
    res.json([
        {name:"activityName",   title:"Activity Name",  "filterable":true, "sortable":true, type:"text"},
        {name:"startDate",      title:"Start Date",     "filterable":true, "sortable":true, type:"date"},
        {name:"endDate",        title:"End Date",       "filterable":true, "sortable":true, type:"date","breakpoints":"xs sm"},
        {name:"duration",       title:"Duration(Days)", "filterable":true, "sortable":true, type:"number","breakpoints":"xs sm"},
        {name:"participants",    title:"Participants",   "filterable":false,"sortable":true, type:"number","breakpoints":"xs sm"},
        {name:"action",         title:"Actions",        "filterable":false,"sortable":false,type:"text","breakpoints":"xs sm",},
    ]);
};

module.exports.list_row_json = async (req,res)=>{
    let rows = [], activities = null;
    if(req.query.year){
        activities = await Activity.find({ "$expr": { "$eq": [{ "$year": "$startDate" }, moment(req.query.year).year()] } });
    } else {
        activities = await Activity.find({ "$expr": { "$eq": [{ "$year": "$startDate" }, moment().year()] } });
    }
    activities.forEach(activity => {
        rows.push({
            activityName:activity.name,
            startDate   :moment(activity.startDate).format('DD-MMM-YYYY'),
            endDate     :moment(activity.endDate).format('DD-MMM-YYYY'),
            duration    :moment(activity.endDate).diff(moment(activity.startDate),'days') + 1,
            participants:(activity.members).length ,
            action      :
                '<div class="btn-group"><a class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Details" href="/admin/activities/'+ activity._id +'" target="_blank"><i class="fa fa-search"></i></a>'+
                '<button class="btn-default btn btn-sm border-primary text-primary" data-toggle="tooltip" title="Edit" data-ajax-modal="/admin/activities/'+activity._id+'/edit"><i class="fa fa-pen"></i></button>'+
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
    if(req.method == 'POST'){
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
    res.render('admin/activities/new-modal');
}

module.exports.detail = async (req,res)=>{
    var data = [];
    data['path1'] = 'activities';
    const id = req.params.id;
    data['id'] = id;
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
    let data = [];
    if(req.method == 'POST'){
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
    data['activity'] = await Activity.findById(id);
    res.render('admin/activities/edit-modal',data);
}

module.exports.detail_col = async (req,res)=>{
    res.json([
        {name:"rank",   title:"Rank",   filterable:true, sortable:true, type:"text"},
        {name:"name",   title:"Name",   filterable:true, sortable:true, type:"text"},
        {name:"squad",  title:"Squad",  filterable:true, sortable:true, type:"text",breakpoints:"xs sm"},
        {name:"action", title:"Actions",filterable:false,sortable:false,type:"text",breakpoints:"xs sm"}
    ]);
}
module.exports.detail_row = async (req,res)=>{
    const id = req.params.id;
    let result = [];
    const activity = await Activity.findById(id);
    
    if(activity.members!=""){
        const users = await User.find({
            _id:{$in:activity.members}
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
    const activity_id = req.params.id;
    const activity = await Activity.findById(activity_id);
    let users = await User.find(
        {_id:{$nin:activity.members}},
        {password:0,badges:0,email:0});
    res.json(users);
}

module.exports.add_members = async (req,res)=>{
    const activity_id = req.params.id;
    let data = [];
    data['activity_id'] = activity_id;
    if(req.method == 'POST'){
        const {members_ids} = req.body;
    
        try{
            let result = await Activity.findByIdAndUpdate( activity_id,
                { $addToSet : { members : { $each : members_ids }}}
            ).then(()=>{
                res.json({success:'success'});
            });
        } catch (err){
            console.log(err);
            res.json({errors:'fail'});
        }    
    }
    res.render('admin/activities/add-member-modal',data);
}

module.exports.remove_members = async (req,res)=>{
    const activity_id = req.params.id;
    const member_id = req.params.member_id;
    try{
        await Activity.update(
            {_id:activity_id},
            {$pull:{'members':member_id}}
        );
        const member = await (User.findById(member_id));
        res.json({name:member.name});
    }catch(err){
        console.log(err);
        res.json({errors:'fail'});
    }
}