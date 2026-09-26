import { useState } from "react";

const SocialContact = ({
  portfolio,
  onSave,
  onBack,
}) => {
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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateSocialLink = (field, value) => {
    setSocialLinks((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const updateContact = (field, value) => {
    setContact((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await onSave({
        socialLinks,
        contact,
      });
    } catch (error) {
      console.error(
        "Error saving social and contact information:",
        error
      );

      setError(
        "Unable to save your information. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2>Social & Contact</h2>

      <p>
        Add ways for visitors to connect with you and
        explore your professional profiles.
      </p>

      {error && (
        <div className="builder-error">
          {error}
        </div>
      )}


      {/* Contact Information */}

      <div className="builder-section-block">

        <div className="builder-section-heading">
          <div className="builder-section-icon">
            ✉️
          </div>

          <div>
            <h3>Contact Information</h3>

            <p>
              Let visitors know how they can reach you.
            </p>
          </div>
        </div>


        <div className="builder-field">

          <label htmlFor="contact-email">
            Email Address
          </label>

          <input
            id="contact-email"
            type="email"
            placeholder="e.g. hello@example.com"
            value={contact.email}
            onChange={(event) =>
              updateContact(
                "email",
                event.target.value
              )
            }
          />

        </div>


        <div className="builder-field">

          <label htmlFor="contact-phone">
            Phone Number
            <span className="builder-optional">
              Optional
            </span>
          </label>

          <input
            id="contact-phone"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            value={contact.phone}
            onChange={(event) =>
              updateContact(
                "phone",
                event.target.value
              )
            }
          />

        </div>

      </div>


      {/* Social Links */}

      <div className="builder-section-block">

        <div className="builder-section-heading">
          <div className="builder-section-icon">
            🔗
          </div>

          <div>
            <h3>Social Profiles</h3>

            <p>
              Add links to your professional and social
              profiles.
            </p>
          </div>
        </div>


        {/* GitHub */}

        <div className="builder-field">

          <label htmlFor="github">
            GitHub
            <span className="builder-optional">
              Optional
            </span>
          </label>

          <input
            id="github"
            type="url"
            placeholder="https://github.com/username"
            value={socialLinks.github}
            onChange={(event) =>
              updateSocialLink(
                "github",
                event.target.value
              )
            }
          />

        </div>


        {/* LinkedIn */}

        <div className="builder-field">

          <label htmlFor="linkedin">
            LinkedIn
            <span className="builder-optional">
              Optional
            </span>
          </label>

          <input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/username"
            value={socialLinks.linkedin}
            onChange={(event) =>
              updateSocialLink(
                "linkedin",
                event.target.value
              )
            }
          />

        </div>


        {/* Twitter */}

        <div className="builder-field">

          <label htmlFor="twitter">
            X / Twitter
            <span className="builder-optional">
              Optional
            </span>
          </label>

          <input
            id="twitter"
            type="url"
            placeholder="https://x.com/username"
            value={socialLinks.twitter}
            onChange={(event) =>
              updateSocialLink(
                "twitter",
                event.target.value
              )
            }
          />

        </div>


        {/* Instagram */}

        <div className="builder-field">

          <label htmlFor="instagram">
            Instagram
            <span className="builder-optional">
              Optional
            </span>
          </label>

          <input
            id="instagram"
            type="url"
            placeholder="https://instagram.com/username"
            value={socialLinks.instagram}
            onChange={(event) =>
              updateSocialLink(
                "instagram",
                event.target.value
              )
            }
          />

        </div>

      </div>


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
            : "Save Portfolio"}
        </button>

      </div>

    </form>
  );
};

export default SocialContact;