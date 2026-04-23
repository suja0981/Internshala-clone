const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    identifier: { 
        type: String, 
        required: true,
        unique: true 
    },
    lastResetDate: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
