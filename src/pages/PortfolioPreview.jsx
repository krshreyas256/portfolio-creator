import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  getPortfolio,
  isSlugAvailable,
  publishPortfolio,
  updatePortfolio,
} from "../firebase/firestore";

import { generateSlug } from "../utils/slug";

import "../styles/portfolio-preview.css";

const PortfolioPreview = () => {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await getPortfolio(portfolioId);

        if (!data) {
          navigate("/dashboard");
          return;
        }

        setPortfolio(data);

        /*
         * If the portfolio is already published,
         * always use the existing slug to build the URL.
         */
        if (data.published && data.slug) {
          setPublishedUrl(
            `${window.location.origin}/p/${data.slug}`
          );
        }
      } catch (err) {
        console.error("Error loading portfolio:", err);
        setError("Unable to load portfolio.");
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [portfolioId, navigate]);

  /*
   * ==========================================
   * BACK NAVIGATION
   * ==========================================
   *
   * If Preview was opened from the Builder,
   * return to the exact Builder step.
   *
   * If Preview was opened from Dashboard,
   * return to Dashboard.
   */

  const handleBack = () => {
    if (location.state?.from === "builder") {
      navigate(`/create/${portfolioId}`, {
        state: {
          step: location.state.step || 1,
        },
      });

      return;
    }

    navigate("/dashboard");
  };

  /*
   * ==========================================
   * PUBLISH / PUBLISH CHANGES
   * ==========================================
   *
   * First-time publishing:
   * - Generate slug
   * - Check availability
   * - Publish portfolio
   * - Create permanent URL
   *
   * Already published:
   * - NEVER generate a new slug
   * - NEVER change the URL
   * - Update the saved portfolio content only
   */

  const handlePublish = async () => {
    if (!portfolio) return;

    setError("");

    try {
      setPublishing(true);

      /*
       * ==========================================
       * ALREADY PUBLISHED
       * ==========================================
       *
       * Keep the existing slug permanently.
       * Only update portfolio content.
       */
      if (portfolio.published && portfolio.slug) {
        await updatePortfolio(portfolioId, {
          personal: portfolio.personal,
          about: portfolio.about,
          skills: portfolio.skills,
          education: portfolio.education,
          experience: portfolio.experience,
          projects: portfolio.projects,
          certifications: portfolio.certifications,
          socialLinks: portfolio.socialLinks,
          contact: portfolio.contact,
          template: portfolio.template,
        });

        /*
         * Rebuild the URL using the existing slug.
         * The slug is never regenerated here.
         */
        setPublishedUrl(
          `${window.location.origin}/p/${portfolio.slug}`
        );

        return;
      }

      /*
       * ==========================================
       * FIRST-TIME PUBLISH
       * ==========================================
       *
       * Generate the slug only once.
       */
      let slug = generateSlug(portfolio.personal?.name);

      if (!slug) {
        throw new Error(
          "Please add your name in Personal Information before publishing."
        );
      }

      /*
       * Check whether the generated slug is already
       * being used by another published portfolio.
       */
      const available = await isSlugAvailable(slug);

      /*
       * If the slug is already taken, create a unique
       * slug using the portfolio ID.
       */
      if (!available) {
        slug = `${slug}-${portfolioId.slice(0, 6)}`;
      }

      /*
       * Publish the portfolio for the first time.
       */
      await publishPortfolio(portfolioId, slug);

      /*
       * Update local state so the UI immediately
       * switches from "Publish Portfolio" to
       * "Publish Changes".
       */
      setPortfolio((prev) => ({
        ...prev,
        slug,
        published: true,
      }));

      const url = `${window.location.origin}/p/${slug}`;

      setPublishedUrl(url);
    } catch (err) {
      console.error("Publishing error:", err);

      setError(
        err.message || "Something went wrong while publishing."
      );
    } finally {
      setPublishing(false);
    }
  };

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <div className="preview-loading">
        <p>Loading preview...</p>
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  const personal = portfolio.personal || {};
  const socialLinks = portfolio.socialLinks || {};
  const contact = portfolio.contact || {};

  return (
    <div className="portfolio-preview">

      {/* ==========================================
          PREVIEW TOP BAR
          ========================================== */}

      <div className="preview-navigation">
        <div className="portfolio-container preview-navigation-inner">

          <button
            type="button"
            className="preview-back-button"
            onClick={handleBack}
          >
            ← Back
          </button>

          <div className="preview-actions">

            <button
              type="button"
              className="preview-publish-button"
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing
                ? "Publishing..."
                : portfolio.published
                ? "Publish Changes"
                : "Publish Portfolio"}
            </button>

          </div>

        </div>

        {/* Published URL */}

        {publishedUrl && (
          <div className="preview-published-url">

            <span>Your portfolio is live:</span>

            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {publishedUrl}
            </a>

          </div>
        )}

        {/* Error */}

        {error && (
          <div className="preview-error">
            {error}
          </div>
        )}

      </div>

      {/* ==========================================
          HEADER
          ========================================== */}

      <header className="portfolio-header">

        <div className="portfolio-container header-content">

          <a
            href="#home"
            className="portfolio-logo"
          >
            {personal.name || "Portfolio"}
          </a>

          <nav className="portfolio-nav">

            {personal.about || portfolio.about ? (
              <a href="#about">About</a>
            ) : null}

            {portfolio.skills?.length > 0 && (
              <a href="#skills">Skills</a>
            )}

            {portfolio.experience?.length > 0 && (
              <a href="#experience">Experience</a>
            )}

            {portfolio.projects?.length > 0 && (
              <a href="#projects">Projects</a>
            )}

            {portfolio.education?.length > 0 && (
              <a href="#education">Education</a>
            )}

            {portfolio.certifications?.length > 0 && (
              <a href="#certifications">
                Certificates
              </a>
            )}

            {(contact.email || contact.phone) && (
              <a href="#contact">Contact</a>
            )}

          </nav>

        </div>

      </header>

      {/* ==========================================
          HERO
          ========================================== */}

      <section
        id="home"
        className="portfolio-hero"
      >

        <div className="portfolio-container hero-content">

          <div className="hero-text">

            <p className="hero-greeting">
              Welcome to my portfolio
            </p>

            <h1>
              {personal.name || "Your Name"}
            </h1>

            <h2>
              {personal.title || "Your Professional Title"}
            </h2>

            {personal.location && (
              <p className="hero-location">
                📍 {personal.location}
              </p>
            )}

            <div className="hero-actions">

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="primary-button"
                >
                  Contact Me
                </a>
              )}

              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button"
                >
                  LinkedIn
                </a>
              )}

              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button"
                >
                  GitHub
                </a>
              )}

            </div>

          </div>

          {personal.profileImage ? (
            <div className="hero-image-wrapper">

              <img
                src={personal.profileImage}
                alt={personal.name || "Profile"}
                className="hero-image"
              />

            </div>
          ) : (
            <div className="hero-image-placeholder">
              {(personal.name || "Y")
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

        </div>

      </section>

      {/* ==========================================
          ABOUT
          ========================================== */}

      {portfolio.about && (
        <section
          id="about"
          className="portfolio-section"
        >

          <div className="portfolio-container">

            <div className="section-heading">
              <span>01</span>
              <h2>About Me</h2>
            </div>

            <div className="about-content">
              <p>{portfolio.about}</p>
            </div>

          </div>

        </section>
      )}

      {/* ==========================================
          SKILLS
          ========================================== */}

      {portfolio.skills?.length > 0 && (
        <section
          id="skills"
          className="portfolio-section section-muted"
        >

          <div className="portfolio-container">

            <div className="section-heading">
              <span>02</span>
              <h2>Skills</h2>
            </div>

            <div className="skills-grid">

              {portfolio.skills.map((skill, index) => (
                <div
                  key={index}
                  className="skill-card"
                >
                  {typeof skill === "string"
                    ? skill
                    : skill.name}
                </div>
              ))}

            </div>

          </div>

        </section>
      )}

      {/* ==========================================
          EXPERIENCE
          ========================================== */}

      {portfolio.experience?.length > 0 && (
        <section
          id="experience"
          className="portfolio-section"
        >

          <div className="portfolio-container">

            <div className="section-heading">
              <span>03</span>
              <h2>Experience</h2>
            </div>

            <div className="timeline">

              {portfolio.experience.map(
                (experience, index) => (
                  <div
                    key={index}
                    className="timeline-item"
                  >

                    <span className="timeline-marker" />

                    <div className="timeline-content">

                      <div className="timeline-top">

                        <div>

                          <h3>
                            {experience.jobTitle}
                          </h3>

                          {experience.company && (
                            <h4>
                              {experience.company}
                            </h4>
                          )}

                        </div>

                        {(experience.startDate ||
                          experience.endDate ||
                          experience.current) && (
                          <span className="timeline-date">

                            {experience.startDate || ""}

                            {experience.startDate &&
                            (experience.endDate ||
                              experience.current)
                              ? " – "
                              : ""}

                            {experience.current
                              ? "Present"
                              : experience.endDate || ""}

                          </span>
                        )}

                      </div>

                      {experience.location && (
                        <p className="timeline-location">
                          📍 {experience.location}
                        </p>
                      )}

                      {experience.description && (
                        <p>
                          {experience.description}
                        </p>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

        </section>
      )}

      {/* ==========================================
          PROJECTS
          ========================================== */}

      {portfolio.projects?.length > 0 && (
        <section
          id="projects"
          className="portfolio-section section-muted"
        >

          <div className="portfolio-container">

            <div className="section-heading">
              <span>04</span>
              <h2>Projects</h2>
            </div>

            <div className="projects-grid">

              {portfolio.projects.map(
                (project, index) => (
                  <article
                    key={index}
                    className="project-card"
                  >

                    {project.image ? (
                      <div className="project-image-wrapper">

                        <img
                          src={project.image}
                          alt={
                            project.title ||
                            "Project"
                          }
                          className="project-image"
                        />

                      </div>
                    ) : (
                      <div className="project-image-placeholder">
                        Project
                      </div>
                    )}

                    <div className="project-content">

                      <h3>
                        {project.title}
                      </h3>

                      {project.description && (
                        <p>
                          {project.description}
                        </p>
                      )}

                      {project.technologies?.length >
                        0 && (
                        <div className="project-technologies">

                          {project.technologies.map(
                            (technology, techIndex) => (
                              <span key={techIndex}>
                                {typeof technology ===
                                "string"
                                  ? technology
                                  : technology.name}
                              </span>
                            )
                          )}

                        </div>
                      )}

                      {project.link && (
                        <div className="project-links">

                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Project →
                          </a>

                        </div>
                      )}

                    </div>

                  </article>
                )
              )}

            </div>

          </div>

        </section>
      )}

      {/* ==========================================
          EDUCATION
          ========================================== */}

      {portfolio.education?.length > 0 && (
        <section
          id="education"
          className="portfolio-section"
        >

          <div className="portfolio-container">

            <div className="section-heading">
              <span>05</span>
              <h2>Education</h2>
            </div>

            <div className="education-grid">

              {portfolio.education.map(
                (education, index) => (
                  <article
                    key={index}
                    className="education-card"
                  >

                    {(education.startYear ||
                      education.endYear) && (
                      <span className="education-period">

                        {education.startYear || ""}

                        {education.startYear &&
                        education.endYear
                          ? " – "
                          : ""}

                        {education.endYear || ""}

                      </span>
                    )}

                    <h3>
                      {education.degree}
                    </h3>

                    {education.institution && (
                      <h4>
                        {education.institution}
                      </h4>
                    )}

                    {education.description && (
                      <p>
                        {education.description}
                      </p>
                    )}

                  </article>
                )
              )}

            </div>

          </div>

        </section>
      )}

      {/* ==========================================
          CERTIFICATIONS
          ========================================== */}

      {portfolio.certifications?.length > 0 && (
        <section
          id="certifications"
          className="portfolio-section section-muted"
        >

          <div className="portfolio-container">

            <div className="section-heading">
              <span>06</span>
              <h2>Certifications</h2>
            </div>

            <div className="certifications-grid">

              {portfolio.certifications.map(
                (certification, index) => (
                  <article
                    key={index}
                    className="certification-card"
                  >

                    <div className="certification-icon">
                      ✓
                    </div>

                    <div>

                      <h3>
                        {certification.name}
                      </h3>

                      {certification.issuer && (
                        <h4>
                          {certification.issuer}
                        </h4>
                      )}

                      {certification.date && (
                        <p>
                          {certification.date}
                        </p>
                      )}

                      {certification.credentialUrl && (
                        <a
                          href={
                            certification.credentialUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Credential →
                        </a>
                      )}

                    </div>

                  </article>
                )
              )}

            </div>

          </div>

        </section>
      )}

      {/* ==========================================
          CONTACT
          ========================================== */}

      {(contact.email ||
        contact.phone ||
        socialLinks.github ||
        socialLinks.linkedin ||
        socialLinks.twitter ||
        socialLinks.instagram) && (
        <section
          id="contact"
          className="contact-section"
        >

          <div className="portfolio-container contact-content">

            <p className="contact-eyebrow">
              GET IN TOUCH
            </p>

            <h2>Let's Connect</h2>

            <p>
              Feel free to reach out if you'd like
              to connect or work together.
            </p>

            <div className="contact-links">

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                >
                  Email
                </a>
              )}

              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                >
                  Phone
                </a>
              )}

              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}

              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              )}

              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              )}

              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              )}

            </div>

          </div>

        </section>
      )}

      {/* ==========================================
          FOOTER
          ========================================== */}

      <footer className="portfolio-footer">

        <div className="portfolio-container">

          <p>
            © {new Date().getFullYear()}{" "}
            {personal.name || "Your Name"}.
            All rights reserved.
          </p>

          <p>
            Created with Portfolio Creator
          </p>

        </div>

      </footer>

    </div>
  );
};

export default PortfolioPreview;