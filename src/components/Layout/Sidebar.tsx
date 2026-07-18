import {
  LayoutDashboard,
  Store,
  Heart,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Gauge,
  UserCircle,
  Package,
  Send,
  ListTodo,
  Wallet,
  Users,
  Scale,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../store';
import { toggleSidebar, setActivePage } from '../../store/slices/uiSlice';
import { useVisibleCrmMenu } from '../../hooks/useVisibleCrmMenu';
import { useCrmTheme } from '../../hooks/useCrmTheme';
import { resolveCrmIcon } from '../../modules/crm/components/crmIcons';
import { canAccess } from '../../modules/auth/roles';
import SidebarNavGroup from './SidebarNavGroup';
import type { SidebarNavGroupItem } from './SidebarNavGroup';
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

const FREELANCER_NAV_ITEMS: SidebarNavGroupItem[] = [
  { id: 'freelancer-dashboard', label: 'Dashboard', path: '/freelancer/dashboard', icon: Gauge },
  { id: 'freelancer-profile', label: 'Profile', path: '/freelancer/profile', icon: UserCircle },
  { id: 'freelancer-gigs', label: 'Gig Management', path: '/freelancer/gigs', icon: Package },
  { id: 'freelancer-proposals', label: 'Proposals', path: '/freelancer/proposals', icon: Send },
  { id: 'freelancer-earnings', label: 'Earnings', path: '/freelancer/earnings', icon: Wallet },
];

const ADMIN_NAV_ITEMS: SidebarNavGroupItem[] = [
  { id: 'admin-overview', label: 'Overview', path: '/admin', icon: Gauge },
  { id: 'admin-categories', label: 'Categories', path: '/admin/categories', icon: ListTodo },
  { id: 'admin-users', label: 'User Management', path: '/admin/users', icon: Users },
  { id: 'admin-disputes', label: 'Dispute Resolution', path: '/admin/disputes', icon: Scale },
];

const Sidebar: React.FC = () => {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useAppSelector((s) => s.auth.user);
  const role = authUser?.role ?? 'Guest';
  const crmMenuGroups = useVisibleCrmMenu();
  const { theme: crmTheme } = useCrmTheme();

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
        {navItems.map((item) => {
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

        {canAccess(role, 'freelancer') && (
          <SidebarNavGroup
            label="Freelancer"
            icon={Briefcase}
            items={FREELANCER_NAV_ITEMS}
            collapsed={collapsed}
          />
        )}

        {canAccess(role, 'admin') && (
          <SidebarNavGroup
            label="Admin"
            icon={ShieldCheck}
            items={ADMIN_NAV_ITEMS}
            collapsed={collapsed}
          />
        )}

        {canAccess(role, 'crm') &&
          crmMenuGroups.map((group) => (
            <SidebarNavGroup
              key={group.id}
              label={group.name}
              icon={resolveCrmIcon(group.icon)}
              collapsed={collapsed}
              accentColor={crmTheme.primaryColor}
              items={group.children.map((child) => ({
                id: child.id,
                label: child.name,
                path: child.path,
                icon: resolveCrmIcon(child.icon),
                badgeCount: child.badgeCount,
              }))}
            />
          ))}
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
                {authUser?.role || 'Guest'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default Sidebar;
