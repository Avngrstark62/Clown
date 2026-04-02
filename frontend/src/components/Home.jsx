import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchHomePosts, likePost } from '../api/api.js';
import { FaRegHeart, FaHeart, FaRegComment, FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastCreatedAt, setLastCreatedAt] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [showMoreButtons, setShowMoreButtons] = useState({});
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const hasFetchedInitial = useRef(false);
    const contentRefs = useRef([]);
    const navigate = useNavigate();

    const fetchPosts = useCallback(async (initial = false) => {
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
    }, [loading, hasMore, lastCreatedAt]);

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

    const handleFetchMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchPosts(false);
        }
    }, [loading, hasMore, fetchPosts]);

    const lastPostRef = useInfiniteScroll(handleFetchMore, { threshold: 0.3 });

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
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Home</h1>
                <p className="text-gray-600 text-lg mt-2">Your feed from people you follow</p>
            </div>

            {posts.map((post, index) => (
                <div
                    key={post._id}
                    ref={index === posts.length - 1 ? lastPostRef : null}
                    className="bg-white rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                    {/* Post Header */}
                    <div className="px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
                        <button
                            onClick={() => handleProfileClick(post.profileUsername)}
                            className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                        >
                            @{post.profileUsername}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown(index)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <FaEllipsisV size={18} className="text-gray-600" />
                            </button>
                            {dropdownVisible === index && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-emerald-100 rounded-lg shadow-lg z-10">
                                    <button
                                        onClick={() => handleSave(index)}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => handleShare(index)}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 transition-colors border-t border-emerald-100"
                                    >
                                        Share
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Post Media */}
                    {post.media && post.media.length > 0 && (
                        <div className="aspect-square w-full overflow-hidden bg-gray-100">
                            <img
                                src={post.media[0]}
                                alt="Post"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Post Content */}
                    <div className="px-6 py-4 space-y-4">
                        <p
                            className={`text-gray-800 leading-relaxed ${
                                expandedPosts[index] ? '' : 'line-clamp-3'
                            }`}
                            ref={(el) => (contentRefs.current[index] = el)}
                        >
                            {post.content}
                        </p>

                        {showMoreButtons[index] && (
                            <button
                                onClick={() => toggleExpand(index)}
                                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
                            >
                                {expandedPosts[index] ? '← Show less' : 'Show more →'}
                            </button>
                        )}

                        <div className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>

                    {/* Post Footer - Interactions */}
                    <div className="px-6 py-4 border-t border-emerald-100 flex justify-between items-center text-gray-600">
                        <div className="flex space-x-6">
                            <button
                                onClick={() => handleLike(index, post)}
                                className="flex items-center space-x-2 hover:text-emerald-600 transition-colors group"
                            >
                                {post.likedByUser ? (
                                    <FaHeart size={18} className="text-emerald-600" />
                                ) : (
                                    <FaRegHeart size={18} className="group-hover:text-emerald-600" />
                                )}
                                <span className="text-sm font-medium">{post.likesCount}</span>
                            </button>

                            <button
                                onClick={() => handleComment(post._id)}
                                className="flex items-center space-x-2 hover:text-emerald-600 transition-colors group"
                            >
                                <FaRegComment size={18} className="group-hover:text-emerald-600" />
                                <span className="text-sm font-medium">Comment</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-600 border-t-transparent"></div>
                </div>
            )}

            {/* No More Posts */}
            {!hasMore && !loading && posts.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 font-medium">No more posts</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && posts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No posts yet. Start following people to see their posts!</p>
                </div>
            )}
        </div>
    );
};

export default Home;