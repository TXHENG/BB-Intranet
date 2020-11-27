const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AwardSchema = new Schema({
    badgeId: String,
    level: String,
    classDate: Date,
    members: [String]
});

const Award = mongoose.model('award',AwardSchema);

module.exports = Award;