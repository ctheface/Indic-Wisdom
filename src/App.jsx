import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import WisdomCard from "./components/WisdomCard";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LikedWisdom from "./components/LikedWisdom";

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary p-3">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand me-4">Wisdom Feed</Link>
            <Link to="/liked" className="navbar-brand">Liked Wisdom</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<WisdomFeed />} />
          <Route path="/liked" element={<LikedWisdom />} />
        </Routes>
      </div>
    </Router>
  );
}

const WisdomFeed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState(
    JSON.parse(localStorage.getItem("likedPosts") || "[]")
  );

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("wisdom_posts")
      .select("*")
      .order("created_at", { ascending: false})
      .range((page - 1) * 10, page * 10 - 1);
    if (error) console.log("Error:", error);
    else setPosts((prev) => [...prev, ...data]);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const handleLike = (postId) => {
    const updatedLikes = likedPosts.includes(postId)
      ? likedPosts.filter((id) => id !== postId)
      : [...likedPosts, postId];
    setLikedPosts(updatedLikes);
    localStorage.setItem("likedPosts", JSON.stringify(updatedLikes));
  };

  return (
    <div className="container my-4">
      <h1 className="text-center display-4 mb-4">Wisdom Feed</h1>
      {posts.map((post) => (
        <WisdomCard
          key={post.id}
          post={post}
          onLike={handleLike}
          isLiked={likedPosts.includes(post.id)}
        />
      ))}
      {loading && <p className="text-center">Loading...</p>}
    </div>
  );
};

export default App;