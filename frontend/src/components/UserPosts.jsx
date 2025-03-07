import { useEffect, useRef, useState } from 'react';
import { deletePost, fetchUserPosts } from '../api/api';
import { FaRegHeart, FaHeart, FaRegComment, FaEllipsisV } from 'react-icons/fa';
import '../styles/user-posts.css';
import { useSelector } from 'react-redux';

const UserPosts = ({ username }) => {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [showMoreButtons, setShowMoreButtons] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const contentRefs = useRef([]);

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

  const toggleLike = (index) => {
    setLikedPosts((prev) => ({ ...prev, [index]: !prev[index] }));
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

  return (
    <div className="posts-container">
      {!posts || posts.length === 0 ? (
        <p className="no-posts">No posts available</p>
      ) : (
        posts.map((post, index) => (
          <div key={index} className="post-card">
            <div className="post-header">
              <h3 className="post-username">{username}</h3>
              <div className="dropdown-wrapper">
                <button className="menu-btn" onClick={() => toggleDropdown(index)}>
                  <FaEllipsisV size={17} />
                </button>
                {dropdownVisible === index && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleSave(index)}>Save</button>
                    {username === user && <button onClick={() => handleDelete(post)}>Delete</button>}
                  </div>
                )}
              </div>
            </div>

            <img src={post.media[0]} alt="Post" className="post-image" />

            <div className="post-actions">
              <button className="like-btn" onClick={() => toggleLike(index)}>
                {likedPosts[index] ? <FaHeart color="red" size={22} /> : <FaRegHeart size={22} />}
              </button>

              <button className="comment-btn" onClick={() => console.log('open comments')}>
                <FaRegComment size={22} />
              </button>
            </div>

            <p
              className={`post-content ${expandedPosts[index] ? 'expanded' : ''}`}
              ref={(el) => (contentRefs.current[index] = el)}
            >
              {post.content}
            </p>

            {showMoreButtons[index] && (
              <button className="more-btn" onClick={() => toggleExpand(index)}>
                {expandedPosts[index] ? 'less' : 'more'}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserPosts;