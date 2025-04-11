import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import WisdomCard from "./components/WisdomCard";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LikedWisdom from "./components/LikedWisdom";

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-sky-blue">
        <nav className="navbar navbar-expand-lg bg-black p-3">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand text-sky-blue">Indic Verses</Link>
            <Link to="/liked" className="navbar-brand text-sky-blue">Liked Wisdom</Link>
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
    try {
      const response = await fetch("http://localhost:5000/api/posts");
      const data = await response.json();
      setPosts((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
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

  const handleGetInsight = async (post) => {
    try {
      setLoading(true); // Start loading
      const response = await fetch("http://localhost:5000/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post }),
      });

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.log("API Response:", data); // Debug response
        return "No insight generated. Please try again later.";
      }
    } catch (error) {
      console.error("Error fetching insight:", error);
      return "Failed to get insight. Please check your network or API key.";
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center display-3 mb-5 text-black">Indic Verses</h1>
      {posts.map((post) => (
        <WisdomCard
          key={post.id}
          post={post}
          onLike={handleLike}
          isLiked={likedPosts.includes(post.id)}
          onGetInsight={handleGetInsight}
          loading={loading}
        />
      ))}
      {loading && <p className="text-center font-lora lead">Loading...</p>}
    </div>
  );
};

export default App;