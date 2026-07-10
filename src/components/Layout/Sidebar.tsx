import { useState } from 'react';
import {
  LayoutDashboard,
  Store,
  Heart,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../store';
import { toggleSidebar, setActivePage } from '../../store/slices/uiSlice';
import { useVisibleCrmMenu } from '../../hooks/useVisibleCrmMenu';
import { useCrmTheme } from '../../hooks/useCrmTheme';
import { resolveCrmIcon } from '../../modules/crm/components/crmIcons';
import './Sidebar.css';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Store, label: 'Browse', path: '/browse' },
  { icon: Heart, label: 'Favorites', path: '/favorites' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar: React.FC = () => {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useAppSelector((s) => s.auth.user);
  const isAdmin = authUser?.role === 'Admin';
  const crmMenuGroups = useVisibleCrmMenu();
  const { theme: crmTheme } = useCrmTheme();
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  const visibleNavItems = isAdmin
    ? [...navItems, { icon: ShieldCheck, label: 'Admin', path: '/admin' }]
    : navItems;

  const handleNav = (item: NavItem) => {
    dispatch(setActivePage(item.label));
    navigate(item.path);
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <Sparkles size={18} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="sidebar__logo-text"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              YAKKAY
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              type="button"
              className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
              onClick={() => handleNav(item)}
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar__nav-icon">
                <Icon size={20} />
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
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}

        {crmMenuGroups.map((group) => {
          const GroupIcon = resolveCrmIcon(group.icon);
          const isExpanded = expandedGroups[group.id] ?? true;
          const activeChildId = [...group.children]
            .sort((a, b) => b.path.length - a.path.length)
            .find((c) => location.pathname.startsWith(c.path))?.id;
          const isGroupActive = Boolean(activeChildId);

          return (
            <div
              className="sidebar__group"
              key={group.id}
              style={{ '--crm-accent': crmTheme.primaryColor } as React.CSSProperties}
            >
              <button
                type="button"
                className={`sidebar__nav-item sidebar__group-header ${isGroupActive ? 'sidebar__nav-item--active' : ''}`}
                onClick={() =>
                  collapsed
                    ? navigate(group.children[0]?.path ?? group.path)
                    : setExpandedGroups((prev) => ({ ...prev, [group.id]: !isExpanded }))
                }
                title={collapsed ? group.name : undefined}
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
                      {group.name}
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
                    {group.children.map((child) => {
                      const ChildIcon = resolveCrmIcon(child.icon);
                      const isChildActive = child.id === activeChildId;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          className={`sidebar__nav-item sidebar__group-child ${isChildActive ? 'sidebar__nav-item--active' : ''}`}
                          onClick={() => navigate(child.path)}
                        >
                          <span className="sidebar__nav-icon">
                            <ChildIcon size={16} />
                          </span>
                          <span className="sidebar__nav-label">{child.name}</span>
                          {child.badgeCount !== undefined && (
                            <span className="sidebar__badge">{child.badgeCount}</span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="sidebar__toggle-wrapper">
        <button
          type="button"
          className="sidebar__toggle"
          onClick={() => dispatch(toggleSidebar())}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User Section */}
      <div className="sidebar__user">
        <div className="sidebar__user-avatar">
          {getInitials(authUser?.name || 'Guest')}
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="sidebar__user-info"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="sidebar__user-name">{authUser?.name || 'Guest'}</span>
              <span className="sidebar__user-plan">
                <Sparkles size={10} />
                {authUser?.role || 'Member'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default Sidebar;
