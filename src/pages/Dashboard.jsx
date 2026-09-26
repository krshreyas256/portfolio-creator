import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../firebase/auth";

import {
  getUserPortfolios,
  createPortfolio,
} from "../firebase/firestore";

import "../styles/dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const loadPortfolios = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");

      const data = await getUserPortfolios(user.uid);

      data.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;

        return dateB - dateA;
      });

      setPortfolios(data);
    } catch (error) {
      console.error("Error loading portfolios:", error);
      setError("Unable to load your portfolios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, [user]);

  const handleCreatePortfolio = async () => {
    if (!user) return;

    try {
      setCreating(true);
      setError("");

      const portfolioId = await createPortfolio(user.uid);

      navigate(`/create/${portfolioId}`);
    } catch (error) {
      console.error("Error creating portfolio:", error);

      setError("Unable to create portfolio. Please try again.");
      setCreating(false);
    }
  };

  const handleCopyUrl = async (portfolioId, slug) => {
    const url = `${window.location.origin}/p/${slug}`;

    try {
      await navigator.clipboard.writeText(url);

      setCopiedId(portfolioId);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading your portfolios...
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-inner">

          <a
            href="/dashboard"
            className="dashboard-brand"
          >
            Portfolio Creator
          </a>

          <div className="dashboard-header-right">

            <span className="dashboard-user-email">
              {user?.email}
            </span>

            <button
              type="button"
              className="dashboard-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>
      </header>


      {/* Main */}
      <main className="dashboard-main">

        {/* Heading */}
        <div className="dashboard-title-row">

          <div className="dashboard-title">
            <h1>My Portfolios</h1>

            <p>
              Create, edit and manage your professional
              portfolios.
            </p>
          </div>

          <button
            type="button"
            className="create-portfolio-button"
            onClick={handleCreatePortfolio}
            disabled={creating}
          >
            {creating
              ? "Creating..."
              : "+ Create Portfolio"}
          </button>

        </div>


        {/* Error */}
        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {/* Portfolios */}
        {portfolios.length === 0 ? (

          <section className="dashboard-empty">

            <div className="dashboard-empty-icon">
              📄
            </div>

            <h2>No portfolios yet</h2>

            <p>
              Create your first portfolio and start building
              your professional online presence.
            </p>

            <button
              type="button"
              className="create-portfolio-button"
              onClick={handleCreatePortfolio}
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create Your First Portfolio"}
            </button>

          </section>

        ) : (

          <section className="portfolio-grid">

            {portfolios.map((portfolio) => (

              <article
                className="portfolio-card"
                key={portfolio.id}
              >

                {/* Card top */}
                <div className="portfolio-card-top">

                  <div className="portfolio-card-info">

                    <h2>
                      {portfolio.personal?.name ||
                        "Untitled Portfolio"}
                    </h2>

                    <p>
                      {portfolio.personal?.title ||
                        "Professional Portfolio"}
                    </p>

                  </div>


                  {/* Status */}
                  {portfolio.published ? (

                    <span className="portfolio-status published">
                      ● Published
                    </span>

                  ) : (

                    <span className="portfolio-status draft">
                      ● Draft
                    </span>

                  )}

                </div>


                {/* URL */}
                {portfolio.published &&
                portfolio.slug ? (

                  <div className="portfolio-url-box">

                    <span className="portfolio-url-label">
                      Public URL
                    </span>

                    <span className="portfolio-url">
                      {window.location.origin}/p/
                      {portfolio.slug}
                    </span>

                  </div>

                ) : (

                  <div className="portfolio-draft-message">
                    This portfolio hasn't been published yet.
                  </div>

                )}


                {/* Actions */}
                <div className="portfolio-actions">

                  <button
                    type="button"
                    className="portfolio-action primary"
                    onClick={() =>
                      navigate(
                        `/create/${portfolio.id}`
                      )
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="portfolio-action"
                    onClick={() =>
                      navigate(
                        `/preview/${portfolio.id}`
                      )
                    }
                  >
                    Preview
                  </button>


                  {portfolio.published &&
                  portfolio.slug && (
                    <>
                      <button
                        type="button"
                        className="portfolio-action live"
                        onClick={() =>
                          window.open(
                            `/p/${portfolio.slug}`,
                            "_blank"
                          )
                        }
                      >
                        View Live
                      </button>


                      <button
                        type="button"
                        className="portfolio-action copy"
                        onClick={() =>
                          handleCopyUrl(
                            portfolio.id,
                            portfolio.slug
                          )
                        }
                      >
                        {copiedId === portfolio.id
                          ? "Copied!"
                          : "Copy URL"}
                      </button>
                    </>
                  )}

                </div>

              </article>

            ))}

          </section>

        )}

      </main>

    </div>
  );
};

export default Dashboard;