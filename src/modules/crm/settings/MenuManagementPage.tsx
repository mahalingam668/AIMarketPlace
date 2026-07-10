import { ArrowDown, ArrowUp, RotateCcw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { resolveCrmIcon } from '../components/crmIcons';
import { useMenuConfig } from '../../../hooks/useMenuConfig';
import { useCrmRole } from '../../../hooks/useCrmRole';

function MenuManagementPage() {
  const { menuGroups, updateMenuChild, toggleChildVisibility, reorderChildren, resetMenuConfig, badgeCounts } = useMenuConfig();
  const { permissions } = useCrmRole();

  const move = (groupId: number, index: number, direction: -1 | 1) => {
    const group = menuGroups.find((g) => g.id === groupId);
    if (!group) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= group.children.length) return;
    const ids = group.children.map((c) => c.id);
    [ids[index], ids[nextIndex]] = [ids[nextIndex], ids[index]];
    reorderChildren(groupId, ids);
  };

  return (
    <div>
      <PageHeader
        pageKey="crm-menus"
        actions={
          <button type="button" className="crm-btn" onClick={resetMenuConfig} disabled={permissions.readOnly}>
            <RotateCcw size={14} /> Reset to Defaults
          </button>
        }
      />

      {menuGroups.map((group) => (
        <div key={group.id} className="crm-section">
          <h3 className="crm-section__title">{group.name}</h3>
          {group.children.map((child, index) => {
            const Icon = resolveCrmIcon(child.icon);
            const badge = child.badgeKey ? badgeCounts[child.badgeKey] : undefined;
            return (
              <div key={child.id} className={`crm-menu-row ${child.hidden ? 'crm-menu-row--hidden' : ''}`}>
                <div className="crm-menu-row__reorder">
                  <button type="button" onClick={() => move(group.id, index, -1)} disabled={permissions.readOnly || index === 0} aria-label="Move up">
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(group.id, index, 1)}
                    disabled={permissions.readOnly || index === group.children.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>
                <span className="crm-menu-row__icon"><Icon size={15} /></span>
                <div className="crm-menu-row__body">
                  <input
                    type="text"
                    className="crm-menu-row__name-input"
                    value={child.name}
                    disabled={permissions.readOnly}
                    onChange={(e) => updateMenuChild(child.id, { name: e.target.value })}
                  />
                  <span className="crm-menu-row__path">
                    {child.path}
                    {badge !== undefined && ` · ${badge} items`}
                  </span>
                </div>
                <button
                  type="button"
                  className={`crm-toggle ${!child.hidden ? 'crm-toggle--on' : ''}`}
                  onClick={() => toggleChildVisibility(child.id)}
                  disabled={permissions.readOnly}
                  aria-label={child.hidden ? `Show ${child.name}` : `Hide ${child.name}`}
                  aria-pressed={!child.hidden}
                >
                  <span className="crm-toggle__knob" />
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default MenuManagementPage;
