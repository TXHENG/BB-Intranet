const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const membersList = new Schema({
    id: String,
    level: String
})

const AwardSchema = new Schema({
    badgeId: String,
    classDate: Date,
    members: [membersList]
});

const Award = mongoose.model('award',AwardSchema);

module.exports = Award;