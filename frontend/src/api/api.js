import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

export const register = (formData) => API.post('/api/auth/register', formData);
export const login = (formData) => API.post('/api/auth/login', formData);
export const logout = () => API.post('/api/auth/logout');
export const user = () => API.get('/api/auth/user');

export const getUserData = (username) => API.get(`/api/profile/user_data/${username}`);
export const updateUserData = (formData) => API.patch('/api/profile/user_data', formData);

export const searchUsers = (formData) => API.post('/api/search/users', formData);