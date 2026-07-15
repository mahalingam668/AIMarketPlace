import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Sparkles, Bell, Sun, Moon, ChevronDown, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSearch } from '../../store/slices/toolsSlice';
import { setTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import SearchBar from './SearchBar';
import MegaMenu from './MegaMenu';
import './StickyHeader.css';

function StickyHeader() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const searchValue = useAppSelector((s) => s.tools.filters.search);
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  // A single "Explore" trigger now opens the mega menu — section switching
  // happens via the tab row inside MegaMenu itself.
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // Hover-to-open (Azure / Microsoft Learn style) with a short debounce so a
  // quick mouse pass across the nav doesn't flicker the panel open.
  const handleTriggerEnter = () => {
    clearTimers();
    openTimer.current = setTimeout(() => setIsExploreOpen(true), 90);
  };

  const handleAreaLeave = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setIsExploreOpen(false), 200);
  };

  const handleAreaEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
    };
    if (isExploreOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExploreOpen]);

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
          <button
            type="button"
            className={`sticky-header__nav-link ${isExploreOpen ? 'sticky-header__nav-link--active' : ''}`}
            onMouseEnter={handleTriggerEnter}
            onClick={() => setIsExploreOpen((cur) => !cur)}
            aria-expanded={isExploreOpen}
          >
            Explore
            <ChevronDown size={13} className={isExploreOpen ? 'sticky-header__chevron--open' : ''} />
          </button>
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

          {isAuthenticated && (
            <button type="button" className="sticky-header__icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="sticky-header__notification-dot" />
            </button>
          )}

          <button type="button" className="sticky-header__seller-link" onClick={() => navigate('/freelancer')}>
            Become a Seller
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
            <>
              <button type="button" className="sticky-header__login-btn" onClick={() => navigate('/login')}>
                Sign in
              </button>
              <button type="button" className="sticky-header__join-btn" onClick={() => navigate('/register')}>
                Join
              </button>
            </>
          )}
        </div>
      </div>

      {isExploreOpen && <MegaMenu onNavigate={() => setIsExploreOpen(false)} />}
    </header>
  );
}

export default StickyHeader;
