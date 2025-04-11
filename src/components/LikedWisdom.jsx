import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import WisdomCard from "./WisdomCard";

const LikedWisdom = () => {
  const [likedPosts, setLikedPosts] = useState(
    JSON.parse(localStorage.getItem("likedPosts") || "[]")
  );
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      const { data, error } = await supabase
        .from("wisdom_posts")
        .select("*")
        .in("id", likedPosts);
      if (error) console.log("Error:", error);
      else setPosts(data);
    };
    if (likedPosts.length > 0) fetchLikedPosts();
  }, [likedPosts]);

  const handleLike = (postId) => {
    const updatedLikes = likedPosts.filter((id) => id !== postId);
    setLikedPosts(updatedLikes);
    localStorage.setItem("likedPosts", JSON.stringify(updatedLikes));
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId)); // Remove from UI
  };

  return (
    <div className="container my-5">
      <h1 className="text-center display-4 mb-5 text-black">Liked Verses</h1>
      {posts.length === 0 ? (
        <p className="text-center font-lora lead">No liked verses yet!</p>
      ) : (
        posts.map((post) => (
          <WisdomCard
            key={post.id}
            post={post}
            onLike={handleLike}
            isLiked={true}
          />
        ))
      )}
    </div>
  );
};

export default LikedWisdom;