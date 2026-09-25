import { useState } from "react";

const emptyEducation = {
  degree: "",
  institution: "",
  startYear: "",
  endYear: "",
  description: "",
};

const Education = ({ portfolio, onSave, onNext, onBack }) => {
  const [education, setEducation] = useState(
    portfolio.education || []
  );

  const [saving, setSaving] = useState(false);

  const addEducation = () => {
    setEducation([...education, { ...emptyEducation }]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...education];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setEducation(updated);
  };

  const removeEducation = (index) => {
    setEducation(
      education.filter((_, educationIndex) => educationIndex !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      await onSave({
        education,
      });

      onNext();
    } catch (error) {
      console.error("Error saving education:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Education</h2>

      <p>
        Add your educational background.
      </p>

      {education.map((item, index) => (
        <div key={index}>
          <h3>Education {index + 1}</h3>

          <input
            type="text"
            placeholder="Degree / Course"
            value={item.degree}
            onChange={(e) =>
              updateEducation(index, "degree", e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Institution"
            value={item.institution}
            onChange={(e) =>
              updateEducation(
                index,
                "institution",
                e.target.value
              )
            }
            required
          />

          <input
            type="text"
            placeholder="Start Year"
            value={item.startYear}
            onChange={(e) =>
              updateEducation(
                index,
                "startYear",
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="End Year"
            value={item.endYear}
            onChange={(e) =>
              updateEducation(
                index,
                "endYear",
                e.target.value
              )
            }
          />

          <textarea
            placeholder="Description (optional)"
            value={item.description}
            onChange={(e) =>
              updateEducation(
                index,
                "description",
                e.target.value
              )
            }
          />

          <button
            type="button"
            onClick={() => removeEducation(index)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
      >
        + Add Education
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

export default Education;