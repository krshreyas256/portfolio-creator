import { useState } from "react";

const Skills = ({ portfolio, onSave, onNext, onBack }) => {
  const [skills, setSkills] = useState(portfolio.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) {
      return;
    }

    if (skills.includes(skill)) {
      return;
    }

    setSkills([...skills, skill]);
    setNewSkill("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills(
      skills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      await onSave({
        skills,
      });

      onNext();
    } catch (error) {
      console.error("Error saving skills:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Skills</h2>

      <p>
        Add the skills you want to showcase on your portfolio.
      </p>

      <div>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Python"
        />

        <button type="button" onClick={addSkill}>
          Add
        </button>
      </div>

      <div>
        {skills.map((skill) => (
          <span key={skill}>
            {skill}

            <button
              type="button"
              onClick={() => removeSkill(skill)}
            >
              ×
            </button>
          </span>
        ))}
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

export default Skills;