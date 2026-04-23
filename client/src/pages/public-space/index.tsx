import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { auth, storage } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import PostCard from '../../component/PostCard';
import { ImagePlus, Video, AlertCircle } from 'lucide-react';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync user with our DB to get friends and limits
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
      fetchPosts();
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/public-space/posts`);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchDbUser = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.uid}`);
      setDbUser(res.data);
    } catch (error) {
      console.error("Error fetching db user", error);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !dbUser) return alert("Please login first.");
    if (!content.trim() && !file) return alert("Please add content or a file.");

    setUploading(true);
    try {
      let mediaUrl = "";
      let mediaType = "none";

      if (file) {
        const fileRef = ref(storage, `public_space/${Date.now()}_${file.name}`);
        const uploadTask = await uploadBytesResumable(fileRef, file);
        mediaUrl = await getDownloadURL(uploadTask.ref);
        mediaType = file.type.startsWith("video") ? "video" : "image";
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/public-space/posts`, {
        authorUid: user.uid,
        content,
        mediaUrl,
        mediaType
      });

      setContent("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Refresh posts and user limits
      fetchPosts();
      fetchDbUser();
    } catch (error: any) {
      console.error("Error creating post", error);
      alert(error.response?.data?.error || "Error creating post");
    } finally {
      setUploading(false);
    }
  };

  // Calculate limits display
  const friendCount = dbUser?.friends?.length || 0;
  let dailyLimit: string | number = 0;
  if (friendCount === 0) dailyLimit = 0;
  else if (friendCount === 1) dailyLimit = 1;
  else if (friendCount >= 2 && friendCount <= 10) dailyLimit = 2;
  else if (friendCount > 10) dailyLimit = "Unlimited";

  const remaining = typeof dailyLimit === 'number' 
    ? dailyLimit - (dbUser?.postCountToday || 0) 
    : "Unlimited";

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading Public Space...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Public Space 🌍</h1>
        <p className="text-lg text-gray-600">Connect, share, and engage with the community.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar: User Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Profile</h2>
            {!user ? (
              <div className="text-gray-500">Please login to see your stats and create posts.</div>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{user.displayName}</h3>
                    <p className="text-sm text-gray-500">{friendCount} Friends</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Posting Limits</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>0 Friends = 0 Posts</li>
                    <li>1 Friend = 1 Post/day</li>
                    <li>2-10 Friends = 2 Posts/day</li>
                    <li>10+ Friends = Unlimited</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600 font-medium">Daily Limit:</span>
                    <span className="font-bold text-gray-900">{dailyLimit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Remaining Today:</span>
                    <span className={`font-bold ${remaining === 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {remaining}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content: Create Post & Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post Form */}
          {user && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create a Post</h3>
              {remaining === 0 && remaining !== "Unlimited" ? (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                  <AlertCircle size={20} />
                  <span>You've reached your daily posting limit. Add more friends to post more!</span>
                </div>
              ) : (
                <form onSubmit={handlePostSubmit}>
                  <textarea
                    placeholder="What's on your mind?"
                    className="w-full border rounded-lg p-4 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                  
                  {file && (
                    <div className="mb-4 text-sm text-green-600 font-medium bg-green-50 p-2 rounded">
                      Attached: {file.name}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer text-gray-500 hover:text-blue-600 flex items-center gap-2 transition">
                        <ImagePlus size={22} />
                        <span className="hidden sm:inline text-sm">Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          ref={fileInputRef}
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      <label className="cursor-pointer text-gray-500 hover:text-blue-600 flex items-center gap-2 transition">
                        <Video size={22} />
                        <span className="hidden sm:inline text-sm">Video</span>
                        <input 
                          type="file" 
                          accept="video/*" 
                          className="hidden" 
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                    <button 
                      type="submit" 
                      disabled={uploading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {uploading ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Posts Feed */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Posts</h3>
            {posts.length === 0 ? (
              <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-md">
                No posts yet. Be the first to share something!
              </div>
            ) : (
              posts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  currentUid={user?.uid} 
                  onUpdate={fetchPosts} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
