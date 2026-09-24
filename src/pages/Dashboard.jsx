import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../firebase/auth";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome, {user?.email}</p>

      <button>
        Create Portfolio
      </button>

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;