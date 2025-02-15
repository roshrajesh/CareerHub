import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom
import "./projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      title: "Portfolio Website",
      description: "Built a responsive personal portfolio website using React and CSS.",
      link: "https://myportfolio.com",
      technologies: ["React", "CSS", "JavaScript"],
    },
  ]);

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    link: "",
    technologies: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleInputChange = (field, value) => {
    setNewProject({ ...newProject, [field]: value });
  };

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      setProjects([
        ...projects,
        {
          ...newProject,
          technologies: newProject.technologies.split(",").map((tech) => tech.trim()),
        },
      ]);
      setNewProject({ title: "", description: "", link: "", technologies: "" });
    }
  };

  const handleEditProject = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    const projectToEdit = projects[index];
    setNewProject({
      title: projectToEdit.title,
      description: projectToEdit.description,
      link: projectToEdit.link,
      technologies: projectToEdit.technologies.join(", "),
    });
  };

  const handleUpdateProject = () => {
    const updatedProjects = [...projects];
    updatedProjects[editIndex] = {
      ...newProject,
      technologies: newProject.technologies.split(",").map((tech) => tech.trim()),
    };
    setProjects(updatedProjects);
    setIsEditing(false);
    setNewProject({ title: "", description: "", link: "", technologies: "" });
    setEditIndex(null);
  };

  const handleDeleteProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  const handleBackButtonClick = () => {
    navigate("/profile"); // Directly navigate to the profile page
  };

  return (
    <div className="projects-page">
      <h1>Projects & Achievements</h1>

      <button className="btn btn-back" onClick={handleBackButtonClick}>
        Back
      </button>

      <div className="project-form">
        <input
          type="text"
          placeholder="Project Title"
          value={newProject.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={newProject.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
        <input
          type="text"
          placeholder="Project Link (Optional)"
          value={newProject.link}
          onChange={(e) => handleInputChange("link", e.target.value)}
        />
        <input
          type="text"
          placeholder="Technologies Used (comma-separated)"
          value={newProject.technologies}
          onChange={(e) => handleInputChange("technologies", e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={isEditing ? handleUpdateProject : handleAddProject}
        >
          {isEditing ? "Update Project" : "Add Project"}
        </button>
      </div>

      <div className="projects-list">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.link && (
                <p>
                  <strong>Link: </strong>
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    {project.link}
                  </a>
                </p>
              )}
              <p>
                <strong>Technologies:</strong> {project.technologies.join(", ")}
              </p>
              <div className="project-actions">
                <button
                  className="btn btn-edit"
                  onClick={() => handleEditProject(index)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteProject(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No projects or achievements added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
