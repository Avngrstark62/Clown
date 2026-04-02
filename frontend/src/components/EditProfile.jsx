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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-2">Update your profile information</p>
      </div>

      <div className="bg-slate-50 rounded-xl shadow-sm border border-emerald-200 p-8">
        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-40 h-40 mb-4">
            <img
              src={preview || default_avatar}
              alt="Profile Preview"
              className="w-full h-full rounded-full object-cover border-4 border-emerald-200 shadow-lg"
            />
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-2 right-2 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" />
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
          <p className="text-sm text-gray-600 mt-2">Click the camera icon to change photo</p>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Interests</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest..."
                disabled={formData.interests.length >= 10}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                disabled={!newInterest.trim() || formData.interests.length >= 10}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full text-sm font-medium text-emerald-700 border border-emerald-200"
                >
                  <span>#{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(index)}
                    className="text-emerald-600 hover:text-emerald-800 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {formData.interests.length >= 10 && (
              <p className="text-xs text-gray-500 mt-2">Maximum 10 interests reached</p>
            )}
          </div>

          {/* Messages */}
          {message && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium">
              {message}
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 font-medium">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/profile/${user}`)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-900 bg-white rounded-lg hover:bg-emerald-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {uploading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;