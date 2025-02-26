import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserData, updateUserData } from '../api/api';
import '../styles/edit-profile.css';

const EditProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    bio: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserData(user);
      setFormData({
        username: response.data.user.username,
        name: response.data.user.name,
        bio: response.data.user.bio,
      });
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserData(formData);
      navigate(`/profile/${user}`);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
          />
          <button type="submit" className="save-btn">Save</button>
          <button type="button" className="cancel-btn" onClick={() => navigate(`/profile/${user}`)}>Cancel</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;