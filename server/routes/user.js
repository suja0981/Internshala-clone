const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sync user on login
router.post('/sync', async (req, res) => {
    try {
        const { uid, displayName, email, photoURL } = req.body;
        if (!uid) return res.status(400).json({ error: 'UID is required' });

        let user = await User.findOne({ uid });
        if (!user) {
            user = new User({ uid, displayName, email, photoURL });
            await user.save();
        } else {
            // Update profile
            user.displayName = displayName || user.displayName;
            user.photoURL = photoURL || user.photoURL;
            await user.save();
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a friend (For testing limit increases)
router.post('/add-friend', async (req, res) => {
    try {
        const { uid, friendUid } = req.body;
        if (!uid || !friendUid) return res.status(400).json({ error: 'UIDs are required' });
        
        if (uid === friendUid) return res.status(400).json({ error: 'Cannot friend yourself' });

        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Note: Ideally we'd check if friendUid actually exists, but allowing any string for ease of testing.
        if (!user.friends.includes(friendUid)) {
            user.friends.push(friendUid);
            await user.save();
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user profile
router.get('/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
