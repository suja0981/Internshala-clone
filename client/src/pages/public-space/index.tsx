import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { auth, storage } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import PostCard from '../../component/PostCard';
import Navbar from '../../component/Navbar';
import Footer from '../../component/Footer';
import { ImagePlus, Video, AlertCircle, UserPlus, Users, MessageSquare, Sparkles, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import Head from 'next/head';

export default function PublicSpace() {
  const [user, setUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Post form state
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Add friend state
  const [friendUid, setFriendUid] = useState("");
  const [addingFriend, setAddingFriend] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/public-space/posts`);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchDbUser = async (uid: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${uid}`);
      setDbUser(res.data);
    } catch (error) {
      console.error("Error fetching db user", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync`, {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL
          });
          setDbUser(res.data);
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
      await fetchPosts();
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to post.");
    if (!content.trim() && !file) return toast.error("Post content cannot be empty.");

    setUploading(true);
    let mediaUrl = "";
    let mediaType = "none";

    try {
      if (file) {
        const isVideo = file.type.startsWith('video');
        mediaType = isVideo ? 'video' : 'image';
        const storageRef = ref(storage, `public-space/${user.uid}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => reject(error),
            async () => {
              mediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(mediaUrl);
            }
          );
        });
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/public-space/posts`, {
        authorUid: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhoto: user.photoURL || '',
        content,
        mediaUrl,
        mediaType
      });

      setContent("");
      setFile(null);
      toast.success("Post shared with the community!");
      await fetchPosts();
      if (user) fetchDbUser(user.uid);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error creating post.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first.");
    if (!friendUid.trim()) return;

    setAddingFriend(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/add-friend`, {
        uid: user.uid,
        friendUid: friendUid.trim()
      });
      toast.success(res.data.message);
      setFriendUid("");
      fetchDbUser(user.uid);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add connection.");
    } finally {
      setAddingFriend(false);
    }
  };

  return (
    <>
      <Head>
        <title>Community Space — InternArea</title>
        <meta name="description" content="Connect, learn, and grow with peers and job seekers on InternArea Public Space." />
      </Head>

      <Navbar />

      <main style={{ background: "var(--color-background)", minHeight: "100vh", padding: "40px 0 80px" }}>
        <div className="page-container">

          {/* Header Banner */}
          <div style={{
            background: "linear-gradient(135deg, var(--color-brand-900) 0%, var(--color-brand-800) 100%)",
            borderRadius: "var(--radius-2xl)",
            padding: "36px 40px",
            color: "#fff",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(255,255,255,0.1)", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 12 }}>
                <Sparkles size={13} color="var(--color-brand-300)" /> InternArea Community
              </div>
              <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
                Connect, Share &amp; Grow
              </h1>
              <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                Exchange interview experiences, ask career advice, and network with students and professionals.
              </p>
            </div>
            <div style={{ position: "absolute", right: -40, top: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }} className="community-grid">

            {/* Left: Feed */}
            <div>
              {/* Create Post Box */}
              {user ? (
                <div className="card" style={{ padding: "24px", marginBottom: 28 }}>
                  <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} style={{ width: 44, height: 44, borderRadius: "var(--radius-full)", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-full)", background: "var(--color-brand-100)", color: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <textarea
                      placeholder="Share your interview experience, project, or ask a question..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="input"
                      rows={3}
                      style={{ resize: "none", flex: 1, padding: "12px 14px", fontSize: "var(--text-sm)" }}
                    />
                  </div>

                  {file && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", background: "var(--color-brand-50)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-brand-200)", marginBottom: 14, fontSize: "var(--text-xs)", color: "var(--color-brand-900)" }}>
                      <span>Attached: {file.name}</span>
                      <button onClick={() => setFile(null)} style={{ background: "none", border: "none", color: "var(--color-error-500)", cursor: "pointer", fontWeight: 600 }}>Remove</button>
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => e.target.files && setFile(e.target.files[0])} style={{ display: "none" }} />
                      <input type="file" accept="video/*" ref={videoInputRef} onChange={(e) => e.target.files && setFile(e.target.files[0])} style={{ display: "none" }} />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--color-neutral-50)", border: "1px solid var(--border-default)", padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-neutral-700)", cursor: "pointer" }}
                      >
                        <ImagePlus size={15} color="var(--color-brand-700)" /> Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--color-neutral-50)", border: "1px solid var(--border-default)", padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-neutral-700)", cursor: "pointer" }}
                      >
                        <Video size={15} color="var(--color-accent-600)" /> Video
                      </button>
                    </div>

                    <button
                      onClick={handlePostSubmit}
                      disabled={uploading || (!content.trim() && !file)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: "0 20px" }}
                    >
                      {uploading ? 'Sharing...' : 'Post'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: "24px", textAlign: "center", marginBottom: 28, background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)" }}>
                  <MessageSquare size={32} color="var(--color-brand-900)" style={{ margin: "0 auto 10px" }} />
                  <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--color-brand-900)", marginBottom: 4 }}>Join the Community Discussion</h3>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-600)", marginBottom: 14 }}>Log in with Google to post questions, share tips, and connect with peers.</p>
                </div>
              )}

              {/* Feed Posts */}
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 160, borderRadius: "var(--radius-lg)" }} />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="card" style={{ padding: "48px 24px", textAlign: "center" }}>
                  <MessageSquare size={40} color="var(--color-neutral-300)" style={{ margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-neutral-700)" }}>No posts in the community yet</p>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", marginTop: 4 }}>Be the first one to start a meaningful conversation!</p>
                </div>
              ) : (
                posts.map(post => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUid={user?.uid}
                    currentUserName={user?.displayName}
                    onUpdate={fetchPosts}
                  />
                ))
              )}
            </div>

            {/* Right: Sidebar widgets */}
            <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* User Profile Mini Widget */}
              {user && (
                <div className="card" style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" style={{ width: 44, height: 44, borderRadius: "var(--radius-full)", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-full)", background: "var(--color-brand-100)", color: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--color-neutral-900)" }}>{user.displayName}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-brand-900)", fontWeight: 500 }}>Plan: {dbUser?.plan || 'Free'}</div>
                    </div>
                  </div>
                  <div style={{ background: "var(--color-neutral-50)", borderRadius: "var(--radius-md)", padding: "10px 14px", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--color-neutral-600)", marginBottom: 4 }}>
                      <span>Connections</span>
                      <strong style={{ color: "var(--color-neutral-900)" }}>{dbUser?.friends?.length || 0}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--color-neutral-600)" }}>
                      <span>Posts Today</span>
                      <strong style={{ color: "var(--color-neutral-900)" }}>{dbUser?.postsToday || 0} / {dbUser?.plan === 'Gold' ? '∞' : dbUser?.plan === 'Silver' ? 5 : dbUser?.plan === 'Bronze' ? 3 : 1}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Connect by UID Widget */}
              {user && (
                <div className="card" style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <UserPlus size={18} color="var(--color-brand-900)" />
                    <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-neutral-900)", margin: 0 }}>Add Connection</h3>
                  </div>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginBottom: 12 }}>Connect with classmates using their User ID.</p>
                  <form onSubmit={handleAddFriend} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Enter connection User ID"
                      value={friendUid}
                      onChange={(e) => setFriendUid(e.target.value)}
                      className="input input-sm"
                    />
                    <button type="submit" disabled={addingFriend || !friendUid.trim()} className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                      {addingFriend ? 'Connecting...' : 'Connect'}
                    </button>
                  </form>
                </div>
              )}

              {/* Community Guidelines */}
              <div className="card" style={{ padding: "20px", background: "var(--color-surface)" }}>
                <h4 style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Guidelines</h4>
                <ul style={{ paddingLeft: 16, margin: 0, fontSize: "var(--text-xs)", color: "var(--color-neutral-600)", display: "flex", flexDirection: "column", gap: 6 }}>
                  <li>Be respectful, constructive, and supportive.</li>
                  <li>Share authentic interview and project experiences.</li>
                  <li>No spam, offensive language, or advertisements.</li>
                </ul>
              </div>
            </aside>

          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .community-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
