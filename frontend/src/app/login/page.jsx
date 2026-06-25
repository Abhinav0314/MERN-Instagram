"use client";

import React, { useState } from 'react';
import api from '@/utils/apiClient';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function UserLogin() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/user/login', formData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                queryClient.clear(); // Clear the cached error state!
                localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE'); // Destroy persistent cache
                toast.success('Login successful!');
                window.location.href = '/feed';
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="glass-card p-5" style={{ width: '100%', maxWidth: '450px' }}>
                <h2 className="text-center mb-4 fw-bold text-dark">Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted fw-semibold">Username</label>
                        <input type="text" name="username" className="form-control custom-input" placeholder="johndoe123" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted fw-semibold">Password</label>
                        <input type="password" name="password" className="form-control custom-input" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm mb-3" style={{ padding: '10px' }}>
                        Login
                    </button>
                    <p className="text-center text-muted mb-0">
                        Don&apos;t have an account? <Link href="/register" className="text-primary text-decoration-none fw-bold">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
