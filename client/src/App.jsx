import { useCallback, useEffect, useMemo, useState } from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";

import { createApiClient } from "./api/client";
import { EMPTY_TASK_FORM } from "./constants/tasks";

import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("taskflowToken") || "",
  );

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
  });

  const [memberForm, setMemberForm] = useState({
    userId: "",
    role: "MEMBER",
  });

  const [taskForm, setTaskForm] = useState(EMPTY_TASK_FORM);

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const api = useMemo(() => createApiClient(token), [token]);

  const currentMembership = useMemo(
    () =>
      projects.find((item) => item.project?.id === Number(selectedProjectId)),
    [projects, selectedProjectId],
  );

  const isAdmin = currentMembership?.role === "ADMIN";

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const loadWorkspace = useCallback(
    async (projectId = selectedProjectId) => {
      if (!token) return;

      setLoading(true);
      setError("");

      try {
        const [userData, userList] = await Promise.all([
          api("/api/users/me").catch(() => null),
          api("/api/users").catch(() => []),
        ]);

        const [projectList, dashboardData, assignedTasks] = await Promise.all([
          api("/api/projects/my-projects"),
          api("/api/dashboard"),
          api("/api/tasks/my-tasks"),
        ]);

        setCurrentUser(userData);
        setUsers(userList);

        setProjects(projectList);
        setDashboard(dashboardData);
        setMyTasks(assignedTasks);

        const nextProjectId = projectId || projectList[0]?.project?.id || "";

        setSelectedProjectId(nextProjectId ? String(nextProjectId) : "");

        if (nextProjectId) {
          const [projectData, memberList, projectTasks] = await Promise.all([
            api(`/api/projects/${nextProjectId}`),
            api(`/api/projects/${nextProjectId}/members`),
            api(`/api/tasks/project/${nextProjectId}`),
          ]);

          setSelectedProject(projectData);
          setMembers(memberList);
          setTasks(projectTasks);
        } else {
          setSelectedProject(null);
          setMembers([]);
          setTasks([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [token, api, selectedProjectId],
  );

  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadWorkspace();
    }
  }, [token, loadWorkspace]);

  async function handleAuth(event, mode) {
    event.preventDefault();

    setError("");

    if (!authForm.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!authForm.password.trim()) {
      setError("Password is required");
      return;
    }

    if (mode === "signup" && !authForm.name.trim()) {
      setError("Name is required");
      return;
    }

    setAuthLoading(true);

    try {
      const path = mode === "login" ? "/api/auth/login" : "/api/auth/signup";

      const body =
        mode === "login"
          ? {
              email: authForm.email.trim(),
              password: authForm.password,
            }
          : {
              name: authForm.name.trim(),
              email: authForm.email.trim(),
              password: authForm.password,
            };

      const data = await api(path, {
        method: "POST",
        body: JSON.stringify(body),
      });

      localStorage.setItem("taskflowToken", data.token);

      setToken(data.token);

      setAuthForm({
        name: "",
        email: "",
        password: "",
      });

      setMessage(mode === "login" ? "Signed in successfully" : "Account created");
    } catch (err) {
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function createProject(event) {
    event.preventDefault();

    setError("");

    if (!projectForm.name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      const project = await api("/api/projects", {
        method: "POST",
        body: JSON.stringify(projectForm),
      });

      setProjectForm({
        name: "",
        description: "",
      });

      setMessage("Project created");

      await loadWorkspace(project.id);
    } catch (err) {
      setError(err.message);
    }
  }

  async function addMember(event) {
    event.preventDefault();

    setError("");

    if (!memberForm.userId) {
      setError("Select a user to add");
      return;
    }

    try {
      await api(`/api/projects/${selectedProjectId}/members`, {
        method: "POST",
        body: JSON.stringify({
          userId: Number(memberForm.userId),
          role: memberForm.role,
        }),
      });

      setMemberForm({
        userId: "",
        role: "MEMBER",
      });

      setMessage("Member added");

      await loadWorkspace(selectedProjectId);
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeMember(userId) {
    setError("");

    try {
      await api(`/api/projects/${selectedProjectId}/members/${userId}`, {
        method: "DELETE",
      });

      setMessage("Member removed");

      await loadWorkspace(selectedProjectId);
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveTask(event) {
    event.preventDefault();

    setError("");

    if (!taskForm.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      const payload = {
        ...taskForm,
        projectId: Number(selectedProjectId),
        assignedUserId: taskForm.assignedUserId
          ? Number(taskForm.assignedUserId)
          : null,
      };

      const path = editingTaskId ? `/api/tasks/${editingTaskId}` : "/api/tasks";

      await api(path, {
        method: editingTaskId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      setTaskForm(EMPTY_TASK_FORM);

      setEditingTaskId(null);

      setMessage(editingTaskId ? "Task updated" : "Task created");

      await loadWorkspace(selectedProjectId);
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateStatus(taskId, status) {
    setError("");

    try {
      await api(`/api/tasks/${taskId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      await loadWorkspace(selectedProjectId);
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(taskId) {
    setError("");

    try {
      await api(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      setMessage("Task deleted");

      await loadWorkspace(selectedProjectId);
    } catch (err) {
      setError(err.message);
    }
  }

  function startEditTask(task) {
    setEditingTaskId(task.id);

    setTaskForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate || "",
      priority: task.priority,
      assignedUserId: task.assignedTo?.id ? String(task.assignedTo.id) : "",
    });
  }

  function signOut() {
    localStorage.removeItem("taskflowToken");

    setToken("");

    setProjects([]);
    setCurrentUser(null);
    setUsers([]);
    setSelectedProject(null);
    setSelectedProjectId("");

    setDashboard(null);

    setMessage("");
    setError("");
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage
                authForm={authForm}
                authLoading={authLoading}
                error={error}
                onChange={(field, value) =>
                  setAuthForm({
                    ...authForm,
                    [field]: value,
                  })
                }
                onSubmit={(event) => handleAuth(event, "login")}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignupPage
                authForm={authForm}
                authLoading={authLoading}
                error={error}
                onChange={(field, value) =>
                  setAuthForm({
                    ...authForm,
                    [field]: value,
                  })
                }
                onSubmit={(event) => handleAuth(event, "signup")}
              />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            token ? (
              <DashboardPage
                dashboard={dashboard}
                currentUser={currentUser}
                error={error}
                isAdmin={isAdmin}
                loading={loading}
                memberForm={memberForm}
                members={members}
                message={message}
                myTasks={myTasks}
                projectForm={projectForm}
                projects={projects}
                selectedProject={selectedProject}
                selectedProjectId={selectedProjectId}
                taskForm={taskForm}
                tasks={tasks}
                users={users}
                editingTaskId={editingTaskId}
                loadWorkspace={loadWorkspace}
                signOut={signOut}
                createProject={createProject}
                setProjectForm={setProjectForm}
                addMember={addMember}
                setMemberForm={setMemberForm}
                removeMember={removeMember}
                saveTask={saveTask}
                startEditTask={startEditTask}
                updateStatus={updateStatus}
                setTaskForm={setTaskForm}
                deleteTask={deleteTask}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
