import { Trash2, UserPlus } from "lucide-react";

export function MembersPanel({
  isAdmin,
  memberForm,
  members,
  onAddMember,
  onMemberFormChange,
  onRemoveMember,
}) {
  return (
    <div className="panel" id="members">
      <div className="panel-header">
        <h2>Members</h2>
      </div>
      {isAdmin && (
        <form className="compact-form" onSubmit={onAddMember}>
          <input
            value={memberForm.userId}
            onChange={(event) => onMemberFormChange("userId", event.target.value)}
            placeholder="User ID"
            type="number"
          />
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
