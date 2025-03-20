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
      {!posts || posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available</p>
      ) : (
        posts.map((post, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{username}</h3>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaEllipsisV size={17} />
                </button>
                {dropdownVisible === index && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleSave(index)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Save
                    </button>
                    {username === user && (
                      <button
                        onClick={() => handleDelete(post)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="aspect-square w-full overflow-hidden mb-4">
              <img
                src={post.media[0]}
                alt="Post"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => handleLike(index, post)}
                className="flex items-center space-x-2"
              >
                {post.likedByUser ? (
                  <FaHeart color="red" size={22} />
                ) : (
                  <FaRegHeart size={22} />
                )}
              </button>

              <button
                onClick={() => handleComment(post._id)}
                className="flex items-center space-x-2"
              >
                <FaRegComment size={22} />
              </button>
            </div>

            <span className="text-sm font-semibold">{post.likesCount} likes</span>

            <p
              className={`text-gray-700 mt-2 ${expandedPosts[index] ? '' : 'line-clamp-3'}`}
              ref={(el) => (contentRefs.current[index] = el)}
            >
              {post.content}
            </p>

            {showMoreButtons[index] && (
              <button
                onClick={() => toggleExpand(index)}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                {expandedPosts[index] ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserPosts;