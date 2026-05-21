import { Metric } from "./Metric";

export function DashboardMetrics({ dashboard }) {
  return (
    <section className="metrics" id="dashboard">
      <Metric label="Total tasks" value={dashboard?.totalTasks ?? 0} />
      <Metric label="To do" value={dashboard?.todoTasks ?? 0} />
      <Metric label="In progress" value={dashboard?.inProgressTasks ?? 0} />
      <Metric label="Done" value={dashboard?.doneTasks ?? 0} />
      <Metric label="Overdue" value={dashboard?.overdueTasks ?? 0} />
    </section>
  );
}
