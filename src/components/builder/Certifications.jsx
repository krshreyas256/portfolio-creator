import { useState } from "react";

const emptyCertification = {
  name: "",
  organization: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
};

const Certifications = ({
  portfolio,
  onSave,
  onNext,
  onBack,
}) => {
  const [certifications, setCertifications] = useState(
    portfolio.certifications || []
  );

  const [saving, setSaving] = useState(false);

  const addCertification = () => {
    setCertifications((previous) => [
      ...previous,
      { ...emptyCertification },
    ]);
  };

  const updateCertification = (
    index,
    field,
    value
  ) => {
    setCertifications((previous) => {
      const updated = [...previous];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  const removeCertification = (index) => {
    setCertifications((previous) =>
      previous.filter(
        (_, certificationIndex) =>
          certificationIndex !== index
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      await onSave({
        certifications,
      });

      onNext();
    } catch (error) {
      console.error(
        "Error saving certifications:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2>Certifications</h2>

      <p>
        Add certifications, courses, and professional
        credentials that strengthen your portfolio.
      </p>


      {/* Empty state */}

      {certifications.length === 0 ? (

        <div className="builder-empty-section">

          <div className="builder-empty-icon">
            🏆
          </div>

          <h3>No certifications added yet</h3>

          <p>
            Add your professional certifications,
            courses, or credentials.
          </p>

          <button
            type="button"
            onClick={addCertification}
          >
            + Add Certification
          </button>

        </div>

      ) : (

        <div className="builder-repeat-list">

          {certifications.map(
            (certification, index) => (

              <div
                className="builder-repeat-card"
                key={index}
              >

                {/* Header */}

                <div className="builder-repeat-header">

                  <div>

                    <h3>
                      Certification {index + 1}
                    </h3>

                    <span>
                      Professional credential
                    </span>

                  </div>

                  <button
                    type="button"
                    className="builder-remove-button"
                    onClick={() =>
                      removeCertification(index)
                    }
                  >
                    Remove
                  </button>

                </div>


                {/* Certification name */}

                <div className="builder-field">

                  <label
                    htmlFor={`certification-name-${index}`}
                  >
                    Certification Name
                  </label>

                  <input
                    id={`certification-name-${index}`}
                    type="text"
                    placeholder="e.g. Machine Learning Foundation"
                    value={certification.name}
                    onChange={(event) =>
                      updateCertification(
                        index,
                        "name",
                        event.target.value
                      )
                    }
                    required
                  />

                </div>


                {/* Organization */}

                <div className="builder-field">

                  <label
                    htmlFor={`certification-org-${index}`}
                  >
                    Issuing Organization
                  </label>

                  <input
                    id={`certification-org-${index}`}
                    type="text"
                    placeholder="e.g. Infosys Springboard"
                    value={certification.organization}
                    onChange={(event) =>
                      updateCertification(
                        index,
                        "organization",
                        event.target.value
                      )
                    }
                    required
                  />

                </div>


                {/* Issue date */}

                <div className="builder-field">

                  <label
                    htmlFor={`issue-date-${index}`}
                  >
                    Issue Date
                  </label>

                  <input
                    id={`issue-date-${index}`}
                    type="text"
                    placeholder="e.g. August 2026"
                    value={certification.issueDate}
                    onChange={(event) =>
                      updateCertification(
                        index,
                        "issueDate",
                        event.target.value
                      )
                    }
                  />

                </div>


                {/* Credential ID */}

                <div className="builder-field">

                  <label
                    htmlFor={`credential-id-${index}`}
                  >
                    Credential ID
                    <span className="builder-optional">
                      Optional
                    </span>
                  </label>

                  <input
                    id={`credential-id-${index}`}
                    type="text"
                    placeholder="e.g. ABC123456"
                    value={certification.credentialId}
                    onChange={(event) =>
                      updateCertification(
                        index,
                        "credentialId",
                        event.target.value
                      )
                    }
                  />

                </div>


                {/* Credential URL */}

                <div className="builder-field">

                  <label
                    htmlFor={`credential-url-${index}`}
                  >
                    Credential URL
                    <span className="builder-optional">
                      Optional
                    </span>
                  </label>

                  <input
                    id={`credential-url-${index}`}
                    type="url"
                    placeholder="https://..."
                    value={certification.credentialUrl}
                    onChange={(event) =>
                      updateCertification(
                        index,
                        "credentialUrl",
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>

            )
          )}

        </div>

      )}


      {/* Add another */}

      {certifications.length > 0 && (
        <button
          type="button"
          className="builder-add-button"
          onClick={addCertification}
        >
          + Add Another Certification
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

export default Certifications;