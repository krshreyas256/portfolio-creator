import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../firebase/auth";
import { createUserProfile } from "../firebase/firestore";

import "../styles/auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await registerUser(email, password);

      await createUserProfile(result.user, name);

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
            <h1>Create your account</h1>
            <p>
              Start building your professional portfolio.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSignup}>

            <div className="auth-field">
              <label htmlFor="signup-name">
                Full Name
              </label>

              <input
                id="signup-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-email">
                Email
              </label>

              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-password">
                Password
              </label>

              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login">
                Log in
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Signup;