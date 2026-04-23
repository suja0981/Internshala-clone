const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    qualifications: { type: String, required: true },
    experience: { type: String, required: true },
    personalInfo: { type: String, required: true },
    photoUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
