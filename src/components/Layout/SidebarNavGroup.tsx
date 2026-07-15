import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export interface SidebarNavGroupItem {
  id: string | number;
  label: string;
  path: string;
  icon: LucideIcon;
  badgeCount?: number;
}

interface SidebarNavGroupProps {
  label: string;
  icon: LucideIcon;
  items: SidebarNavGroupItem[];
  collapsed: boolean;
  /** Overrides the active/hover accent color for this group only (falls back to var(--accent-primary)). */
  accentColor?: string;
}

/**
 * A collapsible nav-group block for the app Sidebar — expand/collapse, active
 * state (by longest-matching child path), hover animation, per-item badge
 * counts. Shared by every portal (CRM, Freelancer, Buyer, ...) added to the
 * sidebar so each one doesn't reinvent this interaction.
 */
function SidebarNavGroup({ label, icon: GroupIcon, items, collapsed, accentColor }: SidebarNavGroupProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const activeItemId = [...items]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) => location.pathname.startsWith(item.path))?.id;
  const isGroupActive = activeItemId !== undefined;

  return (
    <div
      className="sidebar__group"
      style={accentColor ? ({ '--sidebar-group-accent': accentColor } as React.CSSProperties) : undefined}
    >
      <button
        type="button"
        className={`sidebar__nav-item sidebar__group-header ${isGroupActive ? 'sidebar__nav-item--active' : ''}`}
        onClick={() => (collapsed ? navigate(items[0]?.path ?? '/') : setIsExpanded((prev) => !prev))}
        title={collapsed ? label : undefined}
      >
        <span className="sidebar__nav-icon">
          <GroupIcon size={20} />
        </span>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="sidebar__nav-label"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        {!collapsed && (
          <ChevronDown size={14} className={`sidebar__group-chevron ${isExpanded ? 'sidebar__group-chevron--open' : ''}`} />
        )}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && isExpanded && (
          <motion.div
            className="sidebar__group-children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {items.map((item) => {
              const ItemIcon = item.icon;
              const isItemActive = item.id === activeItemId;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar__nav-item sidebar__group-child ${isItemActive ? 'sidebar__nav-item--active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="sidebar__nav-icon">
                    <ItemIcon size={16} />
                  </span>
                  <span className="sidebar__nav-label">{item.label}</span>
                  {item.badgeCount !== undefined && (
                    <span className="sidebar__badge">{item.badgeCount}</span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SidebarNavGroup;
