import { useEffect, useState } from 'react';
import { fetchUserPosts } from '../api/api';
import '../styles/user-posts.css';

const UserPosts = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});

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

  const toggleLike = (index) => {
    setLikedPosts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleExpand = (index) => {
    setExpandedPosts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="posts-container">
      <h2>User Posts</h2>
      {!posts || posts.length ===0 ? (
        <p className="no-posts">No posts available</p>
      ) : (
        posts.map((post, index) => (
          <div key={index} className="post-card">
            <h3 className="post-username">{username}</h3>
            <img src={post.media[0]} alt="Post" className="post-image" />

            <div className="post-actions">
              <button
                className={`like-btn ${likedPosts[index] ? 'liked' : ''}`}
                onClick={() => toggleLike(index)}
              >
                ❤️ Like
              </button>
              <button className="comment-btn" onClick={() => console.log('open comments')}>
                💬 Comment
              </button>
            </div>

            <p className="post-content">
              {expandedPosts[index]
                ? post.content
                : post.content.split('\n').slice(0, 2).join('\n')}
            </p>

            {post.content.split('\n').length > 2 && (
              <button className="more-btn" onClick={() => toggleExpand(index)}>
                {expandedPosts[index] ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserPosts;

// // UserPosts.jsx
// import { useEffect, useState } from 'react';
// import { fetchUserPosts } from '../api/api';
// import '../styles/user-posts.css';

// const UserPosts = ({ username }) => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const getUserPosts = async () => {
//       try {
//         // Placeholder function to simulate API call
//         const response = await fetchUserPosts(username);
//         setPosts(response.data.posts);
//         // console.log('fetchUserPosts')
//       } catch (error) {
//         console.error('Error fetching user posts:', error);
//       }
//     };

//     getUserPosts();
//   }, [username]);

//   return (
//     <div className="posts-container">
//       <h2>User Posts</h2>
//       {posts.length === 0 ? (
//         <p className="no-posts">No posts available</p>
//       ) : (
//         posts.map((post, index) => (
//           <div key={index} className="post-card">
//             <h3 className="post-title">{post.title}</h3>
//             <p className="post-content">{post.content}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default UserPosts;