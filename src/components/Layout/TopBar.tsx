import React, { useState, useRef, useEffect } from 'react';
import { Bell, Sparkles, LogOut, Settings, Sun, Moon, ChevronDown, Brain, Image, Mic, BarChart3, Code, Cpu, Terminal, Compass, Activity, RotateCw, TrendingUp, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSearch, toggleCategory, resetFilters } from '../../store/slices/toolsSlice';
import { setTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import SearchInput from '../ui/SearchInput';
import './TopBar.css';

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Image,
  Mic,
  BarChart3,
  Code
};

interface MegamenuModel {
  id: string;
  name: string;
  priceText: string;
  icon: string;
  toolId: string;
  category: string;
  type: 'Standard' | 'Enterprise' | 'Open-Source';
  specs: Record<string, string>;
  tagline: string;
  tags: string[];
  highlight: string;
}

const MEGAMENU_MODELS: Record<string, MegamenuModel[]> = {
  'Reasoning Engine': [
    {
      id: 'm1',
      name: 'NexusGPT Pro',
      priceText: 'From $0.02 / 1K',
      icon: 'Brain',
      toolId: 'nexusgpt',
      category: 'Language Models',
      type: 'Standard',
      specs: { Context: '128K', Latency: '120ms', Accuracy: '99.4%' },
      tagline: 'Enterprise reasoning at scale with a 128K context window.',
      tags: ['Multimodal', 'RAG-Ready', 'Fine-tunable'],
      highlight: 'Trusted by 12,400+ dev teams'
    },
    {
      id: 'm2',
      name: 'NexusGPT Enterprise',
      priceText: 'Custom pricing',
      icon: 'Brain',
      toolId: 'nexusgpt',
      category: 'Language Models',
      type: 'Enterprise',
      specs: { Context: '32K', Latency: '110ms', Accuracy: '98.7%' },
      tagline: 'Dedicated infrastructure with custom guardrails & SLAs.',
      tags: ['SSO', 'On-Prem', 'Custom Models'],
      highlight: '99.99% contractual uptime'
    },
    {
      id: 'm3',
      name: 'Llama 3.1 70B',
      priceText: 'Free Self-Host',
      icon: 'Brain',
      toolId: 'nexusgpt',
      category: 'Language Models',
      type: 'Open-Source',
      specs: { Context: '128K', Speed: '45 tok/s', License: 'Llama 3' },
      tagline: 'Fully open-weight reasoning you can self-host anywhere.',
      tags: ['Open-Weight', 'Community', 'No Lock-in'],
      highlight: '45K+ GitHub stars'
    }
  ],
  'Creative Studio': [
    {
      id: 'm4',
      name: 'PixelForge Studio',
      priceText: '$0.03 / Image',
      icon: 'Image',
      toolId: 'pixelforge',
      category: 'Image Generation',
      type: 'Standard',
      specs: { Output: '4K UHD', Render: '3s', Customs: 'Full' },
      tagline: 'Photoreal generation with full creative control.',
      tags: ['ControlNet', 'Inpainting', '4K Output'],
      highlight: '9.5M images generated'
    },
    {
      id: 'm5',
      name: 'PixelForge Enterprise',
      priceText: '$250 / mo',
      icon: 'Image',
      toolId: 'pixelforge',
      category: 'Image Generation',
      type: 'Enterprise',
      specs: { Output: '8K UHD', Latency: '1s', SLA: '99.9%' },
      tagline: 'Studio-grade rendering with dedicated GPU pools.',
      tags: ['8K Output', 'Priority GPU', 'Custom Training'],
      highlight: '1s average render time'
    },
    {
      id: 'm6',
      name: 'Stable Diffusion XL',
      priceText: 'Free Self-Host',
      icon: 'Image',
      toolId: 'pixelforge',
      category: 'Image Generation',
      type: 'Open-Source',
      specs: { BaseSize: '1024x1024', Tuning: 'LoRA', License: 'MIT' },
      tagline: 'Community-tuned diffusion model, MIT licensed.',
      tags: ['Open-Source', 'LoRA', 'Self-Hosted'],
      highlight: 'Free forever'
    }
  ],
  'Vocal & Synthesis': [
    {
      id: 'm7',
      name: 'VoiceCraft Voice',
      priceText: '$0.005 / Call',
      icon: 'Mic',
      toolId: 'voicecraft',
      category: 'Voice & Audio',
      type: 'Standard',
      specs: { Languages: '40+', Latency: '<80ms', Cloning: '30s' },
      tagline: 'Human-quality TTS with instant voice cloning.',
      tags: ['40+ Languages', 'Emotion Control', 'Low Latency'],
      highlight: '<80ms first byte'
    },
    {
      id: 'm8',
      name: 'VoiceCraft Enterprise',
      priceText: 'Contact sales',
      icon: 'Mic',
      toolId: 'voicecraft',
      category: 'Voice & Audio',
      type: 'Enterprise',
      specs: { SLA: '99.99%', Channels: 'Unlimited', DirectClone: '5s' },
      tagline: 'Mission-critical voice infrastructure for global IVR.',
      tags: ['Unlimited Channels', '99.99% SLA', 'Priority Support'],
      highlight: 'Used in 30+ countries'
    },
    {
      id: 'm9',
      name: 'Bark TTS Open',
      priceText: 'Free Self-Host',
      icon: 'Mic',
      toolId: 'voicecraft',
      category: 'Voice & Audio',
      type: 'Open-Source',
      specs: { Emotion: 'High', Speed: 'Real-time', License: 'Apache' },
      tagline: 'Expressive open-source speech synthesis.',
      tags: ['Apache 2.0', 'Real-time', 'Community'],
      highlight: 'Free forever'
    }
  ],
  'Analytics & BI': [
    {
      id: 'm10',
      name: 'DataLens Standard',
      priceText: '$49 / mo',
      icon: 'BarChart3',
      toolId: 'datalens',
      category: 'Data Analytics',
      type: 'Standard',
      specs: { SQLAuto: 'Yes', Connectors: '6+', 'Real-time': 'Yes' },
      tagline: 'Ask your data questions in plain English.',
      tags: ['Natural Language SQL', 'Real-time', '6+ Connectors'],
      highlight: '2.1B rows queried / mo'
    },
    {
      id: 'm11',
      name: 'DataLens Enterprise',
      priceText: '$499 / mo',
      icon: 'BarChart3',
      toolId: 'datalens',
      category: 'Data Analytics',
      type: 'Enterprise',
      specs: { Connectors: '40+', Governance: 'SSO/HIPAA', CustomViz: 'Yes' },
      tagline: 'Governed analytics with enterprise SSO.',
      tags: ['Row-level Security', 'SSO/HIPAA', '40+ Connectors'],
      highlight: 'Audit-ready by default'
    },
    {
      id: 'm12',
      name: 'Metabase OSS',
      priceText: 'Free Self-Host',
      icon: 'BarChart3',
      toolId: 'datalens',
      category: 'Data Analytics',
      type: 'Open-Source',
      specs: { Queries: 'SQL', Export: 'CSV/XLSX', Setup: 'Docker' },
      tagline: 'Self-hosted BI with SQL, free forever.',
      tags: ['Open-Source', 'Docker', 'CSV/XLSX Export'],
      highlight: 'Free forever'
    }
  ],
  'Developer Co-Pilot': [
    {
      id: 'm13',
      name: 'CodePilot Pro',
      priceText: '$19 / mo',
      icon: 'Code',
      toolId: 'codepilot',
      category: 'Code Assistant',
      type: 'Standard',
      specs: { Context: '32K', Languages: '20+', InlineRefactor: 'Yes' },
      tagline: 'Inline completions across 20+ languages.',
      tags: ['Inline Refactor', '32K Context', 'IDE-Native'],
      highlight: '124K active developers'
    },
    {
      id: 'm14',
      name: 'CodePilot Enterprise',
      priceText: '$39 / user/mo',
      icon: 'Code',
      toolId: 'codepilot',
      category: 'Code Assistant',
      type: 'Enterprise',
      specs: { SelfHostCode: 'Yes', SecurityScan: 'OWASP', SSO: 'Yes' },
      tagline: 'Secure, self-hostable AI pair programming.',
      tags: ['OWASP Scan', 'SSO', 'Self-Host Code'],
      highlight: 'SOC 2 Type II certified'
    },
    {
      id: 'm15',
      name: 'StarCoder 2',
      priceText: 'Free Self-Host',
      icon: 'Code',
      toolId: 'codepilot',
      category: 'Code Assistant',
      type: 'Open-Source',
      specs: { Parameters: '15B', Context: '8K', License: 'OpenRAIL' },
      tagline: 'Open-weight coding model for every stack.',
      tags: ['OpenRAIL', '15B Params', 'Self-Hosted'],
      highlight: 'Free forever'
    }
  ]
};

const CLASS_META: Record<string, { icon: LucideIcon; color: string }> = {
  'Reasoning Engine': { icon: Brain, color: '#8b5cf6' },
  'Creative Studio': { icon: Image, color: '#ec4899' },
  'Vocal & Synthesis': { icon: Mic, color: '#10b981' },
  'Analytics & BI': { icon: BarChart3, color: '#f59e0b' },
  'Developer Co-Pilot': { icon: Code, color: '#06b6d4' },
};

const TopBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const searchValue = useAppSelector((s) => s.tools.filters.search);
  const theme = useAppSelector((s) => s.ui.theme);
  const authUser = useAppSelector((s) => s.auth.user);
  
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [oldMenuOpen, setOldMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const oldMenuRef = useRef<HTMLDivElement>(null);

  // Selector states inside Mercedes-Benz style menu
  const [selectedClass, setSelectedClass] = useState('Reasoning Engine');
  const [activePill, setActivePill] = useState<'Standard' | 'Enterprise' | 'Open-Source'>('Standard');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleCardFlip = (id: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  // Close mega menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const trigger = document.querySelector('.topbar__nav-link--mega');
        if (trigger && trigger.contains(event.target as Node)) {
          return;
        }
        setMegaMenuOpen(false);
      }

      if (oldMenuRef.current && !oldMenuRef.current.contains(event.target as Node)) {
        const trigger = document.querySelector('.topbar__nav-link--old');
        if (trigger && trigger.contains(event.target as Node)) {
          return;
        }
        setOldMenuOpen(false);
      }
    };

    if (megaMenuOpen || oldMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [megaMenuOpen, oldMenuOpen]);

  // Derive page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/browse') return 'Browse Tools';
    if (path.startsWith('/tool/')) return 'Tool Details';
    if (path === '/analytics') return 'Analytics';
    if (path === '/favorites') return 'Favorites';
    if (path === '/settings') return 'Settings';
    return 'NexusAI';
  };

  const handleSearchChange = (val: string) => {
    dispatch(setSearch(val));
    if (location.pathname !== '/browse') {
      navigate('/browse');
    }
  };

  const handleCategoryClick = (cat: any) => {
    dispatch(resetFilters());
    dispatch(toggleCategory(cat));
    navigate('/browse');
    setMegaMenuOpen(false);
    setOldMenuOpen(false);
  };

  const getToolIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Brain;
  };

  const getPillCount = (pill: string, clsName: string): number => {
    const list = MEGAMENU_MODELS[clsName] || [];
    return list.filter(item => item.type === pill).length;
  };

  const getModelsForClass = (clsName: string, pill: string): MegamenuModel[] => {
    const list = MEGAMENU_MODELS[clsName] || [];
    return list.filter(item => item.type === pill);
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className={`topbar ${collapsed ? 'topbar--collapsed' : ''}`}>
      <div className="topbar__left">
        <h1 className="topbar__title" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          {getPageTitle()}
        </h1>
        
        {/* Mercedes-Benz Style Header Navigation Links */}
        <nav className="topbar__nav">
          <button
            type="button"
            className={`topbar__nav-link topbar__nav-link--mega ${megaMenuOpen ? 'topbar__nav-link--active' : ''}`}
            onClick={() => {
              setMegaMenuOpen(!megaMenuOpen);
              setOldMenuOpen(false);
            }}
            aria-expanded={megaMenuOpen}
          >
            AI Classes
            <ChevronDown size={12} className={`topbar__nav-chevron ${megaMenuOpen ? 'topbar__nav-chevron--rotate' : ''}`} />
          </button>

          <button
            type="button"
            className={`topbar__nav-link topbar__nav-link--old ${oldMenuOpen ? 'topbar__nav-link--active' : ''}`}
            onClick={() => {
              setOldMenuOpen(!oldMenuOpen);
              setMegaMenuOpen(false);
            }}
            aria-expanded={oldMenuOpen}
          >
            AI Categories
            <ChevronDown size={12} className={`topbar__nav-chevron ${oldMenuOpen ? 'topbar__nav-chevron--rotate' : ''}`} />
          </button>
          
          <button
            type="button"
            className="topbar__nav-link"
            onClick={() => {
              navigate('/analytics');
              setMegaMenuOpen(false);
              setOldMenuOpen(false);
            }}
          >
            Estimators
          </button>

          <button
            type="button"
            className="topbar__nav-link"
            onClick={() => {
              navigate('/browse');
              setMegaMenuOpen(false);
              setOldMenuOpen(false);
            }}
          >
            Discover All
          </button>
        </nav>
      </div>

      <div className="topbar__center">
        <SearchInput
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Type to search AI tools..."
          shortcut="⌘K"
        />
      </div>

      <div className="topbar__right">
        {/* Theme Toggle */}
        <button
          type="button"
          className="topbar__icon-btn"
          onClick={handleToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button type="button" className="topbar__icon-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="topbar__notification-badge" />
        </button>

        {/* User Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button type="button" className="topbar__avatar-trigger">
              <div className="topbar__avatar">{getInitials(authUser?.name || 'Guest')}</div>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="topbar__dropdown-content" sideOffset={8} align="end">
              <div className="topbar__dropdown-header">
                <p className="topbar__dropdown-name">{authUser?.name || 'Guest'}</p>
                <p className="topbar__dropdown-email">{authUser?.email || ''}</p>
              </div>

              <DropdownMenu.Separator className="topbar__dropdown-separator" />

              <DropdownMenu.Item className="topbar__dropdown-item" onSelect={() => navigate('/settings')}>
                <Settings size={16} />
                <span>Account Settings</span>
              </DropdownMenu.Item>

              <DropdownMenu.Item className="topbar__dropdown-item" onSelect={() => navigate('/browse')}>
                <Sparkles size={16} />
                <span>Upgrade Plan</span>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="topbar__dropdown-separator" />

              <DropdownMenu.Item className="topbar__dropdown-item topbar__dropdown-item--danger" onSelect={handleLogout}>
                <LogOut size={16} />
                <span>Log Out</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Mercedes-Benz Vehicle Selector inspired AI Model Configurator Megamenu */}
      <AnimatePresence>
        {megaMenuOpen && (
          <motion.div
            className="megamenu-mb"
            ref={menuRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="megamenu-mb__bg-clip" aria-hidden="true">
              <div className="megamenu-mb__bg-tile" />
              <div className="megamenu-mb__bg-glow" />
            </div>
            <div className="megamenu-mb__container">

              {/* Left Column: Solution Navigation */}
              <div className="megamenu-mb__nav-column">
                <h2 className="megamenu-mb__nav-title">AI Solutions</h2>
                <ul className="megamenu-mb__nav-list">
                  <li className="megamenu-mb__nav-item" onClick={() => { navigate('/browse'); setMegaMenuOpen(false); }}>All AI Classes</li>
                  <li className="megamenu-mb__nav-item" onClick={() => { navigate('/analytics'); setMegaMenuOpen(false); }}>Compare Specs</li>
                  <li className="megamenu-mb__nav-item" onClick={() => { navigate('/browse'); setMegaMenuOpen(false); }}>Special Pricing</li>
                  <li className="megamenu-mb__nav-item" onClick={() => { navigate('/'); setMegaMenuOpen(false); }}>Developer Program</li>
                  <li className="megamenu-mb__nav-item" onClick={() => { navigate('/browse'); setMegaMenuOpen(false); }}>Future Roadmap</li>
                </ul>

                <h4 className="megamenu-mb__nav-subtitle">Features & Benchmarks</h4>
                <ul className="megamenu-mb__nav-list">
                  <li className="megamenu-mb__nav-item" onClick={() => { navigate('/settings'); setMegaMenuOpen(false); }}>Safety Guardrails</li>
                  <li className="megamenu-mb__nav-item" onClick={() => { navigate('/browse'); setMegaMenuOpen(false); }}>Multi-modal Specs</li>
                  <li className="megamenu-mb__nav-item" onClick={() => { navigate('/analytics'); setMegaMenuOpen(false); }}>API Latencies Report</li>
                </ul>

                <div className="megamenu-mb__promo-tile">
                  <TrendingUp size={16} />
                  <div>
                    <strong>New: Reasoning v3</strong>
                    <span>34% faster inference, now in beta</span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Model Classes Category Selector */}
              <div className="megamenu-mb__classes-column">
                {['Reasoning Engine', 'Creative Studio', 'Vocal & Synthesis', 'Analytics & BI', 'Developer Co-Pilot'].map((cls) => {
                  const meta = CLASS_META[cls];
                  const ClsIcon = meta.icon;
                  const isActive = selectedClass === cls;
                  return (
                    <button
                      key={cls}
                      type="button"
                      className={`megamenu-mb__class-trigger ${isActive ? 'megamenu-mb__class-trigger--active' : ''}`}
                      style={isActive ? ({ '--class-accent': meta.color } as React.CSSProperties) : undefined}
                      onClick={() => setSelectedClass(cls)}
                    >
                      <span className="megamenu-mb__class-icon" style={{ background: `${meta.color}1f`, color: meta.color }}>
                        <ClsIcon size={16} />
                      </span>
                      {cls}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Dynamic Cards Grid */}
              <div className="megamenu-mb__models-column">

                {/* Top Filter Pills */}
                <div className="megamenu-mb__filter-pills">
                  {(['Standard', 'Enterprise', 'Open-Source'] as const).map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      className={`megamenu-mb__filter-pill ${activePill === pill ? 'megamenu-mb__filter-pill--active' : ''}`}
                      onClick={() => setActivePill(pill)}
                    >
                      {pill} ({getPillCount(pill, selectedClass)})
                    </button>
                  ))}
                  <span className="megamenu-mb__flip-hint">
                    <RotateCw size={11} /> Click a card to flip
                  </span>
                </div>

                {/* Models Grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedClass}-${activePill}`}
                    className="megamenu-mb__models-grid"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.06 } },
                    }}
                  >
                    {getModelsForClass(selectedClass, activePill).map((model) => {
                      const ToolIcon = getToolIcon(model.icon);
                      const classColor = CLASS_META[selectedClass]?.color || '#8b5cf6';
                      const isFlipped = flippedCards.has(model.id);
                      return (
                        <motion.div
                          key={model.id}
                          className="megamenu-mb__flip-outer"
                          variants={{
                            hidden: { opacity: 0, y: 14, scale: 0.97 },
                            visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
                          }}
                          whileHover={{ y: -4 }}
                        >
                          <div
                            className={`megamenu-mb__flip-inner ${isFlipped ? 'megamenu-mb__flip-inner--flipped' : ''}`}
                          >
                            {/* FRONT FACE */}
                            <div className="megamenu-mb__model-card megamenu-mb__model-card--front">
                              <button
                                type="button"
                                className="megamenu-mb__flip-btn"
                                onClick={() => toggleCardFlip(model.id)}
                                aria-label={`Flip ${model.name} card for details`}
                              >
                                <RotateCw size={12} />
                              </button>

                              <div className="megamenu-mb__model-visual">
                                <div
                                  className="megamenu-mb__model-icon-circle"
                                  style={{ background: `linear-gradient(135deg, ${classColor}33, ${classColor}0d)`, color: classColor }}
                                >
                                  <ToolIcon size={20} />
                                </div>
                                <div className="megamenu-mb__model-meta">
                                  <h4 className="megamenu-mb__model-name">{model.name}</h4>
                                  <span className="megamenu-mb__model-price">{model.priceText}</span>
                                </div>
                              </div>

                              <p className="megamenu-mb__model-tagline">{model.tagline}</p>

                              <div className="megamenu-mb__model-tags">
                                {model.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="megamenu-mb__model-tag" style={{ color: classColor, borderColor: `${classColor}40`, background: `${classColor}12` }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <div className="megamenu-mb__model-specs-grid">
                                {Object.entries(model.specs).map(([label, val]) => (
                                  <div key={label} className="megamenu-mb__model-spec-row">
                                    <span className="megamenu-mb__model-spec-label">{label}</span>
                                    <span className="megamenu-mb__model-spec-value">{val}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="megamenu-mb__model-actions">
                                <button
                                  type="button"
                                  className="megamenu-mb__model-btn megamenu-mb__model-btn--primary"
                                  onClick={() => {
                                    navigate(`/tool/${model.toolId}`);
                                    setMegaMenuOpen(false);
                                  }}
                                >
                                  Configure
                                </button>
                                <button
                                  type="button"
                                  className="megamenu-mb__model-btn megamenu-mb__model-btn--secondary"
                                  onClick={() => handleCategoryClick(model.category)}
                                >
                                  Deploy
                                </button>
                              </div>
                            </div>

                            {/* BACK FACE */}
                            <div
                              className="megamenu-mb__model-card megamenu-mb__model-card--back"
                              style={{ '--model-accent': classColor } as React.CSSProperties}
                            >
                              <button
                                type="button"
                                className="megamenu-mb__flip-btn"
                                onClick={() => toggleCardFlip(model.id)}
                                aria-label={`Flip ${model.name} card back to summary`}
                              >
                                <RotateCw size={12} />
                              </button>

                              <div
                                className="megamenu-mb__model-icon-circle megamenu-mb__model-icon-circle--sm"
                                style={{ background: `${classColor}26`, color: classColor }}
                              >
                                <ToolIcon size={16} />
                              </div>

                              <h4 className="megamenu-mb__model-name">{model.name}</h4>
                              <p className="megamenu-mb__model-back-desc">{model.tagline}</p>

                              <div className="megamenu-mb__model-tags megamenu-mb__model-tags--wrap">
                                {model.tags.map((tag) => (
                                  <span key={tag} className="megamenu-mb__model-tag" style={{ color: classColor, borderColor: `${classColor}40`, background: `${classColor}12` }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <div className="megamenu-mb__model-highlight" style={{ color: classColor }}>
                                <ArrowUpRight size={13} />
                                {model.highlight}
                              </div>

                              <div className="megamenu-mb__model-actions">
                                <button
                                  type="button"
                                  className="megamenu-mb__model-btn megamenu-mb__model-btn--primary"
                                  onClick={() => {
                                    navigate(`/tool/${model.toolId}`);
                                    setMegaMenuOpen(false);
                                  }}
                                >
                                  Configure
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Old Categories Mega Menu */}
      <AnimatePresence>
        {oldMenuOpen && (
          <motion.div
            className="megamenu"
            ref={oldMenuRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
          <div className="megamenu-mb__bg-tile" aria-hidden="true" />
          <div className="megamenu__grid">
            <div className="megamenu__column">
              <h4 className="megamenu__column-title">
                <Cpu size={14} /> AI Engines
              </h4>
              <ul className="megamenu__links">
                <li>
                  <button type="button" onClick={() => handleCategoryClick('Language Models')}>
                    Language Models
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleCategoryClick('Code Assistant')}>
                    Code Assistant
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleCategoryClick('Document AI')}>
                    Document AI
                  </button>
                </li>
              </ul>
            </div>

            <div className="megamenu__column">
              <h4 className="megamenu__column-title">
                <Terminal size={14} /> Media & Speech
              </h4>
              <ul className="megamenu__links">
                <li>
                  <button type="button" onClick={() => handleCategoryClick('Image Generation')}>
                    Image Generation
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleCategoryClick('Video Generation')}>
                    Video Generation
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleCategoryClick('Voice & Audio')}>
                    Voice & Audio
                  </button>
                </li>
              </ul>
            </div>

            <div className="megamenu__column">
              <h4 className="megamenu__column-title">
                <Compass size={14} /> Goal Planning
              </h4>
              <ul className="megamenu__links">
                <li>
                  <button type="button" onClick={() => handleCategoryClick('Data Analytics')}>
                    Data Analytics
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleCategoryClick('Search & Research')}>
                    Search & Research
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/analytics');
                      setOldMenuOpen(false);
                    }}
                    className="megamenu__link--highlight"
                  >
                    <Activity size={12} /> Cost & Uptime Estimator
                  </button>
                </li>
              </ul>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopBar;
