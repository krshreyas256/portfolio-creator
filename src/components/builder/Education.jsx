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
    setEducation((previous) => [
      ...previous,
      { ...emptyEducation },
    ]);
  };

  const updateEducation = (index, field, value) => {
    setEducation((previous) => {
      const updated = [...previous];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  const removeEducation = (index) => {
    setEducation((previous) =>
      previous.filter(
        (_, educationIndex) => educationIndex !== index
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        Add your educational background, degrees, courses,
        and academic achievements.
      </p>


      {/* Education entries */}
      {education.length === 0 ? (
        <div className="builder-empty-section">
          <div className="builder-empty-icon">🎓</div>

          <h3>No education added yet</h3>

          <p>
            Add your degree, course, or other educational
            qualifications.
          </p>

          <button
            type="button"
            onClick={addEducation}
          >
            + Add Education
          </button>
        </div>
      ) : (
        <div className="builder-repeat-list">

          {education.map((item, index) => (

            <div
              className="builder-repeat-card"
              key={index}
            >

              <div className="builder-repeat-header">

                <div>
                  <h3>
                    Education {index + 1}
                  </h3>

                  <span>
                    Academic qualification
                  </span>
                </div>

                <button
                  type="button"
                  className="builder-remove-button"
                  onClick={() =>
                    removeEducation(index)
                  }
                >
                  Remove
                </button>

              </div>


              {/* Degree */}
              <div className="builder-field">

                <label htmlFor={`degree-${index}`}>
                  Degree / Course
                </label>

                <input
                  id={`degree-${index}`}
                  type="text"
                  placeholder="e.g. Master of Computer Applications"
                  value={item.degree}
                  onChange={(event) =>
                    updateEducation(
                      index,
                      "degree",
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              {/* Institution */}
              <div className="builder-field">

                <label htmlFor={`institution-${index}`}>
                  Institution
                </label>

                <input
                  id={`institution-${index}`}
                  type="text"
                  placeholder="e.g. RNS Institute of Technology"
                  value={item.institution}
                  onChange={(event) =>
                    updateEducation(
                      index,
                      "institution",
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              {/* Years */}
              <div className="builder-field-grid">

                <div className="builder-field">

                  <label htmlFor={`start-year-${index}`}>
                    Start Year
                  </label>

                  <input
                    id={`start-year-${index}`}
                    type="text"
                    placeholder="e.g. 2024"
                    value={item.startYear}
                    onChange={(event) =>
                      updateEducation(
                        index,
                        "startYear",
                        event.target.value
                      )
                    }
                  />

                </div>


                <div className="builder-field">

                  <label htmlFor={`end-year-${index}`}>
                    End Year
                  </label>

                  <input
                    id={`end-year-${index}`}
                    type="text"
                    placeholder="e.g. 2026"
                    value={item.endYear}
                    onChange={(event) =>
                      updateEducation(
                        index,
                        "endYear",
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>


              {/* Description */}
              <div className="builder-field">

                <label htmlFor={`education-description-${index}`}>
                  Description
                  <span className="builder-optional">
                    Optional
                  </span>
                </label>

                <textarea
                  id={`education-description-${index}`}
                  placeholder="Add relevant details about your studies, achievements, coursework, etc."
                  value={item.description}
                  onChange={(event) =>
                    updateEducation(
                      index,
                      "description",
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

          ))}

        </div>
      )}


      {/* Add another education */}
      {education.length > 0 && (
        <button
          type="button"
          className="builder-add-button"
          onClick={addEducation}
        >
          + Add Another Education
        </button>
      )}


      {/* Navigation */}
      <div className="builder-navigation">

        <button
          type="button"
          onClick={onBack}
        >
          ← Back
        </button>

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save & Continue →"}
        </button>

      </div>

    </form>
  );
};

export default Education;