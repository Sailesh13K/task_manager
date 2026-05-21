import { Calendar } from "lucide-react";

export function TaskColumn({
  canDelete,
  canEdit,
  onDelete,
  onEdit,
  onStatus,
  status,
  tasks,
}) {
  const label = status.replace("_", " ");

  return (
    <section className="task-column">
      <header>
        <span>{label}</span>
        <strong>{tasks.length}</strong>
      </header>
      {tasks.map((task) => (
        <article className="task-card" key={task.id}>
          <div className="task-title">
            <strong>{task.title}</strong>
            <span className={`priority ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          </div>
          <p>{task.description || "No description"}</p>
          <div className="task-meta">
            <span>
              <Calendar size={14} />
              {task.dueDate || "No date"}
            </span>
            <span>{task.assignedTo?.name || "Unassigned"}</span>
          </div>
          <div className="task-actions">
            <select
              value={task.status}
              onChange={(event) => onStatus(task.id, event.target.value)}
            >
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="DONE">Done</option>
            </select>
            {canEdit && (
              <button type="button" onClick={() => onEdit(task)}>
                Edit
              </button>
            )}
            {canDelete && (
              <button type="button" onClick={() => onDelete(task.id)}>
                Delete
              </button>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
