const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    category: String,
    aboutCompany: String,
    aboutJob: String,
    whoCanApply: String,
    perks: Array,
    Experience: String,
    AdditionalInfo: String,
    CTC: String,
    StartDate: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('Job', JobSchema);