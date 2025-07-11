import { useState, useEffect } from "react";
import WisdomCard from "./components/WisdomCard";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LikedWisdom from "./components/LikedWisdom";
import About from "./pages/About"; // Import the About page

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-sky-blue"> {/* Blue texture background */}
        <nav className="navbar navbar-expand-lg bg-black p-3"> {/* Black texture background */}
          <div className="container-fluid">
            <Link to="/" className="navbar-brand text-sky-blue">
              Indic Verses
            </Link>
            <div className="mx-auto text-light text-center">
              <p className="mb-0 small">
                "The Bhagavad Gita is the most systematic statement of spiritual
                evolution ever produced." -{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Aldous_Huxley"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-blue"
                >
                  Aldous Huxley
                </a>
              </p>
            </div>
            <Link to="/liked" className="navbar-brand text-sky-blue">
              Liked Verses
            </Link>
            <Link to="/about" className="navbar-brand text-sky-blue">
              About
            </Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<WisdomFeed />} />
          <Route path="/liked" element={<LikedWisdom />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <footer className="bg-black text-center text-light py-3">
          Indic Wisdom. Built with ❤️
        </footer>
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

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`);
      const data = await response.json();
      const shuffledData = shuffleArray(data); // Shuffle the posts
      setPosts((prev) => [...prev, ...shuffledData]);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(); // Load and shuffle posts on page load
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        !loading
      ) {
        const shuffledPosts = shuffleArray(posts); // Shuffle the posts again
        setPosts((prev) => [...prev, ...shuffledPosts]); // Append shuffled posts
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, posts]);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/insight`, {
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
      <h1 className="text-center display-3 mb-5 text-black">ॐ Indic Verses ॐ</h1>
      {posts.map((post, index) => (
        <WisdomCard
          key={`${post.id}-${index}`} // Combine post.id and index for uniqueness
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