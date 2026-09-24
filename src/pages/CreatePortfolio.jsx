import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { createPortfolio } from "../firebase/firestore";

const CreatePortfolio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!user) return;

    setCreating(true);
    setError("");

    try {
      const portfolioId = await createPortfolio(user.uid);

      navigate(`/create/${portfolioId}`);
    } catch (error) {
      console.error(error);
      setError("Unable to create portfolio. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h1>Create Your Portfolio</h1>

      <p>
        Build your professional portfolio and publish it online.
      </p>

      {error && <p>{error}</p>}

      <button onClick={handleCreate} disabled={creating}>
        {creating ? "Creating..." : "Start Building"}
      </button>
    </div>
  );
};

export default CreatePortfolio;