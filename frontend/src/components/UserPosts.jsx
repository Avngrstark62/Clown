import { useEffect, useRef, useState } from 'react';
import { deletePost, fetchUserPosts, likePost } from '../api/api';
import { FaRegHeart, FaHeart, FaRegComment, FaEllipsisV } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserPosts = ({ username }) => {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [showMoreButtons, setShowMoreButtons] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const contentRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const response = await fetchUserPosts(username);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    getUserPosts();
  }, [username]);

  useEffect(() => {
    contentRefs.current.forEach((content, index) => {
      if (content) {
        const isOverflowing = content.scrollHeight > content.clientHeight;
        setShowMoreButtons((prev) => ({ ...prev, [index]: isOverflowing }));
      }
    });
  }, [posts]);

  const handleLike = async (index, post) => {
    try {
      const formData = { postId: post._id };
      await likePost(formData);

      setPosts((prevPosts) =>
        prevPosts.map((p, i) =>
          i === index
            ? {
                ...p,
                likedByUser: !p.likedByUser,
                likesCount: p.likesCount + (p.likedByUser ? -1 : 1),
              }
            : p
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const toggleExpand = (index) => {
    setExpandedPosts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleDropdown = (index) => {
    setDropdownVisible((prev) => (prev === index ? null : index));
  };

  const handleSave = (index) => {
    console.log(`Post ${index} saved`);
  };

  const handleDelete = async (post) => {
    const formData = { postId: post._id };
    const response = await deletePost(formData);
    alert(response.data.message);
    window.location.reload();
  };

  const handleComment = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No posts available</p>
        </div>
      ) : (
        posts.map((post, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
            {/* Post Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">@{username}</h3>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaEllipsisV size={18} className="text-gray-600" />
                </button>
                {dropdownVisible === index && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleSave(index)}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Save
                    </button>
                    {username === user && (
                      <button
                        onClick={() => handleDelete(post)}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Post Media */}
            {post.media && (
              <div className="aspect-video w-full overflow-hidden bg-gray-100">
                <img
                  src={post.media[0]}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="px-6 py-4 space-y-3">
              <p
                className={`text-gray-800 leading-relaxed ${expandedPosts[index] ? '' : 'line-clamp-3'}`}
                ref={(el) => (contentRefs.current[index] = el)}
              >
                {post.content}
              </p>

              {showMoreButtons[index] && (
                <button
                  onClick={() => toggleExpand(index)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  {expandedPosts[index] ? '← Show less' : 'Show more →'}
                </button>
              )}
            </div>

            {/* Post Footer - Interactions */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-gray-600">
              <div className="flex space-x-6">
                <button
                  onClick={() => handleLike(index, post)}
                  className="flex items-center space-x-2 hover:text-red-500 transition-colors group"
                >
                  {post.likedByUser ? (
                    <FaHeart size={18} className="text-red-500" />
                  ) : (
                    <FaRegHeart size={18} className="group-hover:text-red-500" />
                  )}
                  <span className="text-sm font-medium">{post.likesCount}</span>
                </button>

                <button
                  onClick={() => handleComment(post._id)}
                  className="flex items-center space-x-2 hover:text-blue-500 transition-colors group"
                >
                  <FaRegComment size={18} className="group-hover:text-blue-500" />
                  <span className="text-sm font-medium">Comment</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserPosts;