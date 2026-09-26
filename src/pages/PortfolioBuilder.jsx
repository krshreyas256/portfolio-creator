import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

const PortfolioBuilder = () => {
  const { portfolioId } = useParams();

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

      <p>
        Step {step} of 8
      </p>

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


    </div>
  );
};

export default PortfolioBuilder;