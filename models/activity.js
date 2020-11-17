const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    members: Array
});

const Activity = mongoose.model('activity',ActivitySchema);

module.exports = Activity;