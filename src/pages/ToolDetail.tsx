import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Check,
  Heart,
  Rocket,
  Globe,
  Brain,
  Image,
  Code,
  BarChart3,
  Mic,
  Video,
  FileText,
  Search,
  Bot,
  Sparkles,
  Shield,
  Database,
  MessageSquare,
  Palette,
  Layers,
  Zap,
  Music,
  PieChart,
  Server,
  Lock,
  ShieldCheck,
  ChevronDown,
  BookOpen,
  Quote,
  HelpCircle,
  PhoneCall,
  type LucideIcon,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleFavorite } from '../store/slices/toolsSlice';
import { aiTools } from '../data/mockData';
import './ToolDetail.css';

const iconMap: Record<string, LucideIcon> = {
  Brain, Image, Code, BarChart3, Mic, Video, FileText, Search, Bot,
  Sparkles, Shield, Database, Globe, MessageSquare, Palette, Layers,
  Zap, Music, PieChart,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Language Models': '#0f6cbd',
  'Image Generation': '#0f6cbd',
  'Code Assistant': '#0f6cbd',
  'Data Analytics': '#0f6cbd',
  'Voice & Audio': '#0f6cbd',
  'Video Generation': '#0f6cbd',
  'Document AI': '#0f6cbd',
  'Search & Research': '#0f6cbd',
};

const BADGE_MAP: Record<string, 'new' | 'featured' | 'popular' | 'beta' | 'enterprise'> = {
  New: 'new',
  Featured: 'featured',
  Popular: 'popular',
  Beta: 'beta',
  Enterprise: 'enterprise',
};

const SECURITY_CONTROLS = [
  { label: 'Encryption in transit (TLS 1.3)', icon: Lock },
  { label: 'Encryption at rest (AES-256)', icon: Lock },
  { label: 'Role-based access control', icon: ShieldCheck },
  { label: 'Full audit logging', icon: FileText },
  { label: 'Configurable data residency', icon: Globe },
  { label: 'SSO / SAML (Enterprise plan)', icon: ShieldCheck },
];

const FAQ_ITEMS = [
  {
    q: 'What happens when I exceed my plan limits?',
    a: 'Requests are queued and rate-limited rather than dropped. You can upgrade at any time and the new limits apply immediately, with usage prorated for the billing period.',
  },
  {
    q: 'Can this be deployed inside our own VPC or on-prem?',
    a: 'Enterprise plans support VPC peering and select on-prem / air-gapped deployments. Contact sales to scope your specific infrastructure requirements.',
  },
  {
    q: 'How is billing calculated for usage-based plans?',
    a: 'Usage is metered per request and aggregated daily. You can set spend alerts and hard caps from the billing settings in your workspace.',
  },
  {
    q: 'Is there a self-hosted or open-source option?',
    a: 'Some model classes offer an open-source variant with community support. Check the Open-Source pricing tier on this product for availability.',
  },
];

type TabId = 'overview' | 'architecture' | 'pricing' | 'security' | 'integrations' | 'reviews' | 'documentation' | 'faq';

const tabVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

function getToolIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Brain;
}

function renderStars(rating: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={16}
        fill={i <= Math.round(rating) ? '#f59e0b' : 'transparent'}
        stroke={i <= Math.round(rating) ? '#f59e0b' : '#64748b'}
        strokeWidth={1.5}
      />
    );
  }
  return stars;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

const SAMPLE_REVIEWS = [
  { title: 'VP of Engineering', body: 'Cut our integration time from weeks to days. Documentation and SDKs are genuinely production-ready.', rating: 5 },
  { title: 'Data Platform Lead', body: 'Solid latency and uptime for our scale. Governance and audit logging made our security review painless.', rating: 4 },
  { title: 'Senior ML Engineer', body: 'Pricing scales sensibly as usage grows, and the enterprise plan\'s dedicated support has been responsive.', rating: 5 },
];

function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.tools.favorites);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tool = useMemo(() => aiTools.find((t) => t.id === id), [id]);

  const relatedTools = useMemo(() => {
    if (!tool) return [];
    return aiTools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 3);
  }, [tool]);

  const allFeatures = useMemo(() => {
    if (!tool) return [];
    const set = new Set<string>();
    tool.pricing.forEach((p) => p.features.forEach((f) => set.add(f)));
    return Array.from(set);
  }, [tool]);

  if (!tool) {
    return (
      <motion.div
        className="tool-detail__not-found"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2>Tool Not Found</h2>
        <p>The tool you're looking for doesn't exist or has been removed.</p>
        <button className="tool-detail__cta-primary" onClick={() => navigate('/browse')}>
          Browse All Tools
        </button>
      </motion.div>
    );
  }

  const ToolIcon = getToolIcon(tool.icon);
  const iconColor = CATEGORY_COLORS[tool.category] || '#0f6cbd';
  const isFavorite = favorites.includes(tool.id);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'security', label: 'Security & Compliance' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'faq', label: 'FAQs' },
  ];

  return (
    <motion.div
      className="tool-detail"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Link */}
      <button className="tool-detail__back" onClick={() => navigate('/browse')}>
        <ArrowLeft size={16} />
        Back to Marketplace
      </button>

      {/* Hero */}
      <div className="tool-detail__hero">
        <div
          className="tool-detail__icon"
          style={{ background: `${iconColor}14`, color: iconColor }}
        >
          <ToolIcon size={36} />
        </div>
        <div className="tool-detail__hero-content">
          <div className="tool-detail__title-row">
            <h1 className="tool-detail__title">{tool.name}</h1>
            {tool.badge && (
              <Badge variant={BADGE_MAP[tool.badge] || 'new'} size="md">
                {tool.badge}
              </Badge>
            )}
          </div>
          <p className="tool-detail__company">by {tool.company} &middot; {tool.vendor}</p>
          <div className="tool-detail__rating-row">
            <div className="tool-detail__stars">{renderStars(tool.rating)}</div>
            <span className="tool-detail__rating-text">{tool.rating.toFixed(1)}</span>
            <span className="tool-detail__review-count">({tool.reviewCount} reviews)</span>
          </div>
          <p className="tool-detail__description">{tool.description}</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="tool-detail__stats-row">
        <motion.div
          className="tool-detail__stat-box"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="tool-detail__stat-value">{formatNumber(tool.apiCallsMonthly)}</div>
          <div className="tool-detail__stat-label">API Calls / Month</div>
        </motion.div>
        <motion.div
          className="tool-detail__stat-box"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="tool-detail__stat-value">{formatNumber(tool.activeUsers)}</div>
          <div className="tool-detail__stat-label">Active Users</div>
        </motion.div>
        <motion.div
          className="tool-detail__stat-box"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="tool-detail__stat-value">{tool.uptime}%</div>
          <div className="tool-detail__stat-label">Uptime</div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="tool-detail__tabs">
        <div className="tool-detail__tab-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tool-detail__tab${activeTab === tab.id ? ' tool-detail__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="tool-detail__tab-content"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {activeTab === 'overview' && (
              <div className="tool-detail__overview">
                <div className="tool-detail__overview-section">
                  <h3>About</h3>
                  <p className="tool-detail__overview-text">{tool.longDescription || tool.description}</p>
                </div>

                <div className="tool-detail__overview-section">
                  <h3>Tags</h3>
                  <div className="tool-detail__tags-list">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="tool-detail__tag">{tag}</span>
                    ))}
                  </div>
                </div>

                {allFeatures.length > 0 && (
                  <div className="tool-detail__overview-section">
                    <h3>Features</h3>
                    <ul className="tool-detail__features-list">
                      {allFeatures.map((feature, i) => (
                        <li key={i} className="tool-detail__feature">
                          <Check size={16} className="tool-detail__feature-icon" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="tool-detail__overview-section">
                  <h3>Availability</h3>
                  <div className="tool-detail__meta-grid">
                    <div>
                      <span className="tool-detail__meta-label">Industries</span>
                      <span className="tool-detail__meta-value">{tool.industries.join(', ')}</span>
                    </div>
                    <div>
                      <span className="tool-detail__meta-label">Regions</span>
                      <span className="tool-detail__meta-value">{tool.regions.join(', ')}</span>
                    </div>
                    <div>
                      <span className="tool-detail__meta-label">Cloud Platforms</span>
                      <span className="tool-detail__meta-value">{tool.cloudProviders.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="tool-detail__architecture">
                <p className="tool-detail__architecture-intro">
                  A simplified view of how requests flow through {tool.name} in a typical production deployment.
                </p>
                <div className="tool-detail__arch-diagram">
                  {['Client App', 'API Gateway', `${tool.name} Runtime`, 'Data & Model Catalog'].map((step, i) => (
                    <div className="tool-detail__arch-step-wrap" key={step}>
                      <div className="tool-detail__arch-step">
                        <Server size={18} />
                        <span>{step}</span>
                      </div>
                      {i < 3 && <ArrowRight size={16} className="tool-detail__arch-arrow" />}
                    </div>
                  ))}
                </div>
                <div className="tool-detail__overview-section">
                  <h3>Deployment Options</h3>
                  <ul className="tool-detail__features-list">
                    <li className="tool-detail__feature"><Check size={16} className="tool-detail__feature-icon" /> Fully managed multi-tenant cloud (Starter / Pro)</li>
                    <li className="tool-detail__feature"><Check size={16} className="tool-detail__feature-icon" /> Dedicated single-tenant VPC (Enterprise)</li>
                    <li className="tool-detail__feature"><Check size={16} className="tool-detail__feature-icon" /> Governed via the Catalog & Governance center</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="tool-detail__pricing-grid">
                {tool.pricing && tool.pricing.length > 0 ? (
                  tool.pricing.map((plan, index) => {
                    const isPopular = plan.popular || (tool.pricing!.length > 1 && index === 1);
                    return (
                      <div
                        key={plan.name}
                        className={`tool-detail__pricing-card${isPopular ? ' tool-detail__pricing-card--popular' : ''}`}
                      >
                        {isPopular && (
                          <span className="tool-detail__pricing-popular-badge">Most Popular</span>
                        )}
                        <h4 className="tool-detail__pricing-name">{plan.name}</h4>
                        <div className="tool-detail__pricing-price-row">
                          <span className="tool-detail__pricing-price">
                            {plan.price === 0 ? 'Free' : `$${plan.price}`}
                          </span>
                          {plan.price > 0 && (
                            <span className="tool-detail__pricing-period">/{plan.period || 'mo'}</span>
                          )}
                        </div>
                        <ul className="tool-detail__pricing-features">
                          {plan.features.map((feat, fi) => (
                            <li key={fi} className="tool-detail__pricing-feature">
                              <Check size={14} className="tool-detail__pricing-feature-icon" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                        <button className="tool-detail__pricing-cta">
                          {plan.price === 0 ? 'Get Started Free' : 'Subscribe'}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>Pricing information unavailable</p>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="tool-detail__overview">
                <p className="tool-detail__disclaimer">
                  Security posture below is illustrative sample data for this demo experience, not a certified attestation.
                </p>
                <div className="tool-detail__overview-section">
                  <h3>Security Controls</h3>
                  <div className="tool-detail__security-grid">
                    {SECURITY_CONTROLS.map(({ label, icon: Icon }) => (
                      <div key={label} className="tool-detail__security-item">
                        <Icon size={16} />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="tool-detail__overview-section">
                  <h3>Compliance Posture (Sample)</h3>
                  <div className="tool-detail__tags-list">
                    <span className="tool-detail__tag">SOC 2 — in progress</span>
                    <span className="tool-detail__tag">GDPR-ready data handling</span>
                    <span className="tool-detail__tag">HIPAA available on Enterprise</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="tool-detail__integrations-grid">
                {tool.integrations && tool.integrations.length > 0 ? (
                  tool.integrations.map((integration) => (
                    <div key={integration} className="tool-detail__integration-chip">
                      <span className="tool-detail__integration-dot" />
                      {integration}
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No integrations listed yet</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tool-detail__reviews">
                <p className="tool-detail__disclaimer">
                  Showing 3 sample reviews out of {tool.reviewCount.toLocaleString()} on record.
                </p>
                {SAMPLE_REVIEWS.map((review) => (
                  <div key={review.title} className="tool-detail__review-card">
                    <Quote size={18} className="tool-detail__review-quote-icon" />
                    <div className="tool-detail__review-stars">{renderStars(review.rating)}</div>
                    <p className="tool-detail__review-body">{review.body}</p>
                    <p className="tool-detail__review-author">{review.title}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'documentation' && (
              <div className="tool-detail__overview">
                <p className="tool-detail__overview-text">
                  Full guides for {tool.name} live in the Documentation Portal — getting started, API reference, SDKs, and tutorials.
                </p>
                <button type="button" className="tool-detail__doc-link" onClick={() => navigate('/documentation')}>
                  <BookOpen size={16} />
                  Open Documentation Portal
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {activeTab === 'faq' && (
              <Accordion.Root type="single" collapsible className="tool-detail__faq">
                {FAQ_ITEMS.map((item, i) => (
                  <Accordion.Item key={item.q} value={`item-${i}`} className="tool-detail__faq-item">
                    <Accordion.Header>
                      <Accordion.Trigger className="tool-detail__faq-trigger">
                        <span><HelpCircle size={15} /> {item.q}</span>
                        <ChevronDown size={15} className="tool-detail__faq-chevron" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="tool-detail__faq-content">
                      {item.a}
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <div className="tool-detail__cta">
        <button className="tool-detail__cta-primary" onClick={() => navigate('/request-demo')}>
          <Rocket size={18} />
          Request a Demo
        </button>
        <button className="tool-detail__cta-secondary" onClick={() => navigate('/contact')}>
          <PhoneCall size={18} />
          Contact Sales
        </button>
        <button
          className={`tool-detail__cta-secondary${isFavorite ? ' tool-detail__cta-secondary--active' : ''}`}
          onClick={() => dispatch(toggleFavorite(tool.id))}
        >
          <Heart size={18} fill={isFavorite ? '#0f6cbd' : 'none'} />
          {isFavorite ? 'Saved' : 'Save for Later'}
        </button>
      </div>

      {/* Related Products */}
      {relatedTools.length > 0 && (
        <div className="tool-detail__related">
          <h3>Related Products</h3>
          <div className="tool-detail__related-grid">
            {relatedTools.map((related) => {
              const RelatedIcon = getToolIcon(related.icon);
              return (
                <div key={related.id} className="tool-detail__related-card" onClick={() => navigate(`/tool/${related.id}`)}>
                  <div className="tool-detail__related-icon">
                    <RelatedIcon size={20} />
                  </div>
                  <div>
                    <h4>{related.name}</h4>
                    <p>{related.company}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ToolDetail;
