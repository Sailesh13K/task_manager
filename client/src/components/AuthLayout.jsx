import { AlertCircle, FolderKanban } from "lucide-react";
import { Notice } from "./Notice";

export function AuthLayout({ children, error, subtitle, title }) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-card-header">
          <div className="brand-mark">
            <FolderKanban size={30} />
          </div>
          <div>
            <span className="auth-brand">TaskFlow</span>
            <h1>{title}</h1>
          </div>
        </div>
        <p>{subtitle}</p>

        {error && (
          <Notice icon={<AlertCircle size={16} />} text={error} tone="danger" />
        )}

        {children}
      </section>
    </main>
  );
}
