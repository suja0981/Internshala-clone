import React, { useState } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Share2, Send, User } from 'lucide-react';
import { toast } from 'react-toastify';

export default function PostCard({ post, currentUid, currentUserName, onUpdate }: { post: any, currentUid: string, currentUserName?: string, onUpdate: () => void }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const isLiked = post.likes?.includes(currentUid) || false;

  const handleLike = async () => {
    if (!currentUid) {
      toast.info("Please login to like posts.");
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/public-space/posts/${post._id}/like`, {
        uid: currentUid
      });
      onUpdate();
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUid) {
      toast.info("Please login to comment.");
      return;
    }
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/public-space/posts/${post._id}/comment`, {
        authorUid: currentUid,
        authorName: currentUserName || 'User',
        text: commentText
      });
      setCommentText("");
      onUpdate();
    } catch (error) {
      console.error("Error commenting", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    const shareText = `${post.authorName} on InternArea: "${post.content}"`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'InternArea Post', text: shareText, url: window.location.href });
      } catch {}
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Post copied to clipboard!');
    }
  };

  return (
    <div className="card" style={{ padding: "20px", marginBottom: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        {post.authorPhoto ? (
          <img src={post.authorPhoto} alt="Author" style={{ width: 42, height: 42, borderRadius: "var(--radius-full)", objectFit: "cover", border: "1px solid var(--border-default)" }} />
        ) : (
          <div style={{ width: 42, height: 42, borderRadius: "var(--radius-full)", background: "var(--color-brand-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-brand-900)", fontWeight: 700, fontSize: 16 }}>
            {post.authorName?.charAt(0) || 'U'}
          </div>
        )}
        <div>
          <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-neutral-900)" }}>{post.authorName || "Anonymous"}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>
            {new Date(post.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Content */}
      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-800)", lineHeight: 1.6, marginBottom: post.mediaUrl ? 16 : 12, whiteSpace: "pre-line" }}>
        {post.content}
      </p>

      {/* Media */}
      {post.mediaUrl && (
        <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16, border: "1px solid var(--border-subtle)", background: "var(--color-neutral-900)" }}>
          {post.mediaType === 'video' ? (
            <video src={post.mediaUrl} controls style={{ width: "100%", maxHeight: 400, display: "block" }} />
          ) : (
            <img src={post.mediaUrl} alt="Post Attachment" style={{ width: "100%", maxHeight: 400, objectFit: "contain", display: "block" }} />
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
        <button
          onClick={handleLike}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            fontSize: "var(--text-sm)", fontWeight: 500,
            color: isLiked ? "var(--color-error-500)" : "var(--color-neutral-500)",
            transition: "all 0.15s ease"
          }}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            fontSize: "var(--text-sm)", fontWeight: 500,
            color: "var(--color-neutral-500)",
            transition: "all 0.15s ease"
          }}
        >
          <MessageCircle size={18} />
          <span>{post.comments?.length || 0}</span>
        </button>

        <button
          onClick={handleShare}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            fontSize: "var(--text-sm)", fontWeight: 500,
            color: "var(--color-neutral-500)",
            marginLeft: "auto",
            transition: "all 0.15s ease"
          }}
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
          {/* Comment list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {post.comments?.length > 0 ? (
              post.comments.map((comment: any, index: number) => (
                <div key={index} style={{ display: "flex", gap: 10, background: "var(--color-neutral-50)", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "var(--radius-full)", background: "var(--color-brand-100)", color: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                    {comment.authorName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-900)" }}>{comment.authorName}</span>
                      <span style={{ fontSize: "10px", color: "var(--color-neutral-400)" }}>
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-700)", margin: "4px 0 0" }}>{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", textAlign: "center", margin: "8px 0" }}>No comments yet. Be the first to start the conversation!</p>
            )}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleComment} style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Write a supportive comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="input input-sm"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="btn btn-primary btn-sm"
              style={{ padding: "0 14px" }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
