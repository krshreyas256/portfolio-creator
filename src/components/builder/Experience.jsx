import { useState } from "react";

const emptyExperience = {
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
};

const Experience = ({ portfolio, onSave, onNext, onBack }) => {
  const [experience, setExperience] = useState(
    portfolio.experience || []
  );

  const [saving, setSaving] = useState(false);

  const addExperience = () => {
    setExperience([
      ...experience,
      { ...emptyExperience },
    ]);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experience];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setExperience(updated);
  };

  const removeExperience = (index) => {
    setExperience(
      experience.filter(
        (_, experienceIndex) => experienceIndex !== index
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      await onSave({
        experience,
      });

      onNext();
    } catch (error) {
      console.error("Error saving experience:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Work Experience</h2>

      <p>
        Add your professional experience.
      </p>

      {experience.map((item, index) => (
        <div key={index}>
          <h3>Experience {index + 1}</h3>

          <input
            type="text"
            placeholder="Job Title"
            value={item.jobTitle}
            onChange={(e) =>
              updateExperience(
                index,
                "jobTitle",
                e.target.value
              )
            }
            required
          />

          <input
            type="text"
            placeholder="Company"
            value={item.company}
            onChange={(e) =>
              updateExperience(
                index,
                "company",
                e.target.value
              )
            }
            required
          />

          <input
            type="text"
            placeholder="Location"
            value={item.location}
            onChange={(e) =>
              updateExperience(
                index,
                "location",
                e.target.value
              )
            }
          />

          <label>
            Start Date
          </label>

          <input
            type="month"
            value={item.startDate}
            onChange={(e) =>
              updateExperience(
                index,
                "startDate",
                e.target.value
              )
            }
          />

          <label>
            End Date
          </label>

          <input
            type="month"
            value={item.endDate}
            onChange={(e) =>
              updateExperience(
                index,
                "endDate",
                e.target.value
              )
            }
            disabled={item.current}
          />

          <label>
            <input
              type="checkbox"
              checked={item.current}
              onChange={(e) =>
                updateExperience(
                  index,
                  "current",
                  e.target.checked
                )
              }
            />

            I currently work here
          </label>

          <textarea
            placeholder="Describe your responsibilities and achievements..."
            value={item.description}
            onChange={(e) =>
              updateExperience(
                index,
                "description",
                e.target.value
              )
            }
          />

          <button
            type="button"
            onClick={() => removeExperience(index)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
      >
        + Add Experience
      </button>

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

export default Experience;