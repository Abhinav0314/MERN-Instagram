"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/utils/apiClient';
import ImageCropperModal from '@/components/ImageCropperModal';

export default function EditProfile() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        bio: '',
        profilePicture: ''
    });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [prevUser, setPrevUser] = useState(null);

    // Image upload and crop states
    const [selectedImageSrc, setSelectedImageSrc] = useState(null);
    const [croppedImageFile, setCroppedImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const { data: user, isLoading: userLoading, isError: userError } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const { data } = await api.get('/user/me');
            return data.user;
        },
        retry: false
    });

    // Update form data securely when user is loaded, using derived state
    if (user && user !== prevUser) {
        setPrevUser(user);
        setFormData({
            name: user.name || '',
            username: user.username || '',
            email: user.email || '',
            bio: user.bio || '',
            profilePicture: user.profilePicture || ''
        });
    }

    useEffect(() => {
        if (!userLoading && (userError || (!user && prevUser === null))) {
            // Give a chance for derived state or data to settle, but route if explicit error
            // Actually router.push is safer here if definitely not found
            // Let's refine it:
            if (userError || !user) {
               router.push('/login');
            }
        }
    }, [user, userLoading, userError, prevUser, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setError('');
        setSuccessMsg('');
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    setSelectedImageSrc(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setError('Please select a valid image file.');
            }
        }
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
        const uploadData = new FormData();
        uploadData.append('image', croppedImageFile);
        const { data } = await api.post('/upload', uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data.imageUrl;
    };

    const editProfileMutation = useMutation({
        mutationFn: async () => {
            let finalImageUrl = formData.profilePicture;
            
            // If user cropped a new image, upload it first
            if (croppedImageFile) {
                finalImageUrl = await uploadImageToServer();
            }

            const updatedFormData = { ...formData, profilePicture: finalImageUrl };

            const { data } = await api.put('/user/profile', updatedFormData);
            if (!data.success) throw new Error(data.message || 'Failed to update profile');
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            queryClient.invalidateQueries();
            setSuccessMsg('Profile updated successfully!');
            setTimeout(() => {
                router.push('/profile');
            }, 1000);
        },
        onError: (err) => {
            setError(err.response?.data?.message || err.message || 'Failed to update profile');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        editProfileMutation.mutate();
    };

    if (!user) return null;

    const currentDisplayAvatar = previewUrl || formData.profilePicture || `https://ui-avatars.com/api/?name=${formData.name || formData.username || 'U'}&background=random&size=200`;

    return (
        <div className="container py-0 py-md-3 px-0 px-md-3">
            {selectedImageSrc && (
                <ImageCropperModal 
                    imageSrc={selectedImageSrc}
                    onCropDone={handleCropDone}
                    onCropCancel={handleCropCancel}
                    aspect={1}
                    cropShape="round" // Circular cropper for profile
                />
            )}

            <div className="row justify-content-center mx-0">
                <div className="col-12 col-md-10 col-lg-8 px-0 px-md-3">
                    <div className="glass-card pt-1 pb-3 px-3 p-md-4 pt-md-4 mobile-edge-to-edge border-0 border-md">
                        
                        <div className="d-none d-md-flex align-items-center mb-4 border-bottom pb-3">
                            <button 
                                className="btn btn-light rounded-circle p-2 me-3 shadow-sm d-flex align-items-center justify-content-center"
                                style={{ width: '40px', height: '40px' }}
                                onClick={() => router.push('/profile')}
                            >
                                <i className="bi bi-arrow-left fs-5"></i>
                            </button>
                            <h2 className="mb-0 fw-bold">Edit Profile</h2>
                        </div>
                        
                        {/* Mobile Back Button (smaller, cleaner, moved up) */}
                        <div className="d-flex d-md-none align-items-center mb-0 mt-1">
                            <button 
                                className="btn btn-link text-dark p-0 me-2"
                                onClick={() => router.push('/profile')}
                            >
                                <i className="bi bi-arrow-left fs-3"></i>
                            </button>
                        </div>
                        
                        {error && <div className="alert alert-danger mt-2" role="alert">{error}</div>}
                        {successMsg && <div className="alert alert-success mt-2" role="alert">{successMsg}</div>}

                        <div className="mx-auto" style={{ maxWidth: '600px' }}>
                            {/* Profile Picture Section */}
                            <div className="bg-light p-3 p-md-4 rounded-4 mb-4 d-flex align-items-center shadow-sm">
                                <div className="position-relative me-3 me-md-4 flex-shrink-0">
                                    <div 
                                        className="rounded-circle overflow-hidden shadow-sm d-flex align-items-center justify-content-center bg-white"
                                        style={{ width: '80px', height: '80px', border: '1px solid var(--border-color)' }}
                                    >
                                        <Image 
                                            src={currentDisplayAvatar} 
                                            alt="Profile" 
                                            width={80}
                                            height={80}
                                            className="w-100 h-100 object-fit-cover"
                                        />
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fw-bold mb-1">{formData.username}</h5>
                                    <span 
                                        className="text-primary fw-bold small mb-0" 
                                        onClick={() => fileInputRef.current.click()} 
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Change Profile Photo
                                    </span>
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }} 
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Form Section */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label fw-bold text-muted small text-uppercase mb-2">Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control custom-input fs-6 py-2" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold text-muted small text-uppercase mb-2">Username</label>
                                    <input 
                                        type="text" 
                                        className="form-control custom-input fs-6 py-2" 
                                        name="username" 
                                        value={formData.username} 
                                        onChange={handleChange} 
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold text-muted small text-uppercase mb-2">Bio</label>
                                    <textarea 
                                        className="form-control custom-input fs-6" 
                                        name="bio" 
                                        rows="4" 
                                        value={formData.bio} 
                                        onChange={handleChange} 
                                        placeholder="Write a little about yourself..."
                                    ></textarea>
                                    <div className="form-text mt-2 text-end">{formData.bio.length} / 150</div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold text-muted small text-uppercase mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control custom-input fs-6 py-2" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required
                                    />
                                </div>

                                <div className="d-flex gap-2 justify-content-end mt-5">
                                    <button 
                                        type="button" 
                                        className="btn btn-light fw-bold px-4 py-2 rounded-pill"
                                        onClick={() => router.push('/profile')}
                                        disabled={editProfileMutation.isPending}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary fw-bold px-5 py-2 rounded-pill shadow-sm"
                                        disabled={editProfileMutation.isPending}
                                    >
                                        {editProfileMutation.isPending ? (
                                            <><span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Saving...</>
                                        ) : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
