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
        if (response.data.user.profilePhoto) {
          setPreview(response.data.user.profilePhoto); // Show existing photo
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
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h1>Edit Profile</h1>

        <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
        {preview && <img src={preview} alt="Profile Preview" className="preview-image" />}

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

          {/* Gender Select Box */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Date of Birth Input */}
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />

          {/* Country Select Box */}
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
            <option value="UK">UK</option>
            <option value="Canada">Canada</option>
            {/* Add more countries as needed */}
          </select>

          {/* Interests Input */}
          <div className="interests-container">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add Interest"
              disabled={formData.interests.length >= 10}
            />
            <button
              type="button"
              onClick={handleAddInterest}
              disabled={!newInterest.trim() || formData.interests.length >= 10}
            >
              Add
            </button>
          </div>

          {/* Display Added Interests */}
          <div className="interests-list">
            {formData.interests.map((interest, index) => (
              <div key={index} className="interest-item">
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="save-btn" disabled={uploading}>
            {uploading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate(`/profile/${user}`)}>
            Cancel
          </button>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { getUserData, updateUserData } from '../api/api';
// import '../styles/edit-profile.css';

// const EditProfile = () => {
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: '',
//     name: '',
//     bio: '',
//     profilePhoto: null,
//   });

//   const [preview, setPreview] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await getUserData(user);
//         setFormData({
//           username: response.data.user.username,
//           name: response.data.user.name,
//           bio: response.data.user.bio,
//         });
//         if (response.data.user.profilePhoto) {
//           setPreview(response.data.user.profilePhoto); // Show existing photo
//         }
//       } catch (err) {
//         setError('Failed to load user data.');
//       }
//     };

//     fetchUserData();
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, profilePhoto: file });
//       setPreview(URL.createObjectURL(file));
//       setMessage('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUploading(true);
//     setMessage('');
//     setError('');

//     try {
//       const data = new FormData();
//       data.append('username', formData.username);
//       data.append('name', formData.name);
//       data.append('bio', formData.bio);
//       if (formData.profilePhoto) {
//         data.append('image', formData.profilePhoto);
//       }

//       await updateUserData(data);
//       setMessage('Profile updated successfully!');
//       navigate(`/profile/${user}`);
//     } catch (error) {
//       setError('Failed to update profile.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="edit-profile-container">
//       <div className="edit-profile-card">
//         <h1>Edit Profile</h1>

//         <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
//         {preview && <img src={preview} alt="Profile Preview" className="preview-image" />}

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             placeholder="Username"
//           />
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Name"
//           />
//           <textarea
//             name="bio"
//             value={formData.bio}
//             onChange={handleChange}
//             placeholder="Bio"
//           />

//           <button type="submit" className="save-btn" disabled={uploading}>
//             {uploading ? 'Saving...' : 'Save'}
//           </button>
//           <button type="button" className="cancel-btn" onClick={() => navigate(`/profile/${user}`)}>
//             Cancel
//           </button>

//           {message && <p className="success-message">{message}</p>}
//           {error && <p className="error-message">{error}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;