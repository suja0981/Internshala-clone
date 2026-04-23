const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Helper to check if dates are same day
const isSameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

// Get all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a post
router.post('/posts', async (req, res) => {
    try {
        const { authorUid, content, mediaUrl, mediaType } = req.body;
        if (!authorUid || !content) return res.status(400).json({ error: 'Author and content required' });

        const user = await User.findOne({ uid: authorUid });
        if (!user) return res.status(404).json({ error: 'User not found. Please login first.' });

        // Reset post count if it's a new day
        const today = new Date();
        if (!isSameDay(user.lastPostDate, today)) {
            user.postCountToday = 0;
            user.lastPostDate = today;
        }

        const friendCount = user.friends.length;
        let limit = 0;
        if (friendCount === 0) limit = 0;
        else if (friendCount === 1) limit = 1;
        else if (friendCount >= 2 && friendCount <= 10) limit = 2; // Assuming 2-10 means 2 posts limit
        else if (friendCount > 10) limit = Infinity;

        if (user.postCountToday >= limit && limit !== Infinity) {
            return res.status(403).json({ 
                error: `Posting limit reached. You have ${friendCount} friend(s), allowing ${limit} post(s) per day.` 
            });
        }

        const newPost = new Post({
            authorUid,
            authorName: user.displayName,
            authorPhoto: user.photoURL,
            content,
            mediaUrl,
            mediaType
        });
        await newPost.save();

        user.postCountToday += 1;
        await user.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Like a post
router.post('/posts/:id/like', async (req, res) => {
    try {
        const { uid } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const likeIndex = post.likes.indexOf(uid);
        if (likeIndex === -1) {
            post.likes.push(uid);
        } else {
            post.likes.splice(likeIndex, 1);
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Comment on a post
router.post('/posts/:id/comment', async (req, res) => {
    try {
        const { authorUid, authorName, text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        post.comments.push({
            authorUid,
            authorName,
            text,
            createdAt: new Date()
        });
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
