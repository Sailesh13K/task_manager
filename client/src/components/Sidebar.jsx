import {
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";

const navItems = [
  {
    icon: LayoutDashboard,
    id: "dashboard",
    label: "Dashboard",
  },
  {
    icon: FolderKanban,
    id: "projects",
    label: "Projects",
  },
  {
    icon: ClipboardList,
    id: "tasks",
    label: "Tasks",
  },
  {
    icon: Users,
    id: "members",
    label: "Members",
  },
];

export function Sidebar({ activeView, currentUser, onSignOut, onViewChange }) {
  return (
    <aside className="sidebar">
      <div className="app-title">
        <FolderKanban size={28} />
        <div>
          <strong>TaskFlow</strong>
          <span>Workspace</span>
        </div>
      </div>
      {currentUser && (
        <div className="user-card">
          <span>Signed in as</span>
          <strong>{currentUser.name}</strong>
          <small>{currentUser.email}</small>
        </div>
      )}
      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              className={activeView === item.id ? "active" : ""}
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <button className="ghost-action" type="button" onClick={onSignOut}>
        <LogOut size={17} />
        Logout
      </button>
    </aside>
  );
}
