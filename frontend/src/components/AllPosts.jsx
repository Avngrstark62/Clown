import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/api';
import '../styles/create-post.css';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [mentions, setMentions] = useState('');
  const navigate = useNavigate();

  const handleMediaUpload = () => {
    console.log('media uploaded');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formData = { content, media: [], tags: tags.split(','), mentions: mentions.split(',') };
    const formData = { content, media: [], tags: [], mentions: [] };
    try {
      await createPost(formData);
      navigate(`/`);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          className="post-input"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Add tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Mention users (comma separated)"
          value={mentions}
          onChange={(e) => setMentions(e.target.value)}
        />
        <button type="button" className="upload-btn" onClick={handleMediaUpload}>Upload Media</button>
        <button type="submit" className="submit-btn">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;