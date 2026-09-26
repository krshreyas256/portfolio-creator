import { useState } from "react";
import { uploadImage } from "../../cloudinary/uploadImage";

const emptyProject = {
  name: "",
  description: "",
  technologies: [],
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
};

const Projects = ({
  portfolio,
  onSave,
  onNext,
  onBack,
}) => {
  const [projects, setProjects] = useState(
    portfolio.projects || []
  );

  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [error, setError] = useState("");

  const addProject = () => {
    setProjects((previous) => [
      ...previous,
      { ...emptyProject },
    ]);
  };

  const updateProject = (index, field, value) => {
    setProjects((previous) => {
      const updated = [...previous];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });

    setError("");
  };

  const removeProject = (index) => {
    setProjects((previous) =>
      previous.filter(
        (_, projectIndex) => projectIndex !== index
      )
    );
  };

  const handleTechnologyChange = (index, value) => {
    const technologies = value
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean);

    updateProject(
      index,
      "technologies",
      technologies
    );
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    setError("");
    setUploadingIndex(index);

    try {
      const imageUrl = await uploadImage(file);

      updateProject(
        index,
        "imageUrl",
        imageUrl
      );
    } catch (error) {
      console.error(
        "Project image upload error:",
        error
      );

      setError(
        "Unable to upload project image. Please try again."
      );
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await onSave({
        projects,
      });

      onNext();
    } catch (error) {
      console.error(
        "Error saving projects:",
        error
      );

      setError(
        "Unable to save your projects. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2>Projects</h2>

      <p>
        Showcase the projects that best demonstrate your
        skills, experience, and achievements.
      </p>


      {/* Error */}

      {error && (
        <div className="builder-error">
          {error}
        </div>
      )}


      {/* Empty state */}

      {projects.length === 0 ? (

        <div className="builder-empty-section">

          <div className="builder-empty-icon">
            🚀
          </div>

          <h3>No projects added yet</h3>

          <p>
            Add projects that you want visitors to see
            on your portfolio.
          </p>

          <button
            type="button"
            onClick={addProject}
          >
            + Add Project
          </button>

        </div>

      ) : (

        <div className="builder-repeat-list">

          {projects.map((project, index) => (

            <div
              className="builder-repeat-card"
              key={index}
            >

              {/* Header */}

              <div className="builder-repeat-header">

                <div>

                  <h3>
                    Project {index + 1}
                  </h3>

                  <span>
                    Portfolio project
                  </span>

                </div>

                <button
                  type="button"
                  className="builder-remove-button"
                  onClick={() =>
                    removeProject(index)
                  }
                >
                  Remove
                </button>

              </div>


              {/* Project name */}

              <div className="builder-field">

                <label
                  htmlFor={`project-name-${index}`}
                >
                  Project Name
                </label>

                <input
                  id={`project-name-${index}`}
                  type="text"
                  placeholder="e.g. Portfolio Creator"
                  value={project.name}
                  onChange={(event) =>
                    updateProject(
                      index,
                      "name",
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              {/* Description */}

              <div className="builder-field">

                <label
                  htmlFor={`project-description-${index}`}
                >
                  Description
                </label>

                <textarea
                  id={`project-description-${index}`}
                  placeholder="Describe what the project does, the problem it solves, and your contribution."
                  value={project.description}
                  onChange={(event) =>
                    updateProject(
                      index,
                      "description",
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              {/* Technologies */}

              <div className="builder-field">

                <label
                  htmlFor={`project-technologies-${index}`}
                >
                  Technologies
                </label>

                <input
                  id={`project-technologies-${index}`}
                  type="text"
                  placeholder="React, Firebase, JavaScript"
                  value={project.technologies.join(", ")}
                  onChange={(event) =>
                    handleTechnologyChange(
                      index,
                      event.target.value
                    )
                  }
                />

                <small className="builder-field-help">
                  Separate technologies with commas.
                </small>

              </div>


              {/* Links */}

              <div className="builder-field-grid">

                <div className="builder-field">

                  <label
                    htmlFor={`github-url-${index}`}
                  >
                    GitHub URL
                    <span className="builder-optional">
                      Optional
                    </span>
                  </label>

                  <input
                    id={`github-url-${index}`}
                    type="url"
                    placeholder="https://github.com/..."
                    value={project.githubUrl}
                    onChange={(event) =>
                      updateProject(
                        index,
                        "githubUrl",
                        event.target.value
                      )
                    }
                  />

                </div>


                <div className="builder-field">

                  <label
                    htmlFor={`live-url-${index}`}
                  >
                    Live Demo URL
                    <span className="builder-optional">
                      Optional
                    </span>
                  </label>

                  <input
                    id={`live-url-${index}`}
                    type="url"
                    placeholder="https://..."
                    value={project.liveUrl}
                    onChange={(event) =>
                      updateProject(
                        index,
                        "liveUrl",
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>


              {/* Project image */}

              <div className="builder-field">

                <label
                  htmlFor={`project-image-${index}`}
                >
                  Project Image
                  <span className="builder-optional">
                    Optional
                  </span>
                </label>

                <input
                  id={`project-image-${index}`}
                  type="file"
                  accept="image/*"
                  disabled={
                    uploadingIndex === index
                  }
                  onChange={(event) =>
                    handleImageUpload(
                      index,
                      event.target.files[0]
                    )
                  }
                />

                {uploadingIndex === index && (
                  <p className="builder-upload-status">
                    Uploading image...
                  </p>
                )}

                {project.imageUrl && (
                  <div className="builder-project-image-preview">

                    <img
                      src={project.imageUrl}
                      alt={`${project.name || "Project"} preview`}
                    />

                  </div>
                )}

              </div>

            </div>

          ))}

        </div>

      )}


      {/* Add another */}

      {projects.length > 0 && (
        <button
          type="button"
          className="builder-add-button"
          onClick={addProject}
        >
          + Add Another Project
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
          disabled={
            saving || uploadingIndex !== null
          }
        >
          {saving
            ? "Saving..."
            : "Save & Continue →"}
        </button>

      </div>

    </form>
  );
};

export default Projects;