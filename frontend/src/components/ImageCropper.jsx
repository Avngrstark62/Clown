import { useState } from 'react';
import Cropper from 'react-easy-crop';

const ImageCropper = ({ image, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <Cropper
        image={URL.createObjectURL(image)}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        classes={{ containerClassName: 'relative w-full h-full', mediaClassName: 'object-cover' }}
      />
    </div>
  );
};

export default ImageCropper;