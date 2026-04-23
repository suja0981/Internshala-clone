const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    authorUid: { type: String, required: true },
    authorName: { type: String },
    authorPhoto: { type: String },
    content: { type: String, required: true },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ['image', 'video', 'none'], default: 'none' },
    likes: [{ type: String }], // Array of UIDs
    comments: [{
        authorUid: String,
        authorName: String,
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
