const moment = require("moment");
const Badge = require("../../models/badge");

module.exports.group_names = async (req,res) => {
    let badge_groups = await Badge.distinct('groupName');
    let result = [];
    badge_groups.forEach(gp => {
        result.push({groupName: gp});
    });
    res.json(result);
}

module.exports.badges = async (req,res) => {
    let badges = await Badge.find();
    res.json(badges);
}