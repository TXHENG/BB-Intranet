const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BadgeSchema = new Schema({
    name: String,
    group: String,
    groupName: String,
    imgUrl: String
});

const Badge = mongoose.model('badge',BadgeSchema);

module.exports = Badge;