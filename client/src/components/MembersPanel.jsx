import { Trash2, UserPlus } from "lucide-react";

export function MembersPanel({
  isAdmin,
  memberForm,
  members,
  onAddMember,
  onMemberFormChange,
  onRemoveMember,
  users = [],
}) {
  const projectUserIds = new Set(members.map((item) => item.user.id));
  const availableUsers = users.filter((user) => !projectUserIds.has(user.id));
  const hasUserDirectory = users.length > 0;

  return (
    <div className="panel" id="members">
      <div className="panel-header">
        <h2>Members</h2>
        <span>{members.length} active</span>
      </div>
      {isAdmin && (
        <form className="compact-form" onSubmit={onAddMember}>
          <select
            value={memberForm.userId}
            onChange={(event) => onMemberFormChange("userId", event.target.value)}
          >
            <option value="">Select user</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <select
            value={memberForm.role}
            onChange={(event) => onMemberFormChange("role", event.target.value)}
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button className="primary-action" type="submit">
            <UserPlus size={16} />
            Add
          </button>
        </form>
      )}
      {isAdmin && !hasUserDirectory && (
        <p className="panel-note">
          Restart the backend to load the registered user directory.
        </p>
      )}
      {isAdmin && hasUserDirectory && availableUsers.length === 0 && (
        <p className="panel-note">
          All registered users are already in this project.
        </p>
      )}
      <div className="member-list">
        {members.map((item) => (
          <div className="member-row" key={item.id}>
            <div>
              <strong>{item.user.name}</strong>
              <span>{item.user.email}</span>
            </div>
            <span className="role-pill">{item.role}</span>
            {isAdmin && (
              <button
                className="icon-action danger"
                type="button"
                onClick={() => onRemoveMember(item.user.id)}
                title="Remove member"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
