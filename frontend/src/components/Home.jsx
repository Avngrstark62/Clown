import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchHomePosts, likePost } from '../api/api.js';
import { FaRegHeart, FaHeart, FaRegComment, FaEllipsisV } from 'react-icons/fa';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastCreatedAt, setLastCreatedAt] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [showMoreButtons, setShowMoreButtons] = useState({});
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const observer = useRef(null);
    const hasFetchedInitial = useRef(false);
    const contentRefs = useRef([]);
    const navigate = useNavigate();

    const fetchPosts = async (initial = false) => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const query = lastCreatedAt && !initial ? lastCreatedAt : null;
            const response = await fetchHomePosts(query);

            if (response?.data?.posts?.length > 0) {
                const newPosts = response.data.posts;
                setPosts((prevPosts) => (initial ? newPosts : [...prevPosts, ...newPosts]));
                setLastCreatedAt(newPosts[newPosts.length - 1]?.createdAt);
                if (newPosts.length < 20) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasFetchedInitial.current) {
            fetchPosts(true);
            hasFetchedInitial.current = true;
        }
    }, []);

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
            console.error('Error liking post:', error);
        }
    };

    const toggleExpand = (index) => {
        setExpandedPosts((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const lastPostRef = useCallback(
        (node) => {
            if (loading || !hasMore) return;

            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setTimeout(fetchPosts, 300); 
                    }
                },
                { threshold: 0.3 }
            );

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const handleComment = (postId) => {
        navigate(`/post/${postId}`);
    }

    const toggleDropdown = (index) => {
        setDropdownVisible((prev) => (prev === index ? null : index));
    };
    
    const handleSave = (index) => {
        console.log(`Post ${index} saved`);
    };

    const handleShare = (index) => {
        console.log(`Post ${index} shared`);
    };

    return (
        <div className="posts-container">
            <h1 className="home-title">Home</h1>
            {posts.map((post, index) => (
                <div
                    key={post._id}
                    ref={index === posts.length - 1 ? lastPostRef : null}
                    className="post-card"
                >
                    <div className="post-header">
                        <h3 className="post-username">{post.profileName}</h3>
                        <div className="dropdown-wrapper">
                            <button className="menu-btn" onClick={() => toggleDropdown(index)}>
                                <FaEllipsisV size={17} />
                            </button>
                            {dropdownVisible === index && (
                                <div className="dropdown-menu">
                                    <button onClick={() => handleSave(index)}>Save</button>
                                    <button onClick={() => handleShare(index)}>Share</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {post.media && post.media.length > 0 && (
                        <img 
                            src={post.media[0]} 
                            alt="Post" 
                            className="post-image"
                        />
                    )}

                    <div className="post-actions">
                        <button className="like-btn" onClick={() => handleLike(index, post)}>
                            {post.likedByUser ? <FaHeart color="red" size={22} /> : <FaRegHeart size={22} />}
                        </button>

                        <button className="comment-btn" onClick={() => handleComment(post._id)}>
                            <FaRegComment size={22} />
                        </button>
                    </div>

                    <span className="likes-count">{post.likesCount} likes</span>

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

                    <span className="post-date">
                        {new Date(post.createdAt).toLocaleString()}
                    </span>
                </div>
            ))}
            {loading && <div className="loading">Loading...</div>}
            {!hasMore && !loading && <div className="no-more-posts">No more posts</div>}
        </div>
    );
};

export default Home;