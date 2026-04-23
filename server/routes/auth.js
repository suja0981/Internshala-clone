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

const LoginHistory = require('../models/LoginHistory');
const User = require('../models/User');

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Track Login Attempt
router.post('/track-login', async (req, res) => {
    try {
        const { uid, email, browser, os, deviceType, ipAddress } = req.body;
        
        let status = 'Success';
        let otpRequired = false;

        // If Google Chrome, force OTP
        if (browser === 'Chrome') {
            status = 'Pending OTP';
            otpRequired = true;
            
            // Generate OTP
            const otp = generateOTP();
            const user = await User.findOne({ uid });
            if (user) {
                user.currentOtp = otp;
                await user.save();
                
                // Simulate email
                console.log(`\n========================================`);
                console.log(`🛡️ SECURITY: MOCK EMAIL OTP SENT`);
                console.log(`To: ${email}`);
                console.log(`Subject: Chrome Login Verification`);
                console.log(`Body: We detected a login attempt from Google Chrome. Your verification code is: ${otp}`);
                console.log(`========================================\n`);
            }
        }

        const historyRecord = new LoginHistory({
            uid,
            email,
            browser,
            os,
            deviceType,
            ipAddress,
            status
        });
        await historyRecord.save();

        if (otpRequired) {
            return res.status(202).json({ message: 'OTP Required', recordId: historyRecord._id });
        }

        res.status(200).json({ message: 'Login tracked successfully' });
    } catch (error) {
        console.error("Track Login Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Verify Login OTP
router.post('/verify-login-otp', async (req, res) => {
    try {
        const { uid, otp, recordId } = req.body;
        const user = await User.findOne({ uid });

        if (!user || user.currentOtp !== otp) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }

        user.currentOtp = undefined;
        await user.save();

        if (recordId) {
            await LoginHistory.findByIdAndUpdate(recordId, { status: 'OTP Verified' });
        }

        res.status(200).json({ message: 'Login Verified' });
    } catch (error) {
        console.error("Verify Login OTP Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Fetch Login History
router.get('/history/:uid', async (req, res) => {
    try {
        const history = await LoginHistory.find({ uid: req.params.uid }).sort({ createdAt: -1 }).limit(10);
        res.status(200).json(history);
    } catch (error) {
        console.error("Fetch Login History Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
