import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  getUserPortfolios,
  createPortfolio,
  deletePortfolio,
} from "../firebase/firestore";

import DashboardHeader from "../components/layout/DashboardHeader";
import Footer from "../components/layout/Footer";

import "../styles/dashboard.css";
import "../styles/footer.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
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

  const handleDeletePortfolio = async (portfolioId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this portfolio?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(portfolioId);
      setError("");

      await deletePortfolio(portfolioId);

      setPortfolios((previous) =>
        previous.filter((portfolio) => portfolio.id !== portfolioId)
      );
    } catch (error) {
      console.error("Error deleting portfolio:", error);

      setError("Unable to delete the portfolio. Please try again.");
    } finally {
      setDeletingId(null);
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

      {/* =====================================================
          HEADER
      ===================================================== */}

      <DashboardHeader />


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="dashboard-main">

        {/* Page Heading */}
        <div className="dashboard-title-row">

          <div className="dashboard-title">
            <h1>My Portfolios</h1>

            <p>
              Create, edit and manage your professional portfolios.
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


        {/* ===================================================
            EMPTY STATE
        =================================================== */}

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

          /* =================================================
             PORTFOLIO GRID
          ================================================= */

          <section className="portfolio-grid">

            {portfolios.map((portfolio) => (

              <article
                className="portfolio-card"
                key={portfolio.id}
              >

                {/* =================================================
                   CARD TOP
                ================================================= */}

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


                {/* =================================================
                   PUBLIC URL / DRAFT MESSAGE
                ================================================= */}

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


                {/* =================================================
                   ACTIONS
                ================================================= */}

                <div className="portfolio-actions">

                  {/* Edit */}

                  <button
                    type="button"
                    className="portfolio-action primary"
                    onClick={() =>
                      navigate(`/create/${portfolio.id}`)
                    }
                  >
                    Edit
                  </button>


                  {/* Preview */}

                  <button
                    type="button"
                    className="portfolio-action"
                    onClick={() =>
                      navigate(`/preview/${portfolio.id}`)
                    }
                  >
                    Preview
                  </button>


                  {/* Published-only actions */}

                  {portfolio.published &&
                  portfolio.slug && (
                    <>

                      {/* View Live */}

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


                      {/* Copy URL */}

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


                  {/* Delete */}

                  <button
                    type="button"
                    className="portfolio-action delete"
                    onClick={() =>
                      handleDeletePortfolio(portfolio.id)
                    }
                    disabled={
                      deletingId === portfolio.id
                    }
                  >
                    {deletingId === portfolio.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </article>

            ))}

          </section>

        )}

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
};

export default Dashboard;