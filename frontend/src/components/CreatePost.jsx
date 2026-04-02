import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCaptions, uploadFile } from '../api/api.js';
import ImageCropper from './ImageCropper';
import getCroppedImg from '../utils/cropImage';

const CreatePost = () => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [formData, setFormData] = useState({ content: '', mentions: '' });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [generateCaptionsInput, setGenerateCaptionsInput] = useState('');
  const [generatedCaptions, setGeneratedCaptions] = useState([]);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false); // Loading state for caption generation
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

      setIsGeneratingCaptions(true); // Start loading
      const imageURL = await uploadToCloudinary(croppedImage);
      const formData = {
        input: imageURL,
        type: "image",
      };

      const response = await generateCaptions(formData);
      setGeneratedCaptions(response.data.captions);
    } catch (error) {
      setMessage('Failed to generate captions.');
      console.error('Caption generation error:', error);
    } finally {
      setIsGeneratingCaptions(false); // Stop loading
    }
  };

  const handleGenerateCaptions = async () => {
    try {
      setIsGeneratingCaptions(true); // Start loading
      const formData = {
        input: generateCaptionsInput,
        type: "text",
      };
      const response = await generateCaptions(formData);
      setGeneratedCaptions(response.data.captions);
    } catch (error) {
      setMessage('Failed to generate captions.');
      console.error('Caption generation error:', error);
    } finally {
      setIsGeneratingCaptions(false); // Stop loading
    }
  };

  const handleChooseCaption = (caption) => {
    setFormData({ ...formData, content: caption }); // Auto-fill the content field
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Create Post</h1>
        <p className="text-gray-600 mt-2">Share your moment with everyone</p>
      </div>

      <div className="bg-slate-50 rounded-xl shadow-sm border border-emerald-200 p-8">
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-all ${
                    step > num ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Select an Image</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer block">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-600 font-medium">Click to upload an image</p>
                <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
            {preview && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && image && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Crop Image</h2>
            <ImageCropper image={image} onCropComplete={handleCropComplete} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Post Details</h2>

            {croppedImage && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                <img
                  src={URL.createObjectURL(croppedImage)}
                  alt="Cropped"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Caption</label>
              <textarea
                name="content"
                placeholder="Write your caption here..."
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900">Auto-Generate Captions</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Describe your post..."
                  value={generateCaptionsInput}
                  onChange={(e) => setGenerateCaptionsInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleGenerateCaptions}
                  disabled={isGeneratingCaptions || !generateCaptionsInput.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  {isGeneratingCaptions ? '⏳' : '✨'}
                </button>
              </div>
              <button
                onClick={handleGenerateCaptionsFromImage}
                disabled={isGeneratingCaptions || !croppedImage}
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {isGeneratingCaptions ? 'Generating...' : 'Generate from Image'}
              </button>

              {generatedCaptions.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium text-gray-700">Suggested captions:</p>
                  {generatedCaptions.map((caption, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 border border-emerald-200 rounded-lg flex justify-between items-start gap-2 hover:bg-slate-100 transition-colors"
                    >
                      <p className="text-sm text-gray-800 flex-1">{caption}</p>
                      <button
                        onClick={() => handleChooseCaption(caption)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium whitespace-nowrap transition-colors"
                      >
                        Use
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {message && (
              <p className={`text-sm font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-emerald-50 font-medium transition-colors"
            >
              ← Previous
            </button>
          )}
          {step < 3 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !preview}
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              Next →
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleUpload}
              disabled={uploading || !croppedImage}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {uploading ? 'Uploading...' : 'Post'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { generateCaptions, uploadFile } from '../api/api.js';
// import ImageCropper from './ImageCropper';
// import getCroppedImg from '../utils/cropImage';

// const CreatePost = () => {
//   const [step, setStep] = useState(1);
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const [formData, setFormData] = useState({ content: '', mentions: '' });
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [generateCaptionsInput, setGenerateCaptionsInput] = useState('');
//   const [generatedCaptions, setGeneratedCaptions] = useState([]);
//   const navigate = useNavigate();

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file));
//       setMessage('');
//     }
//   };

//   const handleCropComplete = async (_, croppedAreaPixels) => {
//     const croppedImg = await getCroppedImg(image, croppedAreaPixels);
//     setCroppedImage(croppedImg);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleUpload = async () => {
//     if (!croppedImage) return setMessage('Please crop the image before uploading.');

//     setUploading(true);
//     setMessage('');

//     const form = new FormData();
//     form.append('image', croppedImage);
//     Object.entries(formData).forEach(([key, value]) => {
//       if (Array.isArray(value)) {
//         form.append(key, JSON.stringify(value));
//       } else {
//         form.append(key, value);
//       }
//     });

//     try {
//       const response = await uploadFile(form);
//       setMessage('Post created successfully!');
//       alert(response.data.message);
//       navigate('/');
//     } catch (error) {
//       setMessage('Failed to create post.');
//       console.error('Upload error:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const uploadToCloudinary = async (file) => {
//     const CLOUD_NAME = "dg90ie9ya";
//     const UPLOAD_PRESET = "temp_upload";

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", UPLOAD_PRESET);
//     formData.append("folder", "temp_uploads");

//     const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     return data.secure_url;
//   };

//   const handleGenerateCaptionsFromImage = async () => {
//     try {
//       if (!croppedImage) return setMessage('Please crop the image before generating captions.');

//       const imageURL = await uploadToCloudinary(croppedImage);
//       const formData = {
//         input: imageURL,
//         type: "image",
//       };

//       const response = await generateCaptions(formData);
//       setGeneratedCaptions(response.data.captions);
//     } catch (error) {
//       setMessage('Failed to generate captions.');
//       console.error('Caption generation error:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleGenerateCaptions = async () => {
//     try {
//       const formData = {
//         input: generateCaptionsInput,
//         type: "text",
//       };
//       const response = await generateCaptions(formData);
//       setGeneratedCaptions(response.data.captions);
//     } catch (error) {
//       setMessage('Failed to generate captions.');
//       console.error('Caption generation error:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-4xl mx-auto bg-slate-50 rounded-lg shadow-lg p-6">
//         <div className="flex justify-between mb-6">
//           {step > 1 && (
//             <button
//               onClick={() => setStep(step - 1)}
//               className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
//             >
//               Previous
//             </button>
//           )}
//           {step < 3 && (
//             <button
//               onClick={() => setStep(step + 1)}
//               className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
//             >
//               Next
//             </button>
//           )}
//         </div>

//         {step === 1 && (
//           <div className="space-y-4">
//             <h2 className="text-2xl font-bold">Select an Image</h2>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-blue-100"
//             />
//             {preview && (
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="w-full h-64 object-cover rounded-lg"
//               />
//             )}
//           </div>
//         )}

//         {step === 2 && image && (
//           <div className="space-y-4">
//             <h2 className="text-2xl font-bold">Crop Image</h2>
//             <ImageCropper image={image} onCropComplete={handleCropComplete} />
//           </div>
//         )}

//         {step === 3 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               {croppedImage && (
//                 <img
//                   src={URL.createObjectURL(croppedImage)}
//                   alt="Cropped Preview"
//                   className="w-full h-64 object-cover rounded-lg"
//                 />
//               )}
//             </div>
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Post Details</h2>
//               <textarea
//                 name="content"
//                 placeholder="Write your content here..."
//                 value={formData.content}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 rows={4}
//               />

//               <h2 className="text-2xl font-bold">Auto-Generate Captions</h2>
//               <div className="flex space-x-2">
//                 <input
//                   type="text"
//                   placeholder="Give a brief description to your post to generate captions"
//                   value={generateCaptionsInput}
//                   onChange={(e) => setGenerateCaptionsInput(e.target.value)}
//                   className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />
//                 <button
//                   onClick={handleGenerateCaptions}
//                   className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
//                 >
//                   Generate
//                 </button>
//               </div>
//               <button
//                 onClick={handleGenerateCaptionsFromImage}
//                 className="w-full bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
//               >
//                 Generate from Image
//               </button>

//               <div className="space-y-2">
//                 {generatedCaptions.map((caption, index) => (
//                   <div
//                     key={index}
//                     className="p-2 bg-slate-100 rounded-lg"
//                   >
//                     {index + 1}: {caption}
//                   </div>
//                 ))}
//               </div>

//               <button
//                 onClick={handleUpload}
//                 disabled={uploading}
//                 className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400"
//               >
//                 {uploading ? 'Uploading...' : 'Upload Post'}
//               </button>
//             </div>
//           </div>
//         )}

//         {message && (
//           <p className="mt-4 text-center text-sm text-emerald-600">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreatePost;
