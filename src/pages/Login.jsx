import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../firebase/auth";

import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-brand">
          <Link to="/" className="auth-brand-name">
            Portfolio Creator
          </Link>

          <p className="auth-brand-tagline">
            Build. Publish. Share.
          </p>
        </div>

        <div className="auth-card">

          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>
              Log in to continue building your portfolio.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>

            <div className="auth-field">
              <label htmlFor="login-email">
                Email
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/signup">
                Create an account
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;