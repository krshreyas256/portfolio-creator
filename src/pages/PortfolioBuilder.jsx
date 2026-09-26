import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  getPortfolio,
  updatePortfolio,
} from "../firebase/firestore";

import PersonalInfo from "../components/builder/PersonalInfo";
import AboutMe from "../components/builder/AboutMe";
import Skills from "../components/builder/Skills";
import Education from "../components/builder/Education";
import Experience from "../components/builder/Experience";
import Projects from "../components/builder/Projects";
import Certifications from "../components/builder/Certifications";
import SocialContact from "../components/builder/SocialContact";

import "../styles/builder.css";

const PortfolioBuilder = () => {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    "Personal",
    "About",
    "Skills",
    "Education",
    "Experience",
    "Projects",
    "Certificates",
    "Contact",
  ];

  const [step, setStep] = useState(location.state?.step || 1);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await getPortfolio(portfolioId);

        if (!data) {
          navigate("/dashboard");
          return;
        }

        setPortfolio(data);
      } catch (error) {
        console.error("Error loading portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [portfolioId, navigate]);

  // Restore the correct step when returning from Preview
  useEffect(() => {
    if (location.state?.step) {
      setStep(location.state.step);
    }
  }, [location.state]);

  const handleUpdate = async (updatedData) => {
    try {
      await updatePortfolio(portfolioId, updatedData);

      setPortfolio((prev) => ({
        ...prev,
        ...updatedData,
      }));
    } catch (error) {
      console.error("Error updating portfolio:", error);
    }
  };

  const goToStep = (newStep) => {
    if (newStep >= 1 && newStep <= steps.length) {
      setStep(newStep);
    }
  };

  const handlePreview = () => {
    navigate(`/preview/${portfolioId}`, {
      state: {
        from: "builder",
        step,
      },
    });
  };

  if (loading) {
    return (
      <div className="builder-loading">
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <div className="builder-page">

      {/* ================= HEADER ================= */}
      <header className="builder-header">
        <div className="builder-header-inner">

          <button
            type="button"
            className="builder-brand builder-dashboard-link"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <button
            type="button"
            className="builder-preview-button"
            onClick={handlePreview}
          >
            Preview
          </button>

        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="builder-main">

        {/* ================= HEADING ================= */}
        <div className="builder-heading">
          <h1>Portfolio Builder</h1>
          <p>
            Create and customize your professional portfolio.
          </p>
        </div>

        {/* ================= PROGRESS ================= */}
        <div className="builder-progress">

          <div className="builder-progress-top">

            <span className="builder-progress-label">
              {steps[step - 1]}
            </span>

            <span className="builder-progress-number">
              Step {step} of {steps.length}
            </span>

          </div>

          <div className="builder-progress-track">

            <div
              className="builder-progress-fill"
              style={{
                width: `${(step / steps.length) * 100}%`,
              }}
            />

          </div>

        </div>

        {/* ================= STEP INDICATORS ================= */}
        <div className="builder-steps">

          {steps.map((stepName, index) => {
            const stepNumber = index + 1;

            return (
              <button
                key={stepName}
                type="button"
                className={`builder-step ${
                  stepNumber === step
                    ? "active"
                    : stepNumber < step
                    ? "completed"
                    : ""
                }`}
                onClick={() => goToStep(stepNumber)}
              >

                <span className="builder-step-number">
                  {stepNumber}
                </span>

                <span className="builder-step-label">
                  {stepName}
                </span>

              </button>
            );
          })}

        </div>

        {/* ================= BUILDER CONTENT ================= */}
        <div className="builder-content">

          {step === 1 && (
            <PersonalInfo
              portfolio={portfolio}
              onUpdate={handleUpdate}
              onNext={() => goToStep(2)}
            />
          )}

          {step === 2 && (
            <AboutMe
              portfolio={portfolio}
              onUpdate={handleUpdate}
              onNext={() => goToStep(3)}
              onBack={() => goToStep(1)}
            />
          )}

          {step === 3 && (
            <Skills
              portfolio={portfolio}
              onUpdate={handleUpdate}
              onNext={() => goToStep(4)}
              onBack={() => goToStep(2)}
            />
          )}

          {step === 4 && (
            <Education
              portfolio={portfolio}
              onUpdate={handleUpdate}
              onNext={() => goToStep(5)}
              onBack={() => goToStep(3)}
            />
          )}

          {step === 5 && (
            <Experience
              portfolio={portfolio}
              onUpdate={handleUpdate}
              onNext={() => goToStep(6)}
              onBack={() => goToStep(4)}
            />
          )}

          {step === 6 && (
            <Projects
              portfolio={portfolio}
              onUpdate={handleUpdate}
              onNext={() => goToStep(7)}
              onBack={() => goToStep(5)}
            />
          )}

          {step === 7 && (
            <Certifications
              portfolio={portfolio}
              onUpdate={handleUpdate}
              onNext={() => goToStep(8)}
              onBack={() => goToStep(6)}
            />
          )}

          {step === 8 && (
            <SocialContact
              portfolio={portfolio}
              onUpdate={handleUpdate}
              onBack={() => goToStep(7)}
            />
          )}

        </div>

      </main>
    </div>
  );
};

export default PortfolioBuilder;