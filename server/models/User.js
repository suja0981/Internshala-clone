const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    displayName: { type: String, default: 'Anonymous User' },
    email: { type: String },
    photoURL: { type: String },
    friends: [{ type: String }], // Array of UIDs
    postCountToday: { type: Number, default: 0 },
    lastPostDate: { type: Date, default: Date.now },
    plan: { type: String, enum: ['Free', 'Bronze', 'Silver', 'Gold'], default: 'Free' },
    applicationsThisMonth: { type: Number, default: 0 },
    planStartDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
