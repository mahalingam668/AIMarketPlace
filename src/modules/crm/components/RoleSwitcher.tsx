import { UserCog } from 'lucide-react';
import { useCrmRole } from '../../../hooks/useCrmRole';

/** Frontend-only RBAC has no backend session, so this lets you preview exactly what each role sees. */
function RoleSwitcher() {
  const { role, setRole, availableRoles } = useCrmRole();

  return (
    <label className="crm-role-switcher">
      <UserCog size={15} />
      Preview role:
      <select className="crm-select" value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
        {availableRoles.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
    </label>
  );
}

export default RoleSwitcher;
