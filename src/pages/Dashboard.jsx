import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../firebase/auth";
import { getUserProfile } from "../firebase/firestore";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const data = await getUserProfile(user.uid);
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Welcome, {profile?.name} 👋</h2>

      <p>{profile?.email}</p>

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