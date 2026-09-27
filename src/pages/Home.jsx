import { Link } from "react-router-dom";

import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-page">

      {/* ==========================================
          NAVIGATION
          ========================================== */}

      <header className="home-header">
        <div className="home-container home-header-inner">

          <Link to="/" className="home-logo">
            Portfolio Creator
          </Link>

          <nav className="home-nav">
            <Link to="/login" className="home-login-link">
              Login
            </Link>

            <Link to="/signup" className="home-signup-link">
              Get Started
            </Link>
          </nav>

        </div>
      </header>


      {/* ==========================================
          HERO
          ========================================== */}

      <main>

        <section className="home-hero">

          <div className="home-container home-hero-content">

            <div className="home-hero-text">

              <span className="home-eyebrow">
                YOUR PORTFOLIO, YOUR WAY
              </span>

              <h1>
                Build a professional
                <span> portfolio </span>
                without writing code.
              </h1>

              <p className="home-hero-description">
                Create, customize, and publish your professional
                portfolio in minutes. Showcase your skills,
                experience, projects, and achievements with a
                portfolio that's truly yours.
              </p>

              <div className="home-hero-actions">

                <Link
                  to="/signup"
                  className="home-primary-button"
                >
                  Create Your Portfolio
                  <span>→</span>
                </Link>

                <Link
                  to="/login"
                  className="home-secondary-button"
                >
                  Already have an account?
                  <span>Log in</span>
                </Link>

              </div>

            </div>


            {/* ==========================================
                HERO VISUAL
                ========================================== */}

            <div className="home-hero-visual">

              <div className="home-preview-window">

                <div className="home-window-header">

                  <div className="home-window-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="home-window-address">
                    yourname.portfolio
                  </div>

                </div>


                <div className="home-preview-content">

                  <div className="home-preview-top">

                    <div className="home-preview-avatar">
                      Y
                    </div>

                    <div className="home-preview-lines">

                      <span className="home-preview-name">
                        Your Name
                      </span>

                      <span className="home-preview-title">
                        Software Developer
                      </span>

                    </div>

                  </div>


                  <div className="home-preview-heading">
                    <span>HELLO, I'M</span>

                    <strong>
                      Your Name
                    </strong>

                    <p>
                      Building ideas into meaningful digital
                      experiences.
                    </p>
                  </div>


                  <div className="home-preview-sections">

                    <div>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            FEATURES
            ========================================== */}

        <section className="home-features">

          <div className="home-container">

            <div className="home-section-heading">

              <span>
                SIMPLE PROCESS
              </span>

              <h2>
                Everything you need to build your portfolio.
              </h2>

              <p>
                Focus on your work while we take care of the
                portfolio structure.
              </p>

            </div>


            <div className="home-feature-grid">

              <article className="home-feature-card">

                <div className="home-feature-number">
                  01
                </div>

                <h3>
                  Create
                </h3>

                <p>
                  Add your personal information, skills,
                  education, experience, projects, and
                  certifications.
                </p>

              </article>


              <article className="home-feature-card">

                <div className="home-feature-number">
                  02
                </div>

                <h3>
                  Customize
                </h3>

                <p>
                  Build your portfolio step by step and
                  preview your changes before publishing.
                </p>

              </article>


              <article className="home-feature-card">

                <div className="home-feature-number">
                  03
                </div>

                <h3>
                  Publish
                </h3>

                <p>
                  Publish your portfolio and share your
                  personal public URL with anyone.
                </p>

              </article>

            </div>

          </div>

        </section>


        {/* ==========================================
            CTA
            ========================================== */}

        <section className="home-cta">

          <div className="home-container">

            <div className="home-cta-content">

              <span>
                READY TO GET STARTED?
              </span>

              <h2>
                Turn your work into a portfolio.
              </h2>

              <p>
                Create your portfolio and start sharing
                your work with the world.
              </p>

              <Link
                to="/signup"
                className="home-primary-button"
              >
                Create Your Portfolio
                <span>→</span>
              </Link>

            </div>

          </div>

        </section>

      </main>


      {/* ==========================================
          FOOTER
          ========================================== */}

      <footer className="home-footer">

        <div className="home-container home-footer-inner">

          <p>
            © {new Date().getFullYear()} Portfolio Creator
          </p>

          <p>
            Build. Publish. Share.
          </p>

        </div>

      </footer>

    </div>
  );
};

export default Home;