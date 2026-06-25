"use client";

import React, { useState } from 'react';
import api from '@/utils/apiClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

export default function UserRegister() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
            const response = await api.post('/user/register', formData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                queryClient.clear();
                localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
                toast.success('Registration successful!');
                window.location.href = '/feed';
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="glass-card p-5" style={{ width: '100%', maxWidth: '450px' }}>
                <h2 className="text-center mb-4 fw-bold text-dark">Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted fw-semibold">Username</label>
                        <input type="text" name="username" className="form-control custom-input" placeholder="johndoe123" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted fw-semibold">Email Address</label>
                        <input type="email" name="email" className="form-control custom-input" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted fw-semibold">Password</label>
                        <input type="password" name="password" className="form-control custom-input" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm mb-3" style={{ padding: '10px' }}>
                        Sign Up
                    </button>
                    <p className="text-center text-muted mb-0">
                        Already have an account? <Link href="/login" className="text-primary text-decoration-none fw-bold">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
