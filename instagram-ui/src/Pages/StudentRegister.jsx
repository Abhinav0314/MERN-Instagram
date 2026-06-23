import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const StudentRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        roll: '',
        mobile: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/student/register', formData);
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
                        <label className="form-label text-muted fw-semibold">Full Name</label>
                        <input type="text" name="name" className="form-control custom-input" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted fw-semibold">Roll Number</label>
                        <input type="text" name="roll" className="form-control custom-input" placeholder="CS2023001" value={formData.roll} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted fw-semibold">Mobile Number</label>
                        <input type="number" name="mobile" className="form-control custom-input" placeholder="9876543210" value={formData.mobile} onChange={handleChange} required />
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

export default StudentRegister;
