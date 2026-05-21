import { useState } from "react";
import { AlertCircle, CheckCircle2, RefreshCcw } from "lucide-react";
import { DashboardMetrics } from "../components/DashboardMetrics";
import { MembersPanel } from "../components/MembersPanel";
import { MyTasksPanel } from "../components/MyTasksPanel";
import { Notice } from "../components/Notice";
import { ProjectsPanel } from "../components/ProjectsPanel";
import { Sidebar } from "../components/Sidebar";
import { TasksPanel } from "../components/TasksPanel";

export function DashboardPage(props) {
  const [activeView, setActiveView] = useState("dashboard");

  const {
    dashboard,
    currentUser,
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
    users,
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

  const viewTitles = {
    dashboard: {
      eyebrow: "Workspace overview",
      title: selectedProject?.name || "Project workspace",
    },
    projects: {
      eyebrow: "Planning",
      title: "Projects",
    },
    tasks: {
      eyebrow: selectedProject?.name || "Selected project",
      title: "Tasks",
    },
    members: {
      eyebrow: selectedProject?.name || "Selected project",
      title: "Members",
    },
  };

  const activeTitle = viewTitles[activeView];

  return (
    <main className="app-shell">
      <Sidebar
        activeView={activeView}
        currentUser={currentUser}
        onSignOut={signOut}
        onViewChange={setActiveView}
      />

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">{activeTitle.eyebrow}</span>
            <h1>{activeTitle.title}</h1>
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

        {activeView === "dashboard" && (
          <section className="dashboard-view">
            <DashboardMetrics dashboard={dashboard} />
            <MyTasksPanel tasks={myTasks} />
          </section>
        )}

        {activeView === "projects" && (
          <section className="view-grid single">
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
          </section>
        )}

        {activeView === "tasks" && (
          <section className="view-grid single">
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
          </section>
        )}

        {activeView === "members" && (
          <section className="view-grid single">
            <MembersPanel
              isAdmin={isAdmin}
              memberForm={memberForm}
              members={members}
              onAddMember={addMember}
              onMemberFormChange={(field, value) =>
                setMemberForm({ ...memberForm, [field]: value })
              }
              onRemoveMember={removeMember}
              users={users}
            />
          </section>
        )}
      </section>
    </main>
  );
}
