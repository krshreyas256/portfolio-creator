import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getPortfolio,
  updatePortfolio,
} from "../firebase/firestore";

import PersonalInfo from "../components/builder/PersonalInfo";

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
        Step {step} of 7
      </p>

      {step === 1 && (
        <PersonalInfo
          portfolio={portfolio}
          onSave={handleSave}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <div>
          <h2>About Me</h2>

          <p>
            We'll build this section next.
          </p>
        </div>
      )}
    </div>
  );
};

export default PortfolioBuilder;