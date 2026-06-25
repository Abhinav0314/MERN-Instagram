import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg, { urlToFile } from '../utils/cropImage';

const ImageCropperModal = ({ imageSrc, onCropDone, onCropCancel, cropShape = "rect", aspect = 1 }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            setIsProcessing(true);
            const croppedImageBlobUrl = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );
            
            const file = await urlToFile(croppedImageBlobUrl, 'cropped_image.jpg', 'image/jpeg');
            onCropDone(file, croppedImageBlobUrl);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 rounded-4 shadow bg-dark text-white">
                    <div className="modal-header border-bottom-0 pb-0">
                        <h5 className="modal-title fw-bold">Crop Image</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onCropCancel} disabled={isProcessing}></button>
                    </div>
                    <div className="modal-body p-0 position-relative" style={{ height: '500px', backgroundColor: '#333' }}>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            cropShape={cropShape}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="modal-footer border-top-0 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center flex-grow-1 me-4">
                            <span className="me-3"><i className="bi bi-zoom-out"></i></span>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => {
                                    setZoom(e.target.value)
                                }}
                                className="form-range"
                            />
                            <span className="ms-3"><i className="bi bi-zoom-in"></i></span>
                        </div>
                        <button className="btn btn-primary fw-bold px-4 rounded-pill" onClick={handleSave} disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : 'Done'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
