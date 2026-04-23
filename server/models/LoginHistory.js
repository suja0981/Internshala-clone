const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
    uid: { type: String, required: true },
    email: { type: String, required: true },
    browser: { type: String, required: true },
    os: { type: String, required: true },
    deviceType: { type: String, required: true },
    ipAddress: { type: String, required: true },
    status: { type: String, required: true }, // 'Success', 'Pending OTP', 'OTP Verified'
}, { timestamps: true });

module.exports = mongoose.model('LoginHistory', loginHistorySchema);
