import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchHomePosts, likePost } from '../api/api.js';
import { FaRegHeart, FaHeart, FaRegComment, FaEllipsisV } from 'react-icons/fa';
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
    };

    const toggleDropdown = (index) => {
        setDropdownVisible((prev) => (prev === index ? null : index));
    };

    const handleSave = (index) => {
        console.log(`Post ${index} saved`);
    };

    const handleShare = (index) => {
        console.log(`Post ${index} shared`);
    };

    const handleProfileClick = (username) => {
        navigate(`/profile/${username}`);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 pt-16">
            <h1 className="text-2xl font-bold mb-6">Home</h1>
            {posts.map((post, index) => (
                <div
                    key={post._id}
                    ref={index === posts.length - 1 ? lastPostRef : null}
                    className="bg-white rounded-lg shadow-md mb-6 p-4"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3
                          className="text-lg font-semibold text-blue-500 cursor-pointer hover:underline"
                          onClick={()=>{handleProfileClick(post.profileUsername)}}
                        >
                          {post.profileUsername}
                        </h3>

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
                                    <button
                                        onClick={() => handleShare(index)}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Share
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {post.media && post.media.length > 0 && (
                        <div className="aspect-square w-full overflow-hidden mb-4">
                            <img
                                src={post.media[0]}
                                alt="Post"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    )}

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

                    <span className="text-sm font-semibold mb-2">
                        {post.likesCount} likes
                    </span>

                    <p
                        className={`text-gray-700 mb-2 ${
                            expandedPosts[index] ? '' : 'line-clamp-3'
                        }`}
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

                    <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                    </span>
                </div>
            ))}
            {loading && (
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            )}
            {!hasMore && !loading && (
                <div className="text-center text-gray-500 py-4">No more posts</div>
            )}
        </div>
    );
};

export default Home;