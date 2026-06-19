import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow px-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Instagram</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/todo">Todo</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/expense">Expense</Link>
            </li>
            
            {/* React Basics Dropdown */}
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" id="reactBasicsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" tabIndex="0">
                React Basics
              </span>
              <ul className="dropdown-menu shadow-sm border-0" aria-labelledby="reactBasicsDropdown">
                <li><Link className="dropdown-item" to="/counter">Counter</Link></li>
                <li><Link className="dropdown-item" to="/ref">useRef</Link></li>
                <li><Link className="dropdown-item" to="/axios">Axios</Link></li>
              </ul>
            </li>

            {/* Widgets Dropdown */}
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" id="widgetsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" tabIndex="0">
                Widgets
              </span>
              <ul className="dropdown-menu shadow-sm border-0" aria-labelledby="widgetsDropdown">
                <li><Link className="dropdown-item" to="/clock">Digital Clock</Link></li>
                <li><Link className="dropdown-item" to="/profile">Profile Card</Link></li>
                <li><Link className="dropdown-item" to="/progress">Progress Bar</Link></li>
                <li><Link className="dropdown-item" to="/stars">Star Rating</Link></li>
              </ul>
            </li>
          </ul>
          
          <div className="d-flex">
            <Link className="btn btn-outline-light rounded-pill px-4" to="/login">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;