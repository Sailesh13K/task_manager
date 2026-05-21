import { AlertCircle, CheckCircle2, RefreshCcw } from "lucide-react";
import { DashboardMetrics } from "../components/DashboardMetrics";
import { MembersPanel } from "../components/MembersPanel";
import { MyTasksPanel } from "../components/MyTasksPanel";
import { Notice } from "../components/Notice";
import { ProjectsPanel } from "../components/ProjectsPanel";
import { Sidebar } from "../components/Sidebar";
import { TasksPanel } from "../components/TasksPanel";

export function DashboardPage(props) {
  const {
    dashboard,
    error,
    isAdmin,
    loading,
    memberForm,
    members,
    message,
    myTasks,
    projectForm,
    projects,
    selectedProject,
    selectedProjectId,
    taskForm,
    tasks,
    editingTaskId,
    loadWorkspace,
    signOut,
    createProject,
    setProjectForm,
    addMember,
    setMemberForm,
    removeMember,
    saveTask,
    startEditTask,
    updateStatus,
    setTaskForm,
    deleteTask,
  } = props;

  return (
    <main className="app-shell">
      <Sidebar onSignOut={signOut} />

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Workspace overview</span>
            <h1>{selectedProject?.name || "Project workspace"}</h1>
          </div>

          <button
            className="icon-action"
            type="button"
            onClick={() => loadWorkspace()}
          >
            <RefreshCcw size={18} />
          </button>
        </header>

        {(error || message || loading) && (
          <div className="notice-row">
            {error && (
              <Notice
                icon={<AlertCircle size={16} />}
                text={error}
                tone="danger"
              />
            )}

            {message && (
              <Notice
                icon={<CheckCircle2 size={16} />}
                text={message}
                tone="success"
              />
            )}

            {loading && (
              <Notice
                icon={<RefreshCcw size={16} />}
                text="Loading latest data"
              />
            )}
          </div>
        )}

        <DashboardMetrics dashboard={dashboard} />

        <section className="layout-grid">
          <ProjectsPanel
            onCreateProject={createProject}
            onProjectFormChange={(field, value) =>
              setProjectForm({ ...projectForm, [field]: value })
            }
            onSelectProject={loadWorkspace}
            projectForm={projectForm}
            projects={projects}
            selectedProjectId={selectedProjectId}
          />

          <TasksPanel
            editingTaskId={editingTaskId}
            isAdmin={isAdmin}
            members={members}
            onDeleteTask={deleteTask}
            onEditTask={startEditTask}
            onSaveTask={saveTask}
            onStatusChange={updateStatus}
            onTaskFormChange={(field, value) =>
              setTaskForm({ ...taskForm, [field]: value })
            }
            taskForm={taskForm}
            tasks={tasks}
          />

          <MembersPanel
            isAdmin={isAdmin}
            memberForm={memberForm}
            members={members}
            onAddMember={addMember}
            onMemberFormChange={(field, value) =>
              setMemberForm({ ...memberForm, [field]: value })
            }
            onRemoveMember={removeMember}
          />

          <MyTasksPanel tasks={myTasks} />
        </section>
      </section>
    </main>
  );
}
