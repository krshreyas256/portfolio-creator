import { useState } from "react";

const AboutMe = ({ portfolio, onSave, onNext, onBack }) => {
  const [about, setAbout] = useState(portfolio.about || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      await onSave({
        about,
      });

      onNext();
    } catch (error) {
      console.error("Error saving About Me:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>About Me</h2>

      <p>
        Tell visitors about yourself, your background, interests,
        and what you do.
      </p>

      <div>
        <label htmlFor="about">About You</label>

        <textarea
          id="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Write a short introduction about yourself..."
          rows="8"
          maxLength="1000"
          required
        />

        <small>{about.length}/1000</small>
      </div>

      <div>
        <button type="button" onClick={onBack}>
          Back
        </button>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </form>
  );
};

export default AboutMe;