import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../api/api.js';
import ImageCropper from './ImageCropper';
import getCroppedImg from '../utils/cropImage';
import '../styles/create-post.css';

const CreatePost = () => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [formData, setFormData] = useState({ content: '', tags: '', mentions: '' });
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

  const handleCropComplete = async (_, croppedAreaPixels) => {
    const croppedImg = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(croppedImg);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = async () => {
    if (!croppedImage) return setMessage('Please crop the image before uploading.');

    setUploading(true);
    setMessage('');

    const form = new FormData();
    form.append('image', croppedImage);
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));

    try {
      const response = await uploadFile(form);
      setMessage('Post created successfully!');
      alert(response.data.message);
      navigate('/');
    } catch (error) {
      setMessage('Failed to create post.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="upload-container">
      <div className="navigation">
        {step > 1 && <button onClick={() => setStep(step - 1)}>Previous</button>}
        {step < 3 && <button onClick={() => setStep(step + 1)}>Next</button>}
      </div>
  
      {step === 1 && (
        <div className="step">
          <h2>Select an Image</h2>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className="preview-image" />}
        </div>
      )}
  
      {step === 2 && image && (
        <div className="step">
          <h2>Crop Image</h2>
          <ImageCropper image={image} onCropComplete={handleCropComplete} />
        </div>
      )}
  
      {step === 3 && (
        <div className="step split">
          <div className="image-container">
            {croppedImage && <img src={URL.createObjectURL(croppedImage)} alt="Cropped Preview" className="final-preview" />}
          </div>
          <div className="form-container">
            <h2>Post Details</h2>
            <textarea name="content" placeholder="Write your content here..." value={formData.content} onChange={handleInputChange} />
            <input name="tags" type="text" placeholder="Add tags (comma separated)" value={formData.tags} onChange={handleInputChange} />
            <input name="mentions" type="text" placeholder="Mention users (comma separated)" value={formData.mentions} onChange={handleInputChange} />
            <button onClick={handleUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Post'}</button>
          </div>
        </div>
      )}
  
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreatePost;