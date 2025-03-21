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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between mb-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Previous
            </button>
          )}
          {step < 3 && (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Next
            </button>
          )}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Select an Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>
        )}

        {step === 2 && image && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Crop Image</h2>
            <ImageCropper image={image} onCropComplete={handleCropComplete} />
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {croppedImage && (
                <img
                  src={URL.createObjectURL(croppedImage)}
                  alt="Cropped Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Post Details</h2>
              <textarea
                name="content"
                placeholder="Write your content here..."
                value={formData.content}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />

              <h2 className="text-2xl font-bold">Auto-Generate Captions</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Give a brief description to your post to generate captions"
                  value={generateCaptionsInput}
                  onChange={(e) => setGenerateCaptionsInput(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleGenerateCaptions}
                  disabled={isGeneratingCaptions}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
                >
                  {isGeneratingCaptions ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </div>
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
              <button
                onClick={handleGenerateCaptionsFromImage}
                disabled={isGeneratingCaptions}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
              >
                {isGeneratingCaptions ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </div>
                ) : (
                  'Generate from Image'
                )}
              </button>

              <div className="space-y-2">
                {generatedCaptions.map((caption, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-100 rounded-lg flex justify-between items-center"
                  >
                    <span>
                      {index + 1}: {caption}
                    </span>
                    <button
                      onClick={() => handleChooseCaption(caption)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                    >
                      Choose
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400"
              >
                {uploading ? 'Uploading...' : 'Upload Post'}
              </button>
            </div>
          </div>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
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
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
//         <div className="flex justify-between mb-6">
//           {step > 1 && (
//             <button
//               onClick={() => setStep(step - 1)}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//             >
//               Previous
//             </button>
//           )}
//           {step < 3 && (
//             <button
//               onClick={() => setStep(step + 1)}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
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
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
//                 className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows={4}
//               />

//               <h2 className="text-2xl font-bold">Auto-Generate Captions</h2>
//               <div className="flex space-x-2">
//                 <input
//                   type="text"
//                   placeholder="Give a brief description to your post to generate captions"
//                   value={generateCaptionsInput}
//                   onChange={(e) => setGenerateCaptionsInput(e.target.value)}
//                   className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   onClick={handleGenerateCaptions}
//                   className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//                 >
//                   Generate
//                 </button>
//               </div>
//               <button
//                 onClick={handleGenerateCaptionsFromImage}
//                 className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//               >
//                 Generate from Image
//               </button>

//               <div className="space-y-2">
//                 {generatedCaptions.map((caption, index) => (
//                   <div
//                     key={index}
//                     className="p-2 bg-gray-100 rounded-lg"
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
//           <p className="mt-4 text-center text-sm text-red-500">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreatePost;