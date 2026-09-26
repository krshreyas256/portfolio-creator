import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPortfolio } from "../firebase/firestore";

import "../styles/portfolio-preview.css";

const PortfolioPreview = () => {
  const { portfolioId } = useParams();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await getPortfolio(portfolioId);
        setPortfolio(data);
      } catch (error) {
        console.error("Error loading portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [portfolioId]);

  if (loading) {
    return <p>Loading portfolio...</p>;
  }

  if (!portfolio) {
    return <p>Portfolio not found.</p>;
  }

  return (
    <div className="portfolio-preview">
      {/* Navigation */}
      <header className="portfolio-header">
        <div className="portfolio-container">
          <a href="#home" className="portfolio-logo">
            {portfolio.personal?.name || "My Portfolio"}
          </a>

          <nav>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="portfolio-hero">
        <div className="portfolio-container hero-content">
          <div className="hero-text">
            <p className="hero-intro">Hello, I'm</p>

            <h1>
              {portfolio.personal?.name || "Your Name"}
            </h1>

            <h2>
              {portfolio.personal?.title || "Your Professional Title"}
            </h2>

            {portfolio.personal?.location && (
              <p className="hero-location">
                📍 {portfolio.personal.location}
              </p>
            )}
          </div>

          {portfolio.personal?.profileImage && (
            <div className="hero-image">
              <img
                src={portfolio.personal.profileImage}
                alt={portfolio.personal.name}
              />
            </div>
          )}
        </div>
      </section>

      {/* About */}
      {portfolio.about && (
        <section id="about" className="portfolio-section">
          <div className="portfolio-container">
            <h2>About Me</h2>

            <p className="about-text">
              {portfolio.about}
            </p>
          </div>
        </section>
      )}

      {/* Skills */}
      {portfolio.skills?.length > 0 && (
        <section id="skills" className="portfolio-section">
          <div className="portfolio-container">
            <h2>Skills</h2>

            <div className="skills-list">
              {portfolio.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {portfolio.education?.length > 0 && (
        <section className="portfolio-section">
          <div className="portfolio-container">
            <h2>Education</h2>

            <div className="timeline">
              {portfolio.education.map((education, index) => (
                <div className="timeline-item" key={index}>
                  <h3>{education.degree}</h3>

                  <h4>{education.institution}</h4>

                  <p className="timeline-date">
                    {education.startYear} - {education.endYear}
                  </p>

                  {education.description && (
                    <p>{education.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      {portfolio.experience?.length > 0 && (
        <section id="experience" className="portfolio-section">
          <div className="portfolio-container">
            <h2>Experience</h2>

            <div className="timeline">
              {portfolio.experience.map((experience, index) => (
                <div className="timeline-item" key={index}>
                  <h3>{experience.jobTitle}</h3>

                  <h4>{experience.company}</h4>

                  {experience.location && (
                    <p>{experience.location}</p>
                  )}

                  <p className="timeline-date">
                    {experience.startDate} -{" "}
                    {experience.current
                      ? "Present"
                      : experience.endDate}
                  </p>

                  {experience.description && (
                    <p>{experience.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {portfolio.projects?.length > 0 && (
        <section id="projects" className="portfolio-section">
          <div className="portfolio-container">
            <h2>Projects</h2>

            <div className="projects-grid">
              {portfolio.projects.map((project, index) => (
                <article className="project-card" key={index}>
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                    />
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
                          GitHub
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live Demo
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

      {/* Certifications */}
      {portfolio.certifications?.length > 0 && (
        <section className="portfolio-section">
          <div className="portfolio-container">
            <h2>Certifications</h2>

            <div className="certifications-grid">
              {portfolio.certifications.map(
                (certification, index) => (
                  <article
                    className="certification-card"
                    key={index}
                  >
                    <h3>{certification.name}</h3>

                    <h4>{certification.organization}</h4>

                    {certification.issueDate && (
                      <p>
                        Issued: {certification.issueDate}
                      </p>
                    )}

                    {certification.credentialId && (
                      <p>
                        Credential ID:{" "}
                        {certification.credentialId}
                      </p>
                    )}

                    {certification.credentialUrl && (
                      <a
                        href={certification.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Credential
                      </a>
                    )}
                  </article>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="portfolio-section contact-section">
        <div className="portfolio-container">
          <h2>Let's Connect</h2>

          <div className="contact-links">
            {portfolio.contact?.email && (
              <a href={`mailto:${portfolio.contact.email}`}>
                Email
              </a>
            )}

            {portfolio.contact?.phone && (
              <a href={`tel:${portfolio.contact.phone}`}>
                Phone
              </a>
            )}

            {portfolio.socialLinks?.github && (
              <a
                href={portfolio.socialLinks.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            )}

            {portfolio.socialLinks?.linkedin && (
              <a
                href={portfolio.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            )}

            {portfolio.socialLinks?.twitter && (
              <a
                href={portfolio.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
              >
                X
              </a>
            )}

            {portfolio.socialLinks?.instagram && (
              <a
                href={portfolio.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="portfolio-footer">
        <p>
          © {new Date().getFullYear()}{" "}
          {portfolio.personal?.name || "My Portfolio"}
        </p>
      </footer>
    </div>
  );
};

export default PortfolioPreview;