import { useState } from 'react';
import Cropper from 'react-easy-crop';
import '../styles/image-cropper.css';

const ImageCropper = ({ image, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className="cropper-container">
      <Cropper
        image={URL.createObjectURL(image)}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
    </div>
  );
};

export default ImageCropper;