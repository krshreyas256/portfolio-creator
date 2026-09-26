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
    return <p>Loading portfolio...</p>;
  }

  if (!portfolio) {
    return <p>Portfolio not found.</p>;
  }

  return (
    <div>
      <h1>Create Your Portfolio</h1>

      <p>Step {step} of 8</p>

      {/* Preview Button */}
      <button
        type="button"
        onClick={() => navigate(`/preview/${portfolioId}`)}
      >
        Preview Portfolio
      </button>

      {/* Step 1 - Personal Information */}
      {step === 1 && (
        <PersonalInfo
          portfolio={portfolio}
          onSave={handleSave}
          onNext={() => setStep(2)}
        />
      )}

      {/* Step 2 - About Me */}
      {step === 2 && (
        <AboutMe
          portfolio={portfolio}
          onSave={handleSave}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {/* Step 3 - Skills */}
      {step === 3 && (
        <Skills
          portfolio={portfolio}
          onSave={handleSave}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {/* Step 4 - Education */}
      {step === 4 && (
        <Education
          portfolio={portfolio}
          onSave={handleSave}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}

      {/* Step 5 - Experience */}
      {step === 5 && (
        <Experience
          portfolio={portfolio}
          onSave={handleSave}
          onNext={() => setStep(6)}
          onBack={() => setStep(4)}
        />
      )}

      {/* Step 6 - Projects */}
      {step === 6 && (
        <Projects
          portfolio={portfolio}
          onSave={handleSave}
          onNext={() => setStep(7)}
          onBack={() => setStep(5)}
        />
      )}

      {/* Step 7 - Certifications */}
      {step === 7 && (
        <Certifications
          portfolio={portfolio}
          onSave={handleSave}
          onNext={() => setStep(8)}
          onBack={() => setStep(6)}
        />
      )}

      {/* Step 8 - Social Links & Contact */}
      {step === 8 && (
        <SocialContact
          portfolio={portfolio}
          onSave={handleSave}
          onBack={() => setStep(7)}
        />
      )}
    </div>
  );
};

export default PortfolioBuilder;