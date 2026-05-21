export function MyTasksPanel({ tasks }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>My Tasks</h2>
      </div>
      <div className="mini-list">
        {tasks.map((task) => (
          <div className="mini-task" key={task.id}>
            <strong>{task.title}</strong>
            <span>{task.project?.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
