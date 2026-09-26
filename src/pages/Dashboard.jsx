import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  getUserPortfolios,
  createPortfolio,
} from "../firebase/firestore";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const loadPortfolios = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");

      const data = await getUserPortfolios(user.uid);

      // Show newest portfolios first
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

  const handleCopyUrl = async (slug) => {
    const url = `${window.location.origin}/p/${slug}`;

    try {
      await navigator.clipboard.writeText(url);
      alert("Portfolio URL copied!");
    } catch (error) {
      console.error("Copy error:", error);
      alert(url);
    }
  };

  if (loading) {
    return (
      <div>
        <h1>My Portfolios</h1>
        <p>Loading your portfolios...</p>
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>My Portfolios</h1>

        <p>
          Create, edit and manage your professional portfolios.
        </p>

        <button
          type="button"
          onClick={handleCreatePortfolio}
          disabled={creating}
        >
          {creating ? "Creating..." : "+ Create Portfolio"}
        </button>
      </header>

      {error && <p>{error}</p>}

      {portfolios.length === 0 ? (
        <section>
          <h2>No portfolios yet</h2>

          <p>
            Create your first portfolio and start building your
            professional online presence.
          </p>

          <button
            type="button"
            onClick={handleCreatePortfolio}
            disabled={creating}
          >
            {creating ? "Creating..." : "Create Your First Portfolio"}
          </button>
        </section>
      ) : (
        <section>
          {portfolios.map((portfolio) => (
            <article key={portfolio.id}>
              <div>
                <h2>
                  {portfolio.personal?.name || "Untitled Portfolio"}
                </h2>

                <p>
                  {portfolio.personal?.title ||
                    "Professional Portfolio"}
                </p>
              </div>

              <div>
                {portfolio.published ? (
                  <span>🟢 Published</span>
                ) : (
                  <span>🟡 Draft</span>
                )}
              </div>

              {portfolio.published && portfolio.slug && (
                <p>
                  {window.location.origin}/p/{portfolio.slug}
                </p>
              )}

              <div>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/create/${portfolio.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/preview/${portfolio.id}`)
                  }
                >
                  Preview
                </button>

                {portfolio.published && portfolio.slug && (
                  <>
                    <button
                      type="button"
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
                      onClick={() =>
                        handleCopyUrl(portfolio.slug)
                      }
                    >
                      Copy URL
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default Dashboard;