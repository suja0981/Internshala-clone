const express = require('express');
const router = express.Router();
const PasswordReset = require('../models/PasswordReset');

// Helper to check if dates are same day
const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

// Helper to generate a random password (only letters)
const generatePassword = (length = 10) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
};

router.post('/forgot-password', async (req, res) => {
    try {
        const { identifier } = req.body;
        
        if (!identifier) {
            return res.status(400).json({ error: "Email or phone number is required" });
        }

        // Check if a reset request was already made
        let resetRecord = await PasswordReset.findOne({ identifier });
        const today = new Date();

        if (resetRecord) {
            // If the record exists and lastResetDate is today, block the request
            if (isSameDay(resetRecord.lastResetDate, today)) {
                return res.status(429).json({ 
                    error: "You can use this option only once per day." 
                });
            }
            // Update the last reset date to today
            resetRecord.lastResetDate = today;
            await resetRecord.save();
        } else {
            // Create a new record
            resetRecord = new PasswordReset({
                identifier,
                lastResetDate: today
            });
            await resetRecord.save();
        }

        // Generate the strict alphabetic password
        const newPassword = generatePassword(10);

        // In a real app, you would hash this and save it to the User model
        // and email it to the user. For this assignment, we return it.
        res.status(200).json({ 
            message: "Password reset successfully", 
            newPassword 
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
