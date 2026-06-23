import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/user/login', formData);
            if (response.data.success) {
                toast.success('Login successful!');
                localStorage.setItem('userInfo', JSON.stringify(response.data.user));
                navigate('/dashboard');
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
                        Don't have an account? <Link to="/register" className="text-primary text-decoration-none fw-bold">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;
