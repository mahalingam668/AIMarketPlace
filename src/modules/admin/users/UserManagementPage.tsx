import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Search, ShieldOff, ShieldX, ShieldCheck, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { suspendUser, banUser, reinstateUser, type PlatformUser } from '../../../store/slices/adminSlice';

/**
 * Blueprint §5.2 — search/view/act on any company or developer account:
 * verify (out of scope for this pass — no document-upload pipeline yet),
 * suspend for policy violations, or permanently ban repeat offenders.
 * Every suspend/ban requires a reason code so the action is accountable,
 * matching the two-step "click action, then confirm inline" pattern used
 * for destructive actions elsewhere in the freelancer/admin modules.
 */

type PendingActionKind = 'suspend' | 'ban';

function statusBadgeClass(status: PlatformUser['status']): string {
  switch (status) {
    case 'active':
      return 'adm-badge adm-badge--success';
    case 'suspended':
      return 'adm-badge adm-badge--neutral';
    case 'banned':
      return 'adm-badge adm-badge--danger';
  }
}

function UserManagementPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((s) => s.admin.users);
  const [search, setSearch] = useState('');
  const [pendingAction, setPendingAction] = useState<{ id: string; kind: PendingActionKind } | null>(null);
  const [reason, setReason] = useState('');

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
  }, [users, search]);

  const startAction = (id: string, kind: PendingActionKind) => {
    setPendingAction({ id, kind });
    setReason('');
  };

  const cancelAction = () => {
    setPendingAction(null);
    setReason('');
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      toast.error('A reason code is required before this action can be logged.');
      return;
    }
    if (pendingAction.kind === 'suspend') {
      dispatch(suspendUser({ id: pendingAction.id, reason: trimmedReason }));
      toast.success('Account suspended.');
    } else {
      dispatch(banUser({ id: pendingAction.id, reason: trimmedReason }));
      toast.success('Account permanently banned.');
    }
    setPendingAction(null);
    setReason('');
  };

  const handleReinstate = (user: PlatformUser) => {
    dispatch(reinstateUser({ id: user.id }));
    toast.success(`${user.name} reinstated.`);
  };

  return (
    <div>
      <div className="adm-header">
        <div>
          <h1 className="adm-header__title">User Management</h1>
          <p className="adm-header__subtitle">
            Search company and developer accounts, then suspend or ban for policy violations — every action is logged with a reason code.
          </p>
        </div>
      </div>

      <div className="adm-section">
        <div className="adm-section__header">
          <h2 className="adm-section__title">Platform Users</h2>
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search
              size={14}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                color: 'var(--text-primary)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '9px 12px 9px 32px',
                width: '100%',
              }}
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty__icon"><Users size={20} /></div>
            <h4>No users found</h4>
            <p>Try a different search term.</p>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isPending = pendingAction?.id === user.id;
                  return (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.name}</strong>
                        {user.lastActionReason && (
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            Reason: {user.lastActionReason}
                          </div>
                        )}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td><span className={statusBadgeClass(user.status)}>{user.status}</span></td>
                      <td>{user.joinedAt}</td>
                      <td>
                        {isPending ? (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', minWidth: 260 }}>
                            <input
                              autoFocus
                              type="text"
                              placeholder="Reason code (required)..."
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') confirmAction();
                                if (e.key === 'Escape') cancelAction();
                              }}
                              style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: 12,
                                color: 'var(--text-primary)',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-primary)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '7px 10px',
                                flex: 1,
                                minWidth: 140,
                              }}
                            />
                            <div className="adm-table__actions">
                              <button type="button" className="adm-btn adm-btn--danger" onClick={confirmAction}>
                                Confirm {pendingAction.kind === 'suspend' ? 'Suspend' : 'Ban'}
                              </button>
                              <button type="button" className="adm-btn" onClick={cancelAction}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="adm-table__actions">
                            {user.status === 'active' && (
                              <>
                                <button
                                  type="button"
                                  className="adm-btn"
                                  onClick={() => startAction(user.id, 'suspend')}
                                  title="Suspend account"
                                >
                                  <ShieldOff size={14} /> Suspend
                                </button>
                                <button
                                  type="button"
                                  className="adm-btn adm-btn--danger"
                                  onClick={() => startAction(user.id, 'ban')}
                                  title="Permanently ban account"
                                >
                                  <ShieldX size={14} /> Ban
                                </button>
                              </>
                            )}
                            {(user.status === 'suspended' || user.status === 'banned') && (
                              <button
                                type="button"
                                className="adm-btn adm-btn--primary"
                                onClick={() => handleReinstate(user)}
                                title="Reinstate account"
                              >
                                <ShieldCheck size={14} /> Reinstate
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagementPage;
