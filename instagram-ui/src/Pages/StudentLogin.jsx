import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const StudentLogin = () => {
    const [formData, setFormData] = useState({
        roll: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/student/login', formData);
            if (response.data.success) {
                toast.success('Login successful!');
                // Save user info in localStorage for simple auth state
                localStorage.setItem('studentInfo', JSON.stringify(response.data.student));
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
                        <label className="form-label text-muted fw-semibold">Roll Number</label>
                        <input type="text" name="roll" className="form-control custom-input" placeholder="CS2023001" value={formData.roll} onChange={handleChange} required />
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

export default StudentLogin;
