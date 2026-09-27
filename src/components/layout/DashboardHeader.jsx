import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../firebase/auth";

import "../../styles/dashboard-header.css";

const DashboardHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const email = user?.email || "";
  const userInitial = email.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-inner">

        <Link to="/dashboard" className="dashboard-brand">
          Portfolio Creator
        </Link>

        <div className="dashboard-user-menu" ref={menuRef}>

          <button
            type="button"
            className={`dashboard-user-button ${
              menuOpen ? "active" : ""
            }`}
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label="Open account menu"
            aria-expanded={menuOpen}
          >
            {userInitial}
          </button>

          {menuOpen && (
            <div className="dashboard-user-dropdown">

              <div className="dashboard-user-dropdown-email">
                {email}
              </div>

              <div className="dashboard-user-dropdown-divider" />

              <button
                type="button"
                className="dashboard-dropdown-logout"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
};

export default DashboardHeader;