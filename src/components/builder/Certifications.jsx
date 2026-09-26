import { useState } from "react";

const Certifications = ({ portfolio, onSave, onNext, onBack }) => {
  const [certifications, setCertifications] = useState(
    portfolio.certifications || []
  );

  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    const updatedCertifications = [...certifications];

    updatedCertifications[index][field] = value;

    setCertifications(updatedCertifications);
  };

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: "",
        organization: "",
        issueDate: "",
        credentialId: "",
        credentialUrl: "",
      },
    ]);
  };

  const removeCertification = (index) => {
    const updatedCertifications = certifications.filter(
      (_, certificationIndex) => certificationIndex !== index
    );

    setCertifications(updatedCertifications);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      await onSave({
        certifications,
      });

      onNext();
    } catch (error) {
      console.error("Error saving certifications:", error);
      setError("Unable to save certifications. Please try again.");
    }
  };

  return (
    <div>
      <h2>Certifications</h2>

      <p>
        Add certifications, courses, and other professional credentials
        you have completed.
      </p>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        {certifications.length === 0 && (
          <p>No certifications added yet.</p>
        )}

        {certifications.map((certification, index) => (
          <div key={index}>
            <h3>Certification {index + 1}</h3>

            <div>
              <label>Certification Name</label>

              <input
                type="text"
                value={certification.name}
                onChange={(event) =>
                  handleChange(index, "name", event.target.value)
                }
                placeholder="e.g. Machine Learning Foundation"
                required
              />
            </div>

            <div>
              <label>Issuing Organization</label>

              <input
                type="text"
                value={certification.organization}
                onChange={(event) =>
                  handleChange(
                    index,
                    "organization",
                    event.target.value
                  )
                }
                placeholder="e.g. Infosys Springboard"
                required
              />
            </div>

            <div>
              <label>Issue Date</label>

              <input
                type="month"
                value={certification.issueDate}
                onChange={(event) =>
                  handleChange(
                    index,
                    "issueDate",
                    event.target.value
                  )
                }
              />
            </div>

            <div>
              <label>Credential ID</label>

              <input
                type="text"
                value={certification.credentialId}
                onChange={(event) =>
                  handleChange(
                    index,
                    "credentialId",
                    event.target.value
                  )
                }
                placeholder="Optional"
              />
            </div>

            <div>
              <label>Credential URL</label>

              <input
                type="url"
                value={certification.credentialUrl}
                onChange={(event) =>
                  handleChange(
                    index,
                    "credentialUrl",
                    event.target.value
                  )
                }
                placeholder="https://..."
              />
            </div>

            <button
              type="button"
              onClick={() => removeCertification(index)}
            >
              Remove Certification
            </button>

            <hr />
          </div>
        ))}

        <button type="button" onClick={addCertification}>
          + Add Certification
        </button>

        <div>
          <button type="button" onClick={onBack}>
            Back
          </button>

          <button type="submit">
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default Certifications;