import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { createComment, deleteComment, fetchPostAndComments } from "../api/api";
import default_avatar from '../images/default-avatar.png';
import '../styles/post.css';

const Post = () => {
  const { user } = useSelector((state) => state.auth);
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const getPostAndComments = async () => {
      try {
        const response = await fetchPostAndComments(postId);
        setPost(response.data.post);
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching post and comments:", error);
      }
    };

    getPostAndComments();
  }, [postId]);

  const getPostAndComments = async () => {
    try {
      const response = await fetchPostAndComments(postId);
      setPost(response.data.post);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching post and comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const formData = { postId, content: newComment }
      await createComment(formData);
      getPostAndComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const formData = { postId, commentId}
      const response = await deleteComment(formData);
      console.log(response);
      getPostAndComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="post-container">
      <div className="post-section">
        {post && (
          <>
            <img src={post.media[0]} alt="Post" className="post-image" />
          </>
        )}
      </div>
      <div className="comments-section">
        {post && <div className="post-content">{post.content}</div>}
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <strong>{comment.profileId.username}</strong>
              <img src={comment.profileId.profilePic || default_avatar} alt="profilePic" className="commentProfilePic" />
              <p>{comment.content}</p>
              <div className="comment-actions">
                <button onClick={() => {console.log("liked a comment")}}>Like</button>
                {comment.profileId.username === user && 
                <button onClick={() => handleCommentDelete(comment._id)}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
        <div className="comment-input">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleCommentSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Post;