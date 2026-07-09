import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Image, Code, BarChart3, Mic, Video, FileText, Search,
  Package, Activity, Users, ShieldCheck, ArrowRight, Star, Building2,
  Landmark, HeartPulse, Factory, ShoppingCart, GraduationCap, Cpu,
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
    dispatch(setSearch(value));
    navigate('/browse');
  };

  const handleCategoryClick = (category: string) => {
    dispatch(resetFilters());
    dispatch(toggleCategory(category));
    navigate('/browse');
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
          <span className="home__hero-eyebrow">YAKKAY AI Line Marketplace</span>
          <h1 className="home__hero-title">The enterprise marketplace for production-grade AI</h1>
          <p className="home__hero-subtitle">
            Discover, govern, and deploy language models, agents, and integrations — all through one
            unified, compliant platform built for the enterprise.
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
        </motion.div>
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

      {/* Popular categories */}
      <motion.section
        className="home__section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="home__section-header">
          <h2>Popular Categories</h2>
          <button type="button" className="home__section-link" onClick={() => navigate('/browse')}>
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="home__categories-grid">
          {categoryStats.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.category] || Brain;
            return (
              <motion.button
                key={cat.category}
                type="button"
                className="home__category-card"
                variants={itemVariants}
                onClick={() => handleCategoryClick(cat.category)}
              >
                <div className="home__category-icon" style={{ background: 'var(--brand-blue-lt)', color: 'var(--brand-blue)' }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="home__category-name">{cat.category}</div>
                  <div className="home__category-count">{cat.count} solutions</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Featured solutions */}
      <motion.section
        className="home__section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="home__section-header">
          <h2>Featured Solutions</h2>
          <button type="button" className="home__section-link" onClick={() => navigate('/browse')}>
            Browse marketplace <ArrowRight size={14} />
          </button>
        </div>
        <div className="home__featured-grid">
          {featuredTools.map((tool) => (
            <motion.div
              key={tool.id}
              className="home__featured-card"
              variants={itemVariants}
              onClick={() => navigate(`/tool/${tool.id}`)}
            >
              <div className="home__featured-badge">{tool.badge}</div>
              <h3 className="home__featured-name">{tool.name}</h3>
              <p className="home__featured-company">{tool.company}</p>
              <p className="home__featured-desc">{tool.description}</p>
              <div className="home__featured-footer">
                <span className="home__featured-rating">
                  <Star size={12} fill="var(--warning)" stroke="var(--warning)" /> {tool.rating.toFixed(1)}
                </span>
                <span className="home__featured-cta">
                  View details <ArrowRight size={12} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Trending strip */}
      <motion.section
        className="home__section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="home__section-header">
          <h2>Trending This Week</h2>
        </div>
        <div className="home__trending-row">
          {trendingTools.map((tool, i) => (
            <motion.div
              key={tool.id}
              className="home__trending-item"
              variants={itemVariants}
              onClick={() => navigate(`/tool/${tool.id}`)}
            >
              <span className="home__trending-rank">{i + 1}</span>
              <span className="home__trending-name">{tool.name}</span>
              <span className="home__trending-category">{tool.category}</span>
            </motion.div>
          ))}
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
