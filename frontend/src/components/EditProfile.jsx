import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserData, updateUserData } from '../api/api';
import default_avatar from '../images/default-avatar.png';

const EditProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    bio: '',
    profilePhoto: null,
    gender: '',
    dob: '',
    country: '',
    interests: [],
  });

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData(user);
        setFormData({
          username: response.data.user.username,
          name: response.data.user.name,
          bio: response.data.user.bio,
          gender: response.data.user.gender || '',
          dob: response.data.user.dob || '',
          country: response.data.user.country || '',
          interests: response.data.user.interests || [],
        });
        if (response.data.user.profilePic) {
          setPreview(response.data.user.profilePic); // Show existing photo
        }
      } catch (err) {
        setError('Failed to load user data.');
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      setPreview(URL.createObjectURL(file));
      setMessage('');
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && formData.interests.length < 10) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index) => {
    const updatedInterests = formData.interests.filter((_, i) => i !== index);
    setFormData({ ...formData, interests: updatedInterests });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');
    setError('');

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('name', formData.name);
      data.append('bio', formData.bio);
      data.append('gender', formData.gender);
      data.append('dob', formData.dob);
      data.append('country', formData.country);
      data.append('interests', JSON.stringify(formData.interests)); // Send as JSON string
      if (formData.profilePhoto) {
        data.append('image', formData.profilePhoto);
      }

      await updateUserData(data);
      setMessage('Profile updated successfully!');
      navigate(`/profile/${user}`);
    } catch (error) {
      setError('Failed to update profile.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            <img
              src={preview || default_avatar}
              alt="Profile Preview"
              className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interests</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add Interest"
                disabled={formData.interests.length >= 10}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                disabled={!newInterest.trim() || formData.interests.length >= 10}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.interests.map((interest, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(index)}
                    className="ml-2 text-red-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/profile/${user}`)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              {uploading ? 'Saving...' : 'Save'}
            </button>
          </div>

          {/* Messages */}
          {message && (
            <p className="text-green-500 text-sm text-center mt-4">{message}</p>
          )}
          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;