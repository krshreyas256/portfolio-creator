import { useState } from "react";

const PersonalInfo = ({ portfolio, onSave, onNext }) => {
  const [name, setName] = useState(portfolio.personal?.name || "");
  const [title, setTitle] = useState(portfolio.personal?.title || "");
  const [location, setLocation] = useState(
    portfolio.personal?.location || ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSave({
      personal: {
        ...portfolio.personal,
        name,
        title,
        location,
      },
    });

    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Personal Information</h2>

      <p>
        Tell us a little about yourself.
      </p>

      <div>
        <label>Full Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Shreyas Acharya"
          required
        />
      </div>

      <div>
        <label>Professional Title</label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Software Developer"
          required
        />
      </div>

      <div>
        <label>Location</label>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Bengaluru, India"
        />
      </div>

      <button type="submit">
        Save & Continue
      </button>
    </form>
  );
};

export default PersonalInfo;