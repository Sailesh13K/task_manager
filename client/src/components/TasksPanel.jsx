import { Save } from "lucide-react";
import { PRIORITIES, TASK_STATUSES } from "../constants/tasks";
import { TaskColumn } from "./TaskColumn";

export function TasksPanel({
  editingTaskId,
  isAdmin,
  members,
  onDeleteTask,
  onEditTask,
  onSaveTask,
  onStatusChange,
  onTaskFormChange,
  taskForm,
  tasks,
}) {
  return (
    <div className="panel wide" id="tasks">
      <div className="panel-header">
        <h2>Tasks</h2>
        <span>{isAdmin ? "Admin controls enabled" : "Assigned work only"}</span>
      </div>

      {isAdmin && (
        <form className="task-form" onSubmit={onSaveTask}>
          <input
            value={taskForm.title}
            onChange={(event) => onTaskFormChange("title", event.target.value)}
            placeholder="Task title"
          />
          <input
            value={taskForm.description}
            onChange={(event) => onTaskFormChange("description", event.target.value)}
            placeholder="Description"
          />
          <input
            value={taskForm.dueDate}
            onChange={(event) => onTaskFormChange("dueDate", event.target.value)}
            type="date"
          />
          <select
            value={taskForm.priority}
            onChange={(event) => onTaskFormChange("priority", event.target.value)}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority[0] + priority.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <select
            value={taskForm.assignedUserId}
            onChange={(event) => onTaskFormChange("assignedUserId", event.target.value)}
          >
            <option value="">Assign to</option>
            {members.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.name}
              </option>
            ))}
          </select>
          <button className="primary-action" type="submit">
            <Save size={16} />
            {editingTaskId ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="task-board">
        {TASK_STATUSES.map((status) => (
          <TaskColumn
            canDelete={isAdmin}
            canEdit={isAdmin}
            key={status}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            onStatus={onStatusChange}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
          />
        ))}
      </div>
    </div>
  );
}
