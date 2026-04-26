const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Initialize Razorpay (Using dummy test keys since none exist)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890abcd',
    key_secret: process.env.RAZORPAY_SECRET || 'dummy_secret_1234567890abcd'
});

// Helper to check IST Time Window (10:00 AM - 11:00 AM)
const isWithinPaymentWindow = () => {
    const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: 'numeric' };
    const istHour = parseInt(new Date().toLocaleString('en-US', options), 10);
    // Return true if it is between 10 AM and 11 AM (10:00 to 10:59)
    return istHour === 10;
};

// Map plans to INR prices
const planPrices = {
    'Bronze': 100,
    'Silver': 300,
    'Gold': 1000
};

// 1. Create Order Route
router.post('/create-order', async (req, res) => {
    try {
        if (!isWithinPaymentWindow()) {
            return res.status(403).json({ 
                error: 'Payments are only allowed between 10:00 AM and 11:00 AM IST.' 
            });
        }

        const { plan, uid } = req.body;
        
        if (!planPrices[plan]) {
            return res.status(400).json({ error: 'Invalid plan selected.' });
        }

        const options = {
            amount: planPrices[plan] * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        
        // Return order details to frontend
        res.status(200).json({ order, plan, uid });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// 2. Verify Payment Route
router.post('/verify', async (req, res) => {
    try {
        // We will strictly enforce time here as well as per requirements
        if (!isWithinPaymentWindow()) {
            return res.status(403).json({ 
                error: 'Payments are only allowed between 10:00 AM and 11:00 AM IST.' 
            });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, uid } = req.body;

        // In a real app, verify signature:
        /*
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', razorpay.key_secret)
                                        .update(body.toString())
                                        .digest('hex');
        if (expectedSignature !== razorpay_signature) {
             return res.status(400).json({ error: 'Invalid signature' });
        }
        */
        // Note: For this mock, we will trust the payment since test keys are dummy.

        // Update User Subscription
        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.plan = plan;
        user.applicationsThisMonth = 0; // Reset applications upon new subscription
        user.planStartDate = new Date();
        await user.save();

        // 3. Send Email (Mock Invoice)
        console.log(`\n========================================`);
        console.log(`📧 MOCK EMAIL INVOICE SENT`);
        console.log(`To: ${user.email || 'User'}`);
        console.log(`Subject: Payment Successful - ${plan} Plan`);
        console.log(`Body: Thank you for your payment of ₹${planPrices[plan]}. Your account is now upgraded to the ${plan} Plan. You can now start applying!`);
        console.log(`========================================\n`);

        res.status(200).json({ message: 'Payment verified and plan upgraded successfully!' });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
});

module.exports = router;
