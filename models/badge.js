const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BadgeSchema = new Schema({
    name: String,
    basicDate: Date,
    advanceDate: Date,
});

const Badge = mongoose.model('badge',BadgeSchema);

module.exports = Badge;