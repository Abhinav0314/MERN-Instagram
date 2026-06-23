import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="d-flex justify-content-center mt-5">
            <div className="glass-card p-5 text-center" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="mb-4">
                    <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                        alt="avatar" 
                        className="rounded-circle mb-3 shadow" 
                        style={{ width: '120px', height: '120px', border: '4px solid white' }}
                    />
                    <h2 className="fw-bold text-dark">@{user.username}</h2>
                    <p className="text-muted">{user.email}</p>
                </div>
                
                <div className="d-flex justify-content-around mb-4">
                    <div>
                        <h4 className="fw-bold m-0">0</h4>
                        <small className="text-muted">Posts</small>
                    </div>
                    <div>
                        <h4 className="fw-bold m-0">124</h4>
                        <small className="text-muted">Followers</small>
                    </div>
                    <div>
                        <h4 className="fw-bold m-0">89</h4>
                        <small className="text-muted">Following</small>
                    </div>
                </div>

                <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-4 fw-bold">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
