import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/" style={{ marginRight: "10px" }}>
        Workflows
      </Link>

      <Link to="/dashboard" style={{ marginRight: "10px" }}>
        Dashboard
      </Link>

      <span style={{ marginRight: "10px" }}>
        Logged in as: {user.email}
      </span>

      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;
