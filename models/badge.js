const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BadgeSchema = new Schema({
    name: String,
    basicClassId: String,
    advanceClassId: String,
});

const Badge = mongoose.model('badge',BadgeSchema);

module.exports = Badge;