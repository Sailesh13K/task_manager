import {
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";

export function Sidebar({ onSignOut }) {
  return (
    <aside className="sidebar">
      <div className="app-title">
        <FolderKanban size={28} />
        <div>
          <strong>TaskFlow</strong>
          <span>Workspace</span>
        </div>
      </div>
      <nav>
        <a href="#dashboard">
          <LayoutDashboard size={17} />
          Dashboard
        </a>
        <a href="#projects">
          <FolderKanban size={17} />
          Projects
        </a>
        <a href="#tasks">
          <ClipboardList size={17} />
          Tasks
        </a>
        <a href="#members">
          <Users size={17} />
          Members
        </a>
      </nav>
      <button className="ghost-action" type="button" onClick={onSignOut}>
        <LogOut size={17} />
        Logout
      </button>
    </aside>
  );
}
