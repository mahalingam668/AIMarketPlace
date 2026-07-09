import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Sparkles, Bell, Sun, Moon, ChevronDown, LayoutDashboard, Settings, LogOut, Rocket } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSearch } from '../../store/slices/toolsSlice';
import { setTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import SearchBar from './SearchBar';
import MegaMenu, { MEGA_MENU_SECTIONS } from './MegaMenu';
import './StickyHeader.css';

function StickyHeader() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const searchValue = useAppSelector((s) => s.tools.filters.search);
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // Hover-to-open (Azure / Microsoft Learn style) with short debounces so a
  // quick mouse pass across the nav doesn't flicker every panel open/closed.
  const handleTriggerEnter = (key: string) => {
    clearTimers();
    openTimer.current = setTimeout(() => setActiveSection(key), 90);
  };

  const handleAreaLeave = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setActiveSection(null), 200);
  };

  const handleAreaEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
    };
    if (activeSection) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeSection]);

  useEffect(() => clearTimers, []);

  const handleSearchSubmit = (value: string) => {
    dispatch(setSearch(value));
    navigate('/browse');
  };

  return (
    <header className="sticky-header" ref={menuRef} onMouseLeave={handleAreaLeave} onMouseEnter={handleAreaEnter}>
      <div className="sticky-header__row">
        <div className="sticky-header__brand" onClick={() => navigate('/')}>
          <span className="sticky-header__brand-icon">
            <Sparkles size={18} />
          </span>
          <span className="sticky-header__brand-text">YAKKAY <span>AI Line</span></span>
        </div>

        <nav className="sticky-header__nav">
          {MEGA_MENU_SECTIONS.map((section) => (
            <button
              key={section.key}
              type="button"
              className={`sticky-header__nav-link ${activeSection === section.key ? 'sticky-header__nav-link--active' : ''}`}
              onMouseEnter={() => handleTriggerEnter(section.key)}
              onClick={() => setActiveSection((cur) => (cur === section.key ? null : section.key))}
              aria-expanded={activeSection === section.key}
            >
              {section.label}
              <ChevronDown size={13} className={activeSection === section.key ? 'sticky-header__chevron--open' : ''} />
              {activeSection === section.key && (
                <motion.span
                  className="sticky-header__nav-indicator"
                  layoutId="sticky-header-nav-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
          <button type="button" className="sticky-header__nav-link" onClick={() => navigate('/pricing')}>
            Pricing
          </button>
        </nav>

        <div className="sticky-header__search">
          <SearchBar value={searchValue} onChange={(v) => dispatch(setSearch(v))} onSubmit={handleSearchSubmit} />
        </div>

        <div className="sticky-header__actions">
          <button
            type="button"
            className="sticky-header__icon-btn"
            onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button type="button" className="sticky-header__icon-btn" aria-label="Notifications">
            <Bell size={18} />
            <span className="sticky-header__notification-dot" />
          </button>

          {isAuthenticated ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button type="button" className="sticky-header__avatar">
                  {(user?.name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="sticky-header__dropdown" sideOffset={8} align="end">
                  <div className="sticky-header__dropdown-header">
                    <p className="sticky-header__dropdown-name">{user?.name}</p>
                    <p className="sticky-header__dropdown-email">{user?.email}</p>
                  </div>
                  <DropdownMenu.Separator className="sticky-header__dropdown-separator" />
                  <DropdownMenu.Item className="sticky-header__dropdown-item" onSelect={() => navigate('/dashboard')}>
                    <LayoutDashboard size={15} /> Dashboard
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="sticky-header__dropdown-item" onSelect={() => navigate('/settings')}>
                    <Settings size={15} /> Settings
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="sticky-header__dropdown-separator" />
                  <DropdownMenu.Item
                    className="sticky-header__dropdown-item sticky-header__dropdown-item--danger"
                    onSelect={() => {
                      dispatch(logout());
                      navigate('/');
                    }}
                  >
                    <LogOut size={15} /> Log Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <button type="button" className="sticky-header__login-btn" onClick={() => navigate('/login')}>
              Log In
            </button>
          )}

          <button type="button" className="sticky-header__demo-btn" onClick={() => navigate('/request-demo')}>
            <Rocket size={14} />
            Request Demo
          </button>
        </div>
      </div>

      {activeSection && <MegaMenu activeKey={activeSection} onNavigate={() => setActiveSection(null)} />}
    </header>
  );
}

export default StickyHeader;
