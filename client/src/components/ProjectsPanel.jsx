import { Plus } from "lucide-react";

export function ProjectsPanel({
  onCreateProject,
  onProjectFormChange,
  onSelectProject,
  projectForm,
  projects,
  selectedProjectId,
}) {
  return (
    <div className="panel" id="projects">
      <div className="panel-header">
        <h2>Projects</h2>
      </div>
      <form className="compact-form" onSubmit={onCreateProject}>
        <input
          value={projectForm.name}
          onChange={(event) => onProjectFormChange("name", event.target.value)}
          placeholder="Project name"
        />
        <input
          value={projectForm.description}
          onChange={(event) => onProjectFormChange("description", event.target.value)}
          placeholder="Description"
        />
        <button className="primary-action" type="submit">
          <Plus size={16} />
          Create
        </button>
      </form>
      <div className="project-list">
        {projects.map((item) => (
          <button
            className={String(item.project.id) === selectedProjectId ? "selected" : ""}
            key={item.id}
            type="button"
            onClick={() => onSelectProject(item.project.id)}
          >
            <span>{item.project.name}</span>
            <strong>{item.role}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
