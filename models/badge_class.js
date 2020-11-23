const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const membersList = new Schema({
    id: String,
    level: String
})

const BadgeClassSchema = new Schema({
    name: String,
    classDate: Date,
    members: [membersList]
});

const BadgeClass = mongoose.model('badge_class',BadgeClassSchema);

module.exports = BadgeClass;