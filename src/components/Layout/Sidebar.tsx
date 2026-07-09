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
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../store';
import { toggleSidebar, setActivePage } from '../../store/slices/uiSlice';
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
