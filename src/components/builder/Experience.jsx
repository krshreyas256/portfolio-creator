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

const Experience = ({
  portfolio,
  onSave,
  onNext,
  onBack,
}) => {
  const [experience, setExperience] = useState(
    portfolio.experience || []
  );

  const [saving, setSaving] = useState(false);

  const addExperience = () => {
    setExperience((previous) => [
      ...previous,
      { ...emptyExperience },
    ]);
  };

  const updateExperience = (index, field, value) => {
    setExperience((previous) => {
      const updated = [...previous];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  const removeExperience = (index) => {
    setExperience((previous) =>
      previous.filter(
        (_, experienceIndex) =>
          experienceIndex !== index
      )
    );
  };

  const handleCurrentChange = (index, checked) => {
    setExperience((previous) => {
      const updated = [...previous];

      updated[index] = {
        ...updated[index],
        current: checked,
        endDate: checked
          ? ""
          : updated[index].endDate,
      };

      return updated;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      await onSave({
        experience,
      });

      onNext();
    } catch (error) {
      console.error(
        "Error saving experience:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2>Experience</h2>

      <p>
        Add your professional experience, internships,
        freelance work, or other relevant roles.
      </p>


      {/* Experience entries */}

      {experience.length === 0 ? (

        <div className="builder-empty-section">

          <div className="builder-empty-icon">
            💼
          </div>

          <h3>No experience added yet</h3>

          <p>
            Add your work experience, internship, or
            professional role.
          </p>

          <button
            type="button"
            onClick={addExperience}
          >
            + Add Experience
          </button>

        </div>

      ) : (

        <div className="builder-repeat-list">

          {experience.map((item, index) => (

            <div
              className="builder-repeat-card"
              key={index}
            >

              {/* Card header */}

              <div className="builder-repeat-header">

                <div>

                  <h3>
                    Experience {index + 1}
                  </h3>

                  <span>
                    Professional experience
                  </span>

                </div>

                <button
                  type="button"
                  className="builder-remove-button"
                  onClick={() =>
                    removeExperience(index)
                  }
                >
                  Remove
                </button>

              </div>


              {/* Job title */}

              <div className="builder-field">

                <label
                  htmlFor={`job-title-${index}`}
                >
                  Job Title / Role
                </label>

                <input
                  id={`job-title-${index}`}
                  type="text"
                  placeholder="e.g. Software Developer"
                  value={item.jobTitle}
                  onChange={(event) =>
                    updateExperience(
                      index,
                      "jobTitle",
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              {/* Company */}

              <div className="builder-field">

                <label
                  htmlFor={`company-${index}`}
                >
                  Company / Organization
                </label>

                <input
                  id={`company-${index}`}
                  type="text"
                  placeholder="e.g. ABC Technologies"
                  value={item.company}
                  onChange={(event) =>
                    updateExperience(
                      index,
                      "company",
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              {/* Location */}

              <div className="builder-field">

                <label
                  htmlFor={`experience-location-${index}`}
                >
                  Location
                  <span className="builder-optional">
                    Optional
                  </span>
                </label>

                <input
                  id={`experience-location-${index}`}
                  type="text"
                  placeholder="e.g. Bengaluru, India"
                  value={item.location}
                  onChange={(event) =>
                    updateExperience(
                      index,
                      "location",
                      event.target.value
                    )
                  }
                />

              </div>


              {/* Dates */}

              <div className="builder-field-grid">

                <div className="builder-field">

                  <label
                    htmlFor={`start-date-${index}`}
                  >
                    Start Date
                  </label>

                  <input
                    id={`start-date-${index}`}
                    type="text"
                    placeholder="e.g. June 2025"
                    value={item.startDate}
                    onChange={(event) =>
                      updateExperience(
                        index,
                        "startDate",
                        event.target.value
                      )
                    }
                  />

                </div>


                <div className="builder-field">

                  <label
                    htmlFor={`end-date-${index}`}
                  >
                    End Date
                  </label>

                  <input
                    id={`end-date-${index}`}
                    type="text"
                    placeholder="e.g. August 2026"
                    value={item.endDate}
                    onChange={(event) =>
                      updateExperience(
                        index,
                        "endDate",
                        event.target.value
                      )
                    }
                    disabled={item.current}
                  />

                </div>

              </div>


              {/* Current position */}

              <label className="builder-checkbox">

                <input
                  type="checkbox"
                  checked={item.current || false}
                  onChange={(event) =>
                    handleCurrentChange(
                      index,
                      event.target.checked
                    )
                  }
                />

                <span>
                  I currently work here
                </span>

              </label>


              {/* Description */}

              <div className="builder-field">

                <label
                  htmlFor={`experience-description-${index}`}
                >
                  Description
                  <span className="builder-optional">
                    Optional
                  </span>
                </label>

                <textarea
                  id={`experience-description-${index}`}
                  placeholder="Describe your responsibilities, achievements, projects, or contributions."
                  value={item.description}
                  onChange={(event) =>
                    updateExperience(
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


      {/* Add another */}

      {experience.length > 0 && (
        <button
          type="button"
          className="builder-add-button"
          onClick={addExperience}
        >
          + Add Another Experience
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

export default Experience;