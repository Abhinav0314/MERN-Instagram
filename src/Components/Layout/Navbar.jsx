import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="d-flex justify-content-center flex-wrap gap-2 mb-4 p-3 bg-light rounded shadow-sm border">
      <Link className="btn btn-primary" to="/todo">Todo</Link>
      <Link className="btn btn-success" to="/counter">Counter</Link>
      <Link className="btn btn-info text-white" to="/axios">Axios</Link>
      <Link className="btn btn-warning text-white" to="/ref">Ref</Link>
      <Link className="btn btn-dark" to="/clock">Clock</Link>
      <Link className="btn btn-secondary" to="/profile">Profile</Link>
      <Link className="btn btn-danger" to="/expense">Expense</Link>
      <Link className="btn btn-outline-success" to="/progress">Progress</Link>
      <Link className="btn btn-outline-warning" to="/stars">Rating</Link>
    </nav>
  );
}

export default Navbar;