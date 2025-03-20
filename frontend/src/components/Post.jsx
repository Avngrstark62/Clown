import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { createComment, deleteComment, fetchPostAndComments } from "../api/api";
import default_avatar from '../images/default-avatar.png';

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
      const formData = { postId, content: newComment };
      await createComment(formData);
      setNewComment(""); // Clear the input after submission
      getPostAndComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const formData = { postId, commentId };
      const response = await deleteComment(formData);
      console.log(response);
      getPostAndComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 p-4 gap-4">
      {/* Post Section (Left Side) */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4">
        {post && (
          <>
            <div className="aspect-square w-full overflow-hidden mb-4">
              <img
                src={post.media[0]}
                alt="Post"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <p className="text-gray-700">{post.content}</p>
          </>
        )}

        {/* Comment Input (Fixed at Bottom) */}
        <div className="p-4 border-t border-gray-200">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Comments Section (Right Side) */}
      <div className="w-full md:w-1/2 flex flex-col bg-white rounded-lg shadow-md">
        {/* Comments List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-3 mb-4">
              <img
                src={comment.profileId.profilePic || default_avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <strong className="text-sm font-semibold">
                  {comment.profileId.username}
                </strong>
                <p className="text-sm text-gray-700">{comment.content}</p>
                <div className="flex space-x-2 mt-1">
                  <button
                    onClick={() => console.log("liked a comment")}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    Like
                  </button>
                  {comment.profileId.username === user && (
                    <button
                      onClick={() => handleCommentDelete(comment._id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;