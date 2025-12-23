import { useState, useEffect } from "react";
import WisdomCard from "./components/WisdomCard";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LikedWisdom from "./components/LikedWisdom";
import About from "./pages/About"; // Import the About page
import { supabase } from "./supabase";

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
  const [allPosts, setAllPosts] = useState([]); // Store all posts
  const [displayedCount, setDisplayedCount] = useState(10); // Number of posts to display
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInsight, setLoadingInsight] = useState(null); // Track which card is loading insight
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

  // Load all posts once on mount, then paginate display
  const loadPosts = async () => {
    if (allPosts.length > 0) return; // Already loaded
    
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://indic-wisdom-backend.onrender.com';
      const response = await fetch(`${apiUrl}/api/posts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const shuffledData = shuffleArray(data);
      setAllPosts(shuffledData);
      setPosts(shuffledData.slice(0, displayedCount));
      setHasMore(shuffledData.length > displayedCount);
    } catch (error) {
      console.error("Error loading posts:", error);
      // Fallback: try direct Supabase if API fails
      try {
        const { data, error: supabaseError } = await supabase
          .from("wisdom_posts")
          .select("*")
          .order("created_at", { ascending: false });
        if (!supabaseError && data) {
          const shuffledData = shuffleArray(data);
          setAllPosts(shuffledData);
          setPosts(shuffledData.slice(0, displayedCount));
          setHasMore(shuffledData.length > displayedCount);
        } else {
          console.error("Supabase error:", supabaseError);
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Handle infinite scroll - load more posts
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading &&
        hasMore &&
        allPosts.length > 0
      ) {
        const nextCount = displayedCount + 10;
        setDisplayedCount(nextCount);
        setPosts(allPosts.slice(0, nextCount));
        setHasMore(nextCount < allPosts.length);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, displayedCount, allPosts]);

  const handleLike = (postId) => {
    const updatedLikes = likedPosts.includes(postId)
      ? likedPosts.filter((id) => id !== postId)
      : [...likedPosts, postId];
    setLikedPosts(updatedLikes);
    localStorage.setItem("likedPosts", JSON.stringify(updatedLikes));
  };

  const handleGetInsight = async (post) => {
    setLoadingInsight(post.id); // Set loading for this specific card
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://indic-wisdom-backend.onrender.com';
      const endpoint = `${apiUrl}/api/insight`;
      
      console.log("Fetching insight from:", endpoint);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
        console.error("API Error Response:", errorData);
        throw new Error(`HTTP error! status: ${response.status}. ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        console.error("API Error:", data.error);
        return `Error: ${data.error}. Please try again later.`;
      } else {
        console.log("Unexpected API Response format:", data);
        return "No insight generated. Please try again later.";
      }
    } catch (error) {
      console.error("Error fetching insight:", error);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://indic-wisdom-backend.onrender.com';
      return `Failed to get insight: ${error.message}. Backend URL: ${apiUrl}/api/insight. Please check your network or API configuration.`;
    } finally {
      setLoadingInsight(null); // Clear loading state
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center display-3 mb-5 text-black">ॐ Indic Verses ॐ</h1>
      {posts.map((post) => (
        <WisdomCard
          key={post.id}
          post={post}
          onLike={handleLike}
          isLiked={likedPosts.includes(post.id)}
          onGetInsight={handleGetInsight}
          loading={loadingInsight === post.id}
        />
      ))}
      {loading && posts.length === 0 && (
        <p className="text-center font-lora lead">Loading wisdom...</p>
      )}
      {!hasMore && posts.length > 0 && (
        <p className="text-center font-lora lead text-muted">You've seen all the wisdom!</p>
      )}
    </div>
  );
};

export default App;