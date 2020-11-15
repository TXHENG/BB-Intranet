const Activity = require("../../models/Activity");

module.exports.list = async (req,res)=>{
    var data = [];
    data['path1'] = 'activities';
    data['activities'] = await Activity.find();
    res.render('admin/activities/list',data);
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
    res.render('admin/activities/detail');
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