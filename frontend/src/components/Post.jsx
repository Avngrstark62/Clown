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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Post Section */}
      <div className="bg-slate-50 rounded-xl shadow-sm border border-emerald-200 overflow-hidden">
        {post && (
          <>
            {/* Post Media */}
            <div className="aspect-square w-full overflow-hidden bg-slate-100">
              <img
                src={post.media[0]}
                alt="Post"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Content */}
            <div className="px-6 py-6">
              <p className="text-gray-800 text-lg leading-relaxed">{post.content}</p>
            </div>
          </>
        )}
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Comments</h2>

        {/* Comment Input */}
        <div className="bg-slate-50 rounded-xl shadow-sm border border-emerald-200 p-6 space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            onClick={handleCommentSubmit}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Post Comment
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => {
              if (!comment.profileId) return null;
              return (
                <div key={comment._id} className="bg-slate-50 rounded-lg border border-emerald-200 p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.profileId.profilePic || default_avatar}
                      alt="Profile"
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-sm font-semibold text-gray-900">
                          @{comment.profileId.username}
                        </strong>
                      </div>
                      <p className="text-gray-800 mt-1 text-sm">{comment.content}</p>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => console.log("liked a comment")}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                        >
                          ♥ Like
                        </button>
                        {comment.profileId.username === user && (
                          <button
                            onClick={() => handleCommentDelete(comment._id)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;