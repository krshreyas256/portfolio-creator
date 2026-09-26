import { useState } from "react";
import { uploadImage } from "../../cloudinary/uploadImage";

const PersonalInfo = ({ portfolio, onSave, onNext }) => {
  const [personal, setPersonal] = useState(
    portfolio.personal || {
      name: "",
      title: "",
      profileImage: "",
      location: "",
    }
  );

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setPersonal((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const imageUrl = await uploadImage(file);

      setPersonal((previous) => ({
        ...previous,
        profileImage: imageUrl,
      }));
    } catch (error) {
      console.error("Profile image upload error:", error);
      setError("Unable to upload profile image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!personal.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!personal.title.trim()) {
      setError("Please enter your professional title.");
      return;
    }

    try {
      setError("");

      await onSave({
        personal,
      });

      onNext();
    } catch (error) {
      console.error("Error saving personal information:", error);
      setError("Unable to save your information. Please try again.");
    }
  };

  return (
    <div>
      <h2>Personal Information</h2>

      <p>
        Tell visitors who you are and how they can identify you
        professionally.
      </p>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>

          <input
            type="text"
            value={personal.name}
            onChange={(event) =>
              handleChange("name", event.target.value)
            }
            placeholder="e.g. Shreyas Acharya"
            required
          />
        </div>

        <div>
          <label>Professional Title</label>

          <input
            type="text"
            value={personal.title}
            onChange={(event) =>
              handleChange("title", event.target.value)
            }
            placeholder="e.g. Software Developer"
            required
          />
        </div>

        <div>
          <label>Location</label>

          <input
            type="text"
            value={personal.location}
            onChange={(event) =>
              handleChange("location", event.target.value)
            }
            placeholder="e.g. Bengaluru, India"
          />
        </div>

        <div>
          <label>Profile Picture</label>

          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              handleImageUpload(event.target.files[0])
            }
            disabled={uploading}
          />

          {uploading && <p>Uploading profile picture...</p>}

          {personal.profileImage && (
            <div>
              <img
                src={personal.profileImage}
                alt="Profile preview"
                width="180"
                height="180"
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
          )}
        </div>

        <div>
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Save & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;