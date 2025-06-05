const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    date: String,
    time: String,
    qrId: String
});

module.exports = mongoose.model('Event', eventSchema);