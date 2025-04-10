import { useState } from "react";

const WisdomCard = ({ post, onLike, isLiked }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card p-3 mb-3 shadow-sm" style={{ maxWidth: "30rem", margin: "auto" }}>
      <div className="card-body">
        <p className="font-devanagari fs-5">{post.sanskrit}</p>
        <p className="text-muted fst-italic">{post.translation}</p>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-link text-primary mt-2"
        >
          {isOpen ? "Hide" : "Show"} Explanation
        </button>
        {isOpen && <p className="mt-2 text-secondary">{post.explanation}</p>}
        <p className="text-muted small mt-1">Source: {post.source}</p>
        <button
          onClick={() => onLike(post.id)}
          className={`mt-2 ${isLiked ? "btn btn-danger" : "btn btn-outline-secondary"}`}
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
      </div>
    </div>
  );
};

export default WisdomCard;