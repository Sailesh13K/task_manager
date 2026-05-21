import { AlertCircle, FolderKanban, Save } from "lucide-react";
import { Notice } from "./Notice";

export function AuthPage({
  authForm,
  authMode,
  error,
  onAuthModeChange,
  onChange,
  onSubmit,
}) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand-mark">
          <FolderKanban size={34} />
        </div>
        <h1>TaskFlow</h1>
        <p>Team task management for projects, members, and delivery tracking.</p>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="mode-switch">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => onAuthModeChange("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === "signup" ? "active" : ""}
              onClick={() => onAuthModeChange("signup")}
            >
              Signup
            </button>
          </div>

          {authMode === "signup" && (
            <label>
              Name
              <input
                value={authForm.name}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder="Sailesh"
              />
            </label>
          )}

          <label>
            Email
            <input
              value={authForm.email}
              onChange={(event) => onChange("email", event.target.value)}
              placeholder="you@example.com"
              type="email"
            />
          </label>

          <label>
            Password
            <input
              value={authForm.password}
              onChange={(event) => onChange("password", event.target.value)}
              placeholder="Minimum 6 characters"
              type="password"
            />
          </label>

          {error && <Notice icon={<AlertCircle size={16} />} text={error} tone="danger" />}

          <button className="primary-action" type="submit">
            <Save size={17} />
            {authMode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}
