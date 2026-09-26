import { useState } from "react";

const SocialContact = ({ portfolio, onSave, onBack }) => {
  const [socialLinks, setSocialLinks] = useState(
    portfolio.socialLinks || {
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
    }
  );

  const [contact, setContact] = useState(
    portfolio.contact || {
      email: "",
      phone: "",
    }
  );

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSocialChange = (field, value) => {
    setSocialLinks((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleContactChange = (field, value) => {
    setContact((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setSaved(false);

      await onSave({
        socialLinks,
        contact,
      });

      setSaved(true);
    } catch (error) {
      console.error("Error saving social links and contact:", error);
      setError("Unable to save your information. Please try again.");
    }
  };

  return (
    <div>
      <h2>Social Links & Contact</h2>

      <p>
        Add your social profiles and contact information so visitors
        can connect with you.
      </p>

      {error && <p>{error}</p>}

      {saved && <p>Information saved successfully.</p>}

      <form onSubmit={handleSubmit}>
        <h3>Social Links</h3>

        <div>
          <label>GitHub</label>

          <input
            type="url"
            value={socialLinks.github}
            onChange={(event) =>
              handleSocialChange("github", event.target.value)
            }
            placeholder="https://github.com/username"
          />
        </div>

        <div>
          <label>LinkedIn</label>

          <input
            type="url"
            value={socialLinks.linkedin}
            onChange={(event) =>
              handleSocialChange("linkedin", event.target.value)
            }
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <label>Twitter / X</label>

          <input
            type="url"
            value={socialLinks.twitter}
            onChange={(event) =>
              handleSocialChange("twitter", event.target.value)
            }
            placeholder="https://x.com/username"
          />
        </div>

        <div>
          <label>Instagram</label>

          <input
            type="url"
            value={socialLinks.instagram}
            onChange={(event) =>
              handleSocialChange("instagram", event.target.value)
            }
            placeholder="https://instagram.com/username"
          />
        </div>

        <hr />

        <h3>Contact Information</h3>

        <div>
          <label>Email</label>

          <input
            type="email"
            value={contact.email}
            onChange={(event) =>
              handleContactChange("email", event.target.value)
            }
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label>Phone</label>

          <input
            type="tel"
            value={contact.phone}
            onChange={(event) =>
              handleContactChange("phone", event.target.value)
            }
            placeholder="+91 9876543210"
          />
        </div>

        <div>
          <button type="button" onClick={onBack}>
            Back
          </button>

          <button type="submit">
            Save Portfolio
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialContact;