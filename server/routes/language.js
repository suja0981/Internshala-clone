const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Send OTP for Language
router.post('/send-otp', async (req, res) => {
    try {
        const { uid } = req.body;
        if (!uid) return res.status(400).json({ error: 'UID is required' });

        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const otp = generateOTP();
        user.currentOtp = otp;
        await user.save();

        // Simulate sending email
        console.log(`\n========================================`);
        console.log(`🌍 MOCK EMAIL OTP SENT`);
        console.log(`To: ${user.email || 'User'}`);
        console.log(`Subject: Language Verification - French`);
        console.log(`Body: Your OTP to unlock the French language setting is: ${otp}. Do not share this with anyone.`);
        console.log(`========================================\n`);

        res.status(200).json({ message: 'OTP sent successfully to your registered email.' });
    } catch (error) {
        console.error("Send Language OTP Error:", error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { uid, otp } = req.body;
        const user = await User.findOne({ uid });

        if (!user || user.currentOtp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP or expired session.' });
        }

        // Clear OTP after successful verification
        user.currentOtp = undefined;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error("Verify Language OTP Error:", error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});

module.exports = router;
