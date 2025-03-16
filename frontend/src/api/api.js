import axios from 'axios';

const API = axios.create({
    baseURL: "https://clownapp.fun/api/",
    // baseURL: "http://localhost:8000",
    withCredentials: true,
});

export const register = (formData) => API.post('/api/auth/register', formData);
export const login = (formData) => API.post('/api/auth/login', formData);
export const logout = () => API.post('/api/auth/logout');
export const user = () => API.get('/api/auth/user');

export const getUserData = (username) => API.get(`/api/profile/user_data/${username}`);
export const updateUserData = (formData) => API.patch('/api/profile/user_data', formData);

export const searchUsers = (formData) => API.post('/api/search/users', formData);

export const followUser = (formData) => API.post('/api/connection/follow', formData);
export const unfollowUser = (formData) => API.post('/api/connection/unfollow', formData);
export const getFollowersList = (username) => API.get(`/api/connection/followers/${username}`);
export const getFollowingList = (username) => API.get(`/api/connection/following/${username}`);

export const uploadFile = (formData) => API.post(`/api/post/create`, formData);
export const fetchUserPosts = (username) => API.get(`/api/post/user-posts/${username}`);
export const deletePost = (formData) => API.post(`/api/post/delete`, formData);
export const likePost = (formData) => API.post(`/api/post/like`, formData);

export const fetchPostAndComments = (postId) => API.get(`/api/post/${postId}`);
export const createComment = (formData) => API.post(`/api/post/comment/create`, formData);
export const deleteComment = (formData) => API.post(`/api/post/comment/delete`, formData);

export const fetchHomePosts = (query) => API.get(`/api/home/posts`, {    params: { lastCreatedAt: query },});
