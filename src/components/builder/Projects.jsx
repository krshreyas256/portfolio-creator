import { useState } from "react";
import { uploadImage } from "../../cloudinary/uploadImage";

const Projects = ({ portfolio, onSave, onNext, onBack }) => {
  const [projects, setProjects] = useState(
    portfolio.projects || [
      {
        name: "",
        description: "",
        technologies: [],
        githubUrl: "",
        liveUrl: "",
        imageUrl: "",
      },
    ]
  );

  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    const updatedProjects = [...projects];

    updatedProjects[index][field] = value;

    setProjects(updatedProjects);
  };

  const handleTechnologiesChange = (index, value) => {
    const updatedProjects = [...projects];

    updatedProjects[index].technologies = value
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);

    setProjects(updatedProjects);
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    setError("");
    setUploadingIndex(index);

    try {
      const imageUrl = await uploadImage(file);

      const updatedProjects = [...projects];

      updatedProjects[index].imageUrl = imageUrl;

      setProjects(updatedProjects);
    } catch (error) {
      console.error("Image upload error:", error);
      setError("Unable to upload image. Please try again.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        name: "",
        description: "",
        technologies: [],
        githubUrl: "",
        liveUrl: "",
        imageUrl: "",
      },
    ]);
  };

  const removeProject = (index) => {
    const updatedProjects = projects.filter(
      (_, projectIndex) => projectIndex !== index
    );

    setProjects(updatedProjects);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      await onSave({
        projects,
      });

      onNext();
    } catch (error) {
      console.error("Error saving projects:", error);
      setError("Unable to save projects. Please try again.");
    }
  };

  return (
    <div>
      <h2>Projects</h2>

      <p>
        Showcase your important projects and give visitors a better
        understanding of your work.
      </p>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        {projects.map((project, index) => (
          <div key={index}>
            <h3>Project {index + 1}</h3>

            <div>
              <label>Project Name</label>
              <input
                type="text"
                value={project.name}
                onChange={(event) =>
                  handleChange(index, "name", event.target.value)
                }
                placeholder="e.g. Resume Analyzer"
                required
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                value={project.description}
                onChange={(event) =>
                  handleChange(index, "description", event.target.value)
                }
                placeholder="Describe your project..."
                rows="4"
                required
              />
            </div>

            <div>
              <label>Technologies</label>
              <input
                type="text"
                value={project.technologies.join(", ")}
                onChange={(event) =>
                  handleTechnologiesChange(index, event.target.value)
                }
                placeholder="React, Node.js, MongoDB"
              />

              <small>Separate technologies with commas.</small>
            </div>

            <div>
              <label>GitHub URL</label>
              <input
                type="url"
                value={project.githubUrl}
                onChange={(event) =>
                  handleChange(index, "githubUrl", event.target.value)
                }
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label>Live Project URL</label>
              <input
                type="url"
                value={project.liveUrl}
                onChange={(event) =>
                  handleChange(index, "liveUrl", event.target.value)
                }
                placeholder="https://..."
              />
            </div>

            <div>
              <label>Project Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleImageUpload(index, event.target.files[0])
                }
              />

              {uploadingIndex === index && (
                <p>Uploading image...</p>
              )}

              {project.imageUrl && (
                <div>
                  <img
                    src={project.imageUrl}
                    alt={project.name || "Project preview"}
                    width="250"
                  />
                </div>
              )}
            </div>

            {projects.length > 1 && (
              <button
                type="button"
                onClick={() => removeProject(index)}
              >
                Remove Project
              </button>
            )}

            <hr />
          </div>
        ))}

        <button type="button" onClick={addProject}>
          + Add Another Project
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

export default Projects;