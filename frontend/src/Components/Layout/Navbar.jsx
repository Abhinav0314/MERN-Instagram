import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo');

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow px-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" style={{ fontFamily: 'var(--bs-font-sans-serif)' }} to="/">
          <i className="bi bi-instagram me-2"></i>
          Instagram
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {userInfo && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
          
          <div className="d-flex align-items-center">
            {userInfo ? (
              <button onClick={handleLogout} className="btn btn-outline-light rounded-pill px-4 btn-sm">Logout</button>
            ) : (
              <>
                <Link className="btn btn-light rounded-pill px-4 btn-sm me-2 fw-bold text-dark" to="/login">Login</Link>
                <Link className="btn btn-outline-light rounded-pill px-4 btn-sm fw-bold" to="/register">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;