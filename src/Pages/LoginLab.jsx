import React, { useState } from 'react';
import { toast } from 'react-toastify';

function LoginLab() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please fill in all fields");
      return;
    }
    
    // Simulate login
    if (email === 'admin@test.com' && password === '123456') {
      toast.success("Login successful! Welcome back.");
    } else {
      toast.error("Invalid credentials. Try admin@test.com / 123456");
    }
  };

  return (
    <div>
      <div className="card-body p-4">
        <h4 className="card-title text-center mb-4 fw-bold">Login</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted">Email address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@test.com"
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-muted">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginLab;
