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
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCreatePortfolio = () => {
    navigate("/create");
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>

      <header>
        <h1>Portfolio Creator</h1>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main>

        <section>
          <h2>
            Welcome, {profile?.name || "User"} 👋
          </h2>

          <p>
            Create and share your professional portfolio.
          </p>
        </section>

        <section>
          <h2>Your Portfolio</h2>

          <div>
            <h3>Create your portfolio</h3>

            <p>
              Build a professional portfolio and publish it online.
            </p>

            <button onClick={handleCreatePortfolio}>
              + Create Portfolio
            </button>
          </div>
        </section>

      </main>

    </div>
  );
};

export default Dashboard;