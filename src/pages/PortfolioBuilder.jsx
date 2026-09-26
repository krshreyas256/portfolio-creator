import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const PortfolioBuilder = () => {
  const { portfolioId } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

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

  const handleSave = async (data) => {
    try {
      await updatePortfolio(portfolioId, data);

      setPortfolio((previous) => ({
        ...previous,
        ...data,
      }));
    } catch (error) {
      console.error("Error saving portfolio:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading portfolio...
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="dashboard-loading">
        Portfolio not found.
      </div>
    );
  }

  const progress = (step / 8) * 100;

  return (
    <div className="builder-page">

      {/* Header */}
      <header className="builder-header">
        <div className="builder-header-inner">

          <a
            href="/dashboard"
            className="builder-brand"
          >
            Portfolio Creator
          </a>

          <button
            type="button"
            className="builder-preview-button"
            onClick={() =>
              navigate(`/preview/${portfolioId}`)
            }
          >
            Preview
          </button>

        </div>
      </header>


      {/* Main */}
      <main className="builder-main">

        {/* Heading */}
        <div className="builder-heading">
          <h1>Create Your Portfolio</h1>

          <p>
            Build your professional portfolio step by step.
            You can preview your portfolio at any time.
          </p>
        </div>


        {/* Progress */}
        <section className="builder-progress">

          <div className="builder-progress-top">

            <span className="builder-progress-label">
              {steps[step - 1]}
            </span>

            <span className="builder-progress-number">
              Step {step} of 8
            </span>

          </div>


          <div className="builder-progress-track">
            <div
              className="builder-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>


          <div className="builder-steps">

            {steps.map((stepName, index) => {

              const stepNumber = index + 1;

              const className =
                stepNumber === step
                  ? "builder-step active"
                  : stepNumber < step
                  ? "builder-step completed"
                  : "builder-step";

              return (
                <div
                  className={className}
                  key={stepName}
                >
                  <div className="builder-step-number">
                    {stepNumber}
                  </div>

                  <div className="builder-step-label">
                    {stepName}
                  </div>
                </div>
              );
            })}

          </div>

        </section>


        {/* Form */}
        <section className="builder-form-card">

          {step === 1 && (
            <PersonalInfo
              portfolio={portfolio}
              onSave={handleSave}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <AboutMe
              portfolio={portfolio}
              onSave={handleSave}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <Skills
              portfolio={portfolio}
              onSave={handleSave}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <Education
              portfolio={portfolio}
              onSave={handleSave}
              onNext={() => setStep(5)}
              onBack={() => setStep(3)}
            />
          )}

          {step === 5 && (
            <Experience
              portfolio={portfolio}
              onSave={handleSave}
              onNext={() => setStep(6)}
              onBack={() => setStep(4)}
            />
          )}

          {step === 6 && (
            <Projects
              portfolio={portfolio}
              onSave={handleSave}
              onNext={() => setStep(7)}
              onBack={() => setStep(5)}
            />
          )}

          {step === 7 && (
            <Certifications
              portfolio={portfolio}
              onSave={handleSave}
              onNext={() => setStep(8)}
              onBack={() => setStep(6)}
            />
          )}

          {step === 8 && (
            <SocialContact
              portfolio={portfolio}
              onSave={handleSave}
              onBack={() => setStep(7)}
            />
          )}

        </section>

      </main>

    </div>
  );
};

export default PortfolioBuilder;