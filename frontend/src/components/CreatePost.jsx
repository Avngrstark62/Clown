import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCaptions, uploadFile } from '../api/api.js';
import ImageCropper from './ImageCropper';
import getCroppedImg from '../utils/cropImage';
import '../styles/create-post.css';

const CreatePost = () => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [formData, setFormData] = useState({ content: '', mentions: '' });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  // const [tagInput, setTagInput] = useState('');
  const [generateCaptionsInput, setGenerateCaptionsInput] = useState([]);
  const [generatedCaptions, setGeneratedCaptions] = useState([]);
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
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, value);
      }
    });

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

  const uploadToCloudinary = async (file) => {
    const CLOUD_NAME = "dg90ie9ya";
    const UPLOAD_PRESET = "temp_upload";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "temp_uploads");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    return data.secure_url;
};

  const handleGenerateCaptionsFromImage = async () => {
    try {
      if (!croppedImage) return setMessage('Please crop the image before generating captions.');

      const imageURL = await uploadToCloudinary(croppedImage);
      const formData = {
        input: imageURL,
        type: "image",
      }

      const response = await generateCaptions(formData);
      setGeneratedCaptions(response.data.captions);
    } catch (error) {
      setMessage('Failed to generate captions.');
      console.error('Caption generation error:', error);
    } finally {
      setUploading(false);
    }
  }

  const handleGenerateCaptions = async () => {
    try {
      const formData = {
        input: generateCaptionsInput,
        type: "text",
      }
      const response = await generateCaptions(formData);
      setGeneratedCaptions(response.data.captions);
    } catch (error) {
      setMessage('Failed to generate captions.');
      console.error('Caption generation error:', error);
    } finally {
      setUploading(false);
    }
  }

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

            <h2>Auto-Generate Captions</h2>
            <div className="tags-container">
              <input type="text" placeholder="Give a bried description to your post to generated captions" value={generateCaptionsInput} onChange={(e) => setGenerateCaptionsInput(e.target.value)} />
              <button onClick={handleGenerateCaptions}>Generate</button>
            </div>
            <button onClick={handleGenerateCaptionsFromImage} className="generate-from-image-button">Generate from Image</button>

            <div className="generated-captions-list">
              {generateCaptions && generatedCaptions.map((caption, index) => (
                <div key={index} className="generated-caption-item">
                  {index+1}:{caption}
                </div>
              ))}
            </div>
            <button onClick={handleUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Post'}</button>
          </div>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreatePost;