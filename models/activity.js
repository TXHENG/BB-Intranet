const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    level: String,
    members: [String]
});

const Activity = mongoose.model('activity',ActivitySchema);

module.exports = Activity;