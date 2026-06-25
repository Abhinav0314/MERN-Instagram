"use client";

import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/apiClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImageCropperModal from '@/components/ImageCropperModal';
import { Image as ImageIcon, X } from 'lucide-react';

export default function CreatePost() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [caption, setCaption] = useState('');
  const [taggedUsernames, setTaggedUsernames] = useState('');
  const [error, setError] = useState('');
  
  // Drag and Drop & Cropping states
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [croppedImageFile, setCroppedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const fileInputRef = useRef(null);


  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    setError('');
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // reset input so the same file can be selected again if needed
    e.target.value = null;
  };

  const handleCropDone = (croppedFile, previewImageUrl) => {
    setCroppedImageFile(croppedFile);
    setPreviewUrl(previewImageUrl);
    setSelectedImageSrc(null); // Close cropper
  };

  const handleCropCancel = () => {
    setSelectedImageSrc(null); // Close cropper without saving
  };

  const uploadImageToServer = async () => {
    const formData = new FormData();
    formData.append('image', croppedImageFile);
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.imageUrl;
  };

  const createPostMutation = useMutation({
    mutationFn: async () => {
      let finalImageUrl = previewUrl;
      if (croppedImageFile) {
        finalImageUrl = await uploadImageToServer();
      }
      
      const taggedArray = taggedUsernames.split(',').map(name => name.trim()).filter(name => name);
      const { data } = await api.post('/post/', {
        caption,
        imageUrl: finalImageUrl,
        taggedUsernames: taggedArray
      });
      if (!data.success) throw new Error(data.message || 'Failed to create post');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      router.push('/feed');
    },
    onError: (err) => {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'An error occurred while creating the post.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption || !previewUrl) {
      setError('Please provide both an image and a caption.');
      return;
    }
    
    setError('');
    createPostMutation.mutate();
  };

  return (
    <div className="container py-3 py-md-5 px-0 px-md-3 d-flex justify-content-center">
      {selectedImageSrc && (
        <ImageCropperModal 
          imageSrc={selectedImageSrc}
          onCropDone={handleCropDone}
          onCropCancel={handleCropCancel}
          aspect={1} // Square for posts
        />
      )}

      <div className="w-100" style={{ maxWidth: previewUrl ? '850px' : '500px', transition: 'max-width 0.3s ease' }}>
        <div className="bg-white rounded-3 overflow-hidden shadow" style={{ border: '1px solid #dbdbdb' }}>
          <div className="d-none d-md-flex justify-content-between align-items-center border-bottom px-3 py-2 bg-white">
            <span style={{ width: '60px' }}></span>
            <span className="fw-bold m-0" style={{ fontSize: '16px' }}>Create new post</span>
            <button 
                type="button"
                className="btn btn-link text-primary fw-bold text-decoration-none p-0"
                style={{ width: '60px', textAlign: 'right' }}
                onClick={handleSubmit}
                disabled={createPostMutation.isPending || !previewUrl || !caption}
            >
                {createPostMutation.isPending ? 'Sharing' : 'Share'}
            </button>
          </div>
          
          <button id="hidden-share-btn" type="button" className="d-none" onClick={handleSubmit}>Share</button>

          {error && (
            <div className="alert alert-danger m-3 p-2 text-center" role="alert" style={{ fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div className="row g-0 m-0 w-100">
            {/* Left Column: Image Upload */}
            <div className={`col-12 ${previewUrl ? 'col-md-7' : 'col-md-12'} border-end bg-light position-relative d-flex flex-column align-items-center justify-content-center`} style={{ aspectRatio: previewUrl ? '1/1' : 'auto', minHeight: '400px', transition: 'all 0.3s ease' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange}
                />
                
                {!previewUrl ? (
                  <div 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="text-center" style={{ cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
                        <ImageIcon size={64} className="mb-3 mx-auto" style={{ color: isDragging ? '#0095f6' : '#262626' }} strokeWidth={1} />
                        <h5 className="mb-3" style={{ fontWeight: 300, color: '#262626' }}>Drag photos and videos here</h5>
                        <button type="button" className="btn btn-primary btn-sm fw-bold px-3 py-2 rounded-3">Select from device</button>
                    </div>

                    <div className="w-100 mt-4" style={{ maxWidth: '300px' }}>
                        <div className="d-flex align-items-center mb-3">
                            <hr className="flex-grow-1 m-0" />
                            <span className="mx-3 text-muted small fw-bold">OR</span>
                            <hr className="flex-grow-1 m-0" />
                        </div>
                        <input 
                            type="text" 
                            className="form-control form-control-sm text-center border shadow-none rounded-3 py-2" 
                            placeholder="Paste image URL here"
                            onChange={(e) => {
                                if (e.target.value) {
                                    setPreviewUrl(e.target.value);
                                    setCroppedImageFile(null);
                                }
                            }}
                        />
                    </div>
                  </div>
                ) : (
                  <div className="w-100 h-100 position-relative bg-dark d-flex align-items-center justify-content-center">
                    <Image 
                      src={previewUrl} 
                      alt="Preview" 
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized={!previewUrl.startsWith('data:') && !previewUrl.startsWith('blob:')}
                    />
                    <button 
                      type="button"
                      className="btn position-absolute top-0 end-0 m-2 rounded-circle shadow p-1 d-flex align-items-center justify-content-center"
                      style={{ background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none' }}
                      onClick={() => { setPreviewUrl(null); setCroppedImageFile(null); }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
            </div>

            {/* Right Column: Post Details */}
            {previewUrl && (
                <div className="col-12 col-md-5 bg-white d-flex flex-column">
                  <div className="p-3 flex-grow-1">
                    <textarea 
                      className="form-control border-0 px-0 shadow-none h-100" 
                      placeholder="Write a caption..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      style={{ resize: 'none', minHeight: '150px' }}
                    ></textarea>
                  </div>

                  <div className="px-3 pb-3">
                    <label className="form-label text-muted small fw-bold mb-1">Tag Users</label>
                    <input 
                      type="text" 
                      className="form-control border-0 border-bottom px-0 shadow-none rounded-0" 
                      placeholder="e.g. user1, user2"
                      value={taggedUsernames}
                      onChange={(e) => setTaggedUsernames(e.target.value)}
                    />
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
