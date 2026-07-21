import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Brain, Image, Code, BarChart3, Mic, Video, FileText, Search, Shield,
  Package, Activity, Users, ShieldCheck, ArrowRight, Star, Building2,
  Landmark, HeartPulse, Factory, ShoppingCart, GraduationCap, Cpu,
  TrendingUp, Flame,
  type LucideIcon,
} from 'lucide-react';
import SearchBar from '../../components/header/SearchBar';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSearch, toggleCategory, resetFilters } from '../../store/slices/toolsSlice';
import { aiTools, categoryStats, trendingToolIds } from '../../data/mockData';
import './Home.css';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Language Models': Brain,
  'Image Generation': Image,
  'Code Assistant': Code,
  'Data Analytics': BarChart3,
  'Voice & Audio': Mic,
  'Video Generation': Video,
  'Document AI': FileText,
  'Search & Research': Search,
};

const TOOL_ICONS: Record<string, LucideIcon> = {
  Brain, Image, Code, Shield, BarChart3, Mic, Video, FileText, Search,
};

const TRUSTED_BY = [
  'Meridian Financial Group',
  'Alderbrook Health Systems',
  'Falkirk Manufacturing Co.',
  'Zenith Retail Holdings',
  'Harrowgate Research Institute',
  'PacifiCore Logistics',
];

const INDUSTRY_STRIP = [
  { label: 'Financial Services', icon: Landmark },
  { label: 'Healthcare & Life Sciences', icon: HeartPulse },
  { label: 'Manufacturing', icon: Factory },
  { label: 'Retail & Commerce', icon: ShoppingCart },
  { label: 'Public Sector', icon: Building2 },
  { label: 'Higher Education', icon: GraduationCap },
  { label: 'Technology', icon: Cpu },
];

const STATS = [
  { label: 'AI Tools in Catalog', value: '2,847', icon: Package },
  { label: 'API Calls / Day', value: '1.2M', icon: Activity },
  { label: 'Enterprise Teams', value: '48.2K', icon: Users },
  { label: 'Platform Uptime', value: '99.99%', icon: ShieldCheck },
];

const SUGGESTIONS = ['NexusGPT', 'Image Generation', 'Code Assistant', 'Data Analytics', 'Voice Cloning'];

// Week-over-week growth shown per trending rank — there's no modeled
// "weekly growth" field on AITool, so this is a display-layer signal for
// *why* something is trending, deliberately descending by rank rather than
// a real per-tool metric.
const TRENDING_GROWTH = [48, 34, 27, 19, 12];

// Mirrors the familiar Fiverr-style top-nav category chrome for visual
// recognition, but this platform is deliberately a single-vertical AI
// Services marketplace (blueprint §1.1) — "AI Services" is the only real,
// distinct category here. The other 12 aren't built out as separate
// taxonomies; clicking one explains the focus and routes into the real
// AI Services catalog instead of being a dead link.
const QUICK_TOPICS: { label: string; isAiServices?: boolean }[] = [
  { label: 'Graphics & Design' },
  { label: 'Programming & Tech' },
  { label: 'Digital Marketing' },
  { label: 'Video & Animation' },
  { label: 'Writing & Translation' },
  { label: 'Music & Audio' },
  { label: 'Business' },
  { label: 'Finance' },
  { label: 'AI Services', isAiServices: true },
  { label: 'Personal Growth' },
  { label: 'Consulting' },
  { label: 'Data' },
  { label: 'Photography' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchValue = useAppSelector((s) => s.tools.filters.search);

  const featuredTools = useMemo(() => aiTools.filter((t) => t.featured).slice(0, 4), []);
  const trendingTools = useMemo(
    () => trendingToolIds.map((id) => aiTools.find((t) => t.id === id)).filter((t): t is (typeof aiTools)[number] => Boolean(t)),
    []
  );

  const handleSearchSubmit = (value: string) => {
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleCategoryClick = (category: string) => {
    dispatch(resetFilters());
    dispatch(toggleCategory(category));
    navigate('/browse');
  };

  const handleQuickTopicClick = (topic: (typeof QUICK_TOPICS)[number]) => {
    if (!topic.isAiServices) {
      toast('YAKKAY AI Market is a focused AI Services marketplace — here\'s our full AI Services catalog.', { icon: '✨' });
    }
    navigate('/categories');
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <motion.div
          className="home__hero-inner"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="home__hero-title">Find the right AI expert for your business</h1>
          <p className="home__hero-subtitle">
            Work with vetted developers and vendors to discover, deploy, and integrate production-grade AI — fast.
          </p>

          <div className="home__hero-search">
            <SearchBar
              value={searchValue}
              onChange={(v) => dispatch(setSearch(v))}
              onSubmit={handleSearchSubmit}
              size="hero"
            />
          </div>

          <div className="home__hero-suggestions">
            <span>Popular:</span>
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => handleSearchSubmit(s)}>
                {s}
              </button>
            ))}
          </div>

          <button type="button" className="home__section-link" onClick={() => navigate('/categories')}>
            Browse AI services by category <ArrowRight size={14} />
          </button>
        </motion.div>
      </section>

      {/* Fiverr-style quick-topics strip — see QUICK_TOPICS comment above for
          why only "AI Services" is a real, distinct destination here. */}
      <section className="home__topics-strip">
        <div className="home__topics-strip-row">
          <span className="home__topics-strip-label">Trending 🔥</span>
          {QUICK_TOPICS.map((topic) => (
            <button
              key={topic.label}
              type="button"
              className={`home__topic-chip ${topic.isAiServices ? 'home__topic-chip--active' : ''}`}
              onClick={() => handleQuickTopicClick(topic)}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </section>

      {/* Category quick-access strip (icon-tile row, directly under the hero) */}
      <motion.section
        className="home__category-strip"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="home__category-strip-row">
          {categoryStats.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.category] || Brain;
            return (
              <motion.button
                key={cat.category}
                type="button"
                className="home__category-pill"
                variants={itemVariants}
                onClick={() => handleCategoryClick(cat.category)}
              >
                <span className="home__category-pill-icon">
                  <Icon size={22} />
                </span>
                <span className="home__category-pill-label">{cat.category}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Trusted-by strip */}
      <section className="home__trusted-strip">
        <p className="home__trusted-strip-label">Trusted by enterprise teams at</p>
        <div className="home__trusted-strip-row">
          {TRUSTED_BY.map((name) => (
            <span key={name} className="home__trusted-strip-name">{name}</span>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <motion.section
        className="home__stats"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} className="home__stat" variants={itemVariants}>
              <div className="home__stat-icon">
                <Icon size={20} />
              </div>
              <div>
                <div className="home__stat-value">{stat.value}</div>
                <div className="home__stat-label">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.section>

      <div className="home__guest-dashboard-cta">
        <button type="button" className="home__section-link" onClick={() => navigate('/guest/dashboard')}>
          Preview the dashboard <ArrowRight size={14} />
        </button>
      </div>

      {/* Featured solutions — gig-card style */}
      <motion.section
        className="home__section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="home__section-header">
          <h2>Popular Services</h2>
          <button type="button" className="home__section-link" onClick={() => navigate('/browse')}>
            Browse marketplace <ArrowRight size={14} />
          </button>
        </div>
        <div className="home__featured-grid">
          {featuredTools.map((tool) => {
            const ToolIcon = TOOL_ICONS[tool.icon] || Brain;
            return (
              <motion.div
                key={tool.id}
                className="home__featured-card"
                variants={itemVariants}
                onClick={() => navigate(`/tool/${tool.id}`)}
              >
                <div className="home__featured-card-header" style={{ background: tool.gradient }}>
                  {tool.badge && <span className="home__featured-badge">{tool.badge}</span>}
                  <ToolIcon size={36} className="home__featured-card-icon" />
                </div>
                <div className="home__featured-card-body">
                  <h3 className="home__featured-name">{tool.name}</h3>
                  <p className="home__featured-company">{tool.company}</p>
                  <div className="home__featured-footer">
                    <span className="home__featured-rating">
                      <Star size={12} fill="var(--warning)" stroke="var(--warning)" /> {tool.rating.toFixed(1)}
                    </span>
                    <span className="home__featured-cta">
                      View details <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Trending strip — horizontal leaderboard-style carousel: oversized
          rank numerals (gold/silver/bronze for the top 3), a flame badge on
          #1, and a visible growth-% signal per card, so this actually reads
          as "trending" instead of just being an arbitrarily ordered list. */}
      <motion.section
        className="home__section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="home__section-header">
          <h2><Flame size={20} className="home__trending-title-flame" /> Trending This Week</h2>
          <button type="button" className="home__section-link" onClick={() => navigate('/search?q=trending')}>
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="home__trending-scroll">
          {trendingTools.map((tool, i) => {
            const ToolIcon = TOOL_ICONS[tool.icon] || Brain;
            const growth = TRENDING_GROWTH[i] ?? 8;
            return (
              <motion.div
                key={tool.id}
                className="home__trending-card"
                variants={itemVariants}
                onClick={() => navigate(`/tool/${tool.id}`)}
              >
                {i === 0 && (
                  <span className="home__trending-flame" title="#1 this week">
                    <Flame size={12} fill="currentColor" /> #1
                  </span>
                )}
                <span className={`home__trending-rank home__trending-rank--${i < 3 ? i + 1 : 'other'}`}>{i + 1}</span>
                <div className="home__trending-card-icon" style={{ background: tool.gradient }}>
                  <ToolIcon size={20} className="home__trending-card-icon-glyph" />
                </div>
                <div className="home__trending-card-body">
                  <h3 className="home__trending-card-name">{tool.name}</h3>
                  <span className="home__trending-card-category">{tool.category}</span>
                  <div className="home__trending-card-footer">
                    <span className="home__trending-card-rating">
                      <Star size={11} fill="var(--warning)" stroke="var(--warning)" /> {tool.rating.toFixed(1)}
                    </span>
                    <span className="home__trending-card-growth">
                      <TrendingUp size={11} /> +{growth}%
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Industry trust strip */}
      <section className="home__industry-strip">
        <p className="home__industry-strip-label">Trusted across every major industry</p>
        <div className="home__industry-strip-row">
          {INDUSTRY_STRIP.map(({ label, icon: Icon }) => (
            <span key={label} className="home__industry-pill">
              <Icon size={14} /> {label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
