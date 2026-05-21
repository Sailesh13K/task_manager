import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";

export function SignupPage({ authForm, authLoading, error, onChange, onSubmit }) {
  return (
    <AuthLayout
      error={error}
      title="Signup"
      subtitle="Create your account and start managing projects."
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          Name
          <input
            autoComplete="name"
            autoFocus
            value={authForm.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="Sailesh"
          />
        </label>

        <label>
          Email
          <input
            autoComplete="email"
            value={authForm.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="you@example.com"
            type="email"
          />
        </label>

        <label>
          Password
          <input
            autoComplete="new-password"
            value={authForm.password}
            onChange={(event) => onChange("password", event.target.value)}
            placeholder="Minimum 6 characters"
            type="password"
          />
        </label>

        <button className="primary-action" disabled={authLoading} type="submit">
          <UserPlus size={17} />
          {authLoading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-link">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
