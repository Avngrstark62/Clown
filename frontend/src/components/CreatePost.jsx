import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../api/api.js';
import '../styles/create-post.css';

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState("");
  const [mentions, setMentions] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage('Please select an image.');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('content', content);
    formData.append('tags', tags);
    formData.append('mentions', mentions);

    try {
      const response = await uploadFile(formData);

      setMessage('Post created successfully!');
      console.log('Upload response:', response.data);
    } catch (error) {
      setMessage('Failed to create post.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      navigate('/');
    }
  };

  return (
    <div className="upload-container">
      <h2>Create a Post</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && <img src={preview} alt="Preview" className="preview-image" />}

      <textarea
        placeholder="Write your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="content-input"
      />

      {/* <input
        type="text"
        placeholder="Add tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="tag-input"
      /> */}

      {/* <input
        type="text"
        placeholder="Mention users (comma separated)"
        value={mentions}
        onChange={(e) => setMentions(e.target.value)}
        className="mention-input"
      /> */}

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Post'}
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreatePost;