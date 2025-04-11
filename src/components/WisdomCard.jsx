import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

const WisdomCard = ({ post, onLike, isLiked, onGetInsight, loading }) => {
  const [showModal, setShowModal] = useState(false);
  const [insight, setInsight] = useState("");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const getInsight = async () => {
    handleShowModal();
    const insightText = await onGetInsight(post); // Pass the post object
    setInsight(insightText || "No insight available.");
  };

  return (
    <div className="card-custom text-center">
      <div className="card-body">
        <h5 className="font-lora mb-2">Random Verse</h5>
        <p className="text-muted font-lora mb-3">Explore the wisdom of Hindu scriptures.</p>
        <p className="font-devanagari fs-4 mb-2">{post.sanskrit}</p>
        <p className="font-lora mb-3">{post.translation}</p>
        <p className="text-muted font-lora mb-2">This teaches {post.explanation}.</p>
        <p className="text-muted small font-lora">Source: {post.source}</p>
        <div className="d-flex justify-content-center mt-4">
          <button onClick={getInsight} className="btn btn-custom me-3" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Get AI Insight"
            )}
          </button>
          <button
            onClick={() => onLike(post.id)}
            className="btn btn-heart"
          >
            <i
              className={`bi bi-heart${isLiked ? "-fill" : ""}`}
              style={{
                color: isLiked ? "red" : "black",
                fontSize: "1.5rem",
              }}
            ></i>
          </button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton className="bg-sky-blue text-black">
          <Modal.Title>AI Insight</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white text-black">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            insight
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default WisdomCard;