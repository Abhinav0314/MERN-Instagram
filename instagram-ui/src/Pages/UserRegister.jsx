import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/user/register', formData);
            if (response.data.success) {
                toast.success('Registration successful! Please login.');
                navigate('/login');
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
                        Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default UserRegister;
