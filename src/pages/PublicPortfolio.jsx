import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPublishedPortfolio } from "../firebase/firestore";

import "../styles/portfolio-preview.css";

const PublicPortfolio = () => {
  const { slug } = useParams();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await getPublishedPortfolio(slug);
        setPortfolio(data);
      } catch (error) {
        console.error("Error loading public portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <div className="preview-loading">
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="preview-loading">
        <h2>Portfolio Not Found</h2>
        <p>This portfolio may not exist or hasn't been published.</p>
      </div>
    );
  }

  const personal = portfolio.personal || {};
  const socialLinks = portfolio.socialLinks || {};
  const contact = portfolio.contact || {};

  return (
    <div className="portfolio-preview">
      {/* HEADER */}

      <header className="portfolio-header">
        <div className="portfolio-container header-content">
          <a href="#home" className="portfolio-logo">
            {personal.name || "My Portfolio"}
          </a>

          <nav className="portfolio-nav">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#education">Education</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* HERO */}

      <section id="home" className="portfolio-hero">
        <div className="portfolio-container hero-content">
          <div className="hero-text">
            <p className="hero-greeting">Hello, I'm</p>

            <h1>{personal.name || "Your Name"}</h1>

            <h2>
              {personal.title || "Your Professional Title"}
            </h2>

            {personal.location && (
              <p className="hero-location">
                📍 {personal.location}
              </p>
            )}

            <div className="hero-actions">
              <a href="#projects" className="primary-button">
                View Projects
              </a>

              <a href="#contact" className="secondary-button">
                Contact Me
              </a>
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
              <span>
                {(personal.name || "Y").charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}

      {portfolio.about && (
        <section id="about" className="portfolio-section">
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

      {/* SKILLS */}

      {portfolio.skills?.length > 0 && (
        <section id="skills" className="portfolio-section section-muted">
          <div className="portfolio-container">
            <div className="section-heading">
              <span>02</span>
              <h2>Skills</h2>
            </div>

            <div className="skills-grid">
              {portfolio.skills.map((skill, index) => (
                <div className="skill-card" key={index}>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EXPERIENCE */}

      {portfolio.experience?.length > 0 && (
        <section id="experience" className="portfolio-section">
          <div className="portfolio-container">
            <div className="section-heading">
              <span>03</span>
              <h2>Experience</h2>
            </div>

            <div className="timeline">
              {portfolio.experience.map((experience, index) => (
                <article className="timeline-item" key={index}>
                  <div className="timeline-marker"></div>

                  <div className="timeline-content">
                    <div className="timeline-top">
                      <div>
                        <h3>{experience.jobTitle}</h3>
                        <h4>{experience.company}</h4>
                      </div>

                      <span className="timeline-date">
                        {experience.startDate} —{" "}
                        {experience.current
                          ? "Present"
                          : experience.endDate}
                      </span>
                    </div>

                    {experience.location && (
                      <p className="timeline-location">
                        📍 {experience.location}
                      </p>
                    )}

                    {experience.description && (
                      <p>{experience.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS */}

      {portfolio.projects?.length > 0 && (
        <section id="projects" className="portfolio-section section-muted">
          <div className="portfolio-container">
            <div className="section-heading">
              <span>04</span>
              <h2>Projects</h2>
            </div>

            <div className="projects-grid">
              {portfolio.projects.map((project, index) => (
                <article className="project-card" key={index}>
                  {project.imageUrl && (
                    <div className="project-image-wrapper">
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="project-image"
                      />
                    </div>
                  )}

                  <div className="project-content">
                    <h3>{project.name}</h3>

                    <p>{project.description}</p>

                    {project.technologies?.length > 0 && (
                      <div className="project-technologies">
                        {project.technologies.map(
                          (technology, technologyIndex) => (
                            <span key={technologyIndex}>
                              {technology}
                            </span>
                          )
                        )}
                      </div>
                    )}

                    <div className="project-links">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          GitHub ↗
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EDUCATION */}

      {portfolio.education?.length > 0 && (
        <section id="education" className="portfolio-section">
          <div className="portfolio-container">
            <div className="section-heading">
              <span>05</span>
              <h2>Education</h2>
            </div>

            <div className="education-grid">
              {portfolio.education.map((education, index) => (
                <article className="education-card" key={index}>
                  <span className="education-period">
                    {education.startYear} — {education.endYear}
                  </span>

                  <h3>{education.degree}</h3>

                  <h4>{education.institution}</h4>

                  {education.description && (
                    <p>{education.description}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}

      {portfolio.certifications?.length > 0 && (
        <section className="portfolio-section section-muted">
          <div className="portfolio-container">
            <div className="section-heading">
              <span>06</span>
              <h2>Certifications</h2>
            </div>

            <div className="certifications-grid">
              {portfolio.certifications.map(
                (certification, index) => (
                  <article
                    className="certification-card"
                    key={index}
                  >
                    <div className="certification-icon">
                      ✓
                    </div>

                    <div>
                      <h3>{certification.name}</h3>

                      <h4>{certification.organization}</h4>

                      {certification.issueDate && (
                        <p>
                          Issued {certification.issueDate}
                        </p>
                      )}

                      {certification.credentialId && (
                        <p>
                          ID: {certification.credentialId}
                        </p>
                      )}

                      {certification.credentialUrl && (
                        <a
                          href={certification.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Credential ↗
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

      {/* CONTACT */}

      <section id="contact" className="contact-section">
        <div className="portfolio-container contact-content">
          <p className="contact-eyebrow">
            07 — GET IN TOUCH
          </p>

          <h2>Let's Connect</h2>

          <p>
            Have a project, opportunity, or just want to say hello?
            Feel free to reach out.
          </p>

          <div className="contact-links">
            {contact.email && (
              <a href={`mailto:${contact.email}`}>Email</a>
            )}

            {contact.phone && (
              <a href={`tel:${contact.phone}`}>Phone</a>
            )}

            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            )}

            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            )}

            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
              >
                X
              </a>
            )}

            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="portfolio-footer">
        <div className="portfolio-container">
          <p>
            © {new Date().getFullYear()}{" "}
            {personal.name || "My Portfolio"}
          </p>

          <p>Built with Portfolio Creator</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicPortfolio;