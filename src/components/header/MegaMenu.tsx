import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Brain, Bot, Boxes, Factory, Workflow,
  Database, ShieldCheck, Lock, GitBranch, FileCheck2,
  Plug, Building2, Landmark, Users, Cloud, Code2,
  BookOpen, Rocket, FileText, GraduationCap, Terminal,
  BarChart4, Scale, DollarSign, Building,
  Quote, Star, Trophy, Download,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { useAppDispatch } from '../../store';
import { resetFilters, toggleCategory, setSearch } from '../../store/slices/toolsSlice';
import { aiTools } from '../../data/mockData';
import './MegaMenu.css';

interface MegaMenuLink {
  label: string;
  icon: LucideIcon;
  desc: string;
  toolId?: string;
  action: (nav: ReturnType<typeof useNavigate>, dispatch: ReturnType<typeof useAppDispatch>) => void;
}

function renderMiniStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={12}
      fill={i < Math.round(rating) ? 'var(--warning)' : 'transparent'}
      stroke="var(--warning)"
      strokeWidth={1.5}
    />
  ));
}

interface MegaMenuColumn {
  title: string;
  blurb?: string;
  seeAllTo?: string;
  links: MegaMenuLink[];
}

interface MegaMenuPanel {
  icon: LucideIcon;
  title: string;
  desc: string;
  ctaLabel: string;
  ctaTo: string;
}

export interface MegaMenuSection {
  key: string;
  label: string;
  columns: MegaMenuColumn[];
  panel: MegaMenuPanel;
}

const toBrowseCategory = (category: string) => (nav: ReturnType<typeof useNavigate>, dispatch: ReturnType<typeof useAppDispatch>) => {
  dispatch(resetFilters());
  dispatch(toggleCategory(category));
  nav('/browse');
};

const toBrowseSearch = (term: string) => (nav: ReturnType<typeof useNavigate>, dispatch: ReturnType<typeof useAppDispatch>) => {
  dispatch(resetFilters());
  dispatch(setSearch(term));
  nav('/browse');
};

const toPath = (path: string) => (nav: ReturnType<typeof useNavigate>) => nav(path);

export const MEGA_MENU_SECTIONS: MegaMenuSection[] = [
  {
    key: 'products',
    label: 'Products',
    columns: [
      {
        title: 'AI Solutions',
        blurb: 'Foundation capabilities for every workload.',
        seeAllTo: '/browse',
        links: [
          { label: 'Language Models', icon: Brain, desc: 'Enterprise-grade reasoning, coding, and analysis with a 128K context window.', toolId: 'nexusgpt', action: toBrowseCategory('Language Models') },
          { label: 'Image Generation', icon: Boxes, desc: 'Photorealistic image generation and editing with industry-leading control.', toolId: 'pixelforge', action: toBrowseCategory('Image Generation') },
          { label: 'Data Analytics', icon: BarChart4, desc: 'Ask questions about your data in plain English, get instant visualizations.', toolId: 'datalens', action: toBrowseCategory('Data Analytics') },
        ],
      },
      {
        title: 'AI Agents',
        blurb: 'Autonomous workflows that act on your behalf.',
        seeAllTo: '/browse',
        links: [
          { label: 'Autonomous Agents', icon: Bot, desc: 'Lightweight, fast agents optimized for low-latency, real-time tasks.', toolId: 'nexusgpt-mini', action: toBrowseSearch('agent') },
          { label: 'Customer Service Agents', icon: Users, desc: 'Ultra-realistic voice agents with emotion control and 40+ languages.', toolId: 'voicecraft', action: toBrowseSearch('customer service') },
          { label: 'Research Agents', icon: Rocket, desc: 'Searches, summarizes, and synthesizes academic and web content automatically.', toolId: 'researchbot', action: toBrowseCategory('Search & Research') },
        ],
      },
      {
        title: 'AI Models',
        blurb: 'Bring your own weights or use ours, governed either way.',
        seeAllTo: '/browse',
        links: [
          { label: 'Foundation Models', icon: Brain, desc: 'Enterprise-grade reasoning, coding, and analysis with a 128K context window.', toolId: 'nexusgpt', action: toBrowseCategory('Language Models') },
          { label: 'Code Models', icon: Code2, desc: 'AI-powered code completion, refactoring, and debugging for 50+ languages.', toolId: 'codepilot', action: toBrowseCategory('Code Assistant') },
          { label: 'Voice Models', icon: Bot, desc: 'Ultra-realistic text-to-speech and voice cloning with emotion control.', toolId: 'voicecraft', action: toBrowseCategory('Voice & Audio') },
        ],
      },
      {
        title: 'Industry Accelerators',
        blurb: 'Pre-configured for regulated, high-stakes workflows.',
        links: [
          { label: 'Financial Services', icon: Landmark, desc: 'Governed reasoning and analytics tuned for regulated financial workflows.', action: toBrowseSearch('finance') },
          { label: 'Healthcare & Life Sciences', icon: FileCheck2, desc: 'Document intelligence for medical records and compliance-heavy intake.', toolId: 'documind', action: toBrowseSearch('healthcare') },
          { label: 'Manufacturing', icon: Factory, desc: 'Predictive analytics and anomaly detection across plant telemetry.', toolId: 'datalens', action: toBrowseSearch('manufacturing') },
        ],
      },
      {
        title: 'Workflows',
        blurb: 'Chain models into repeatable production pipelines.',
        links: [
          { label: 'Document Processing', icon: FileText, desc: 'Extract, classify, and understand any document type at enterprise scale.', toolId: 'documind', action: toBrowseCategory('Document AI') },
          { label: 'Automation Pipelines', icon: Workflow, desc: 'Chain multiple models into governed, repeatable production workflows.', action: toBrowseSearch('automation') },
        ],
      },
    ],
    panel: {
      icon: Rocket,
      title: 'Reasoning v3 is here',
      desc: '34% faster inference across every language model class, now rolling out to all Enterprise plans.',
      ctaLabel: 'Explore AI Solutions',
      ctaTo: '/browse',
    },
  },
  {
    key: 'catalog',
    label: 'Catalog & Governance',
    columns: [
      {
        title: 'Catalog',
        blurb: 'Every model and dataset, discoverable and classified.',
        seeAllTo: '/catalog',
        links: [
          { label: 'Data & Model Catalog', icon: Database, desc: 'Search and classify every model and dataset asset in one place.', action: toPath('/catalog') },
          { label: 'Data Lineage', icon: GitBranch, desc: 'Trace data from raw source through to production serving.', action: toPath('/catalog') },
        ],
      },
      {
        title: 'Governance',
        blurb: 'Policy, roles, and approvals in one control plane.',
        seeAllTo: '/governance',
        links: [
          { label: 'Model Governance', icon: ShieldCheck, desc: 'Compliance status and review workflow for every model in production.', action: toPath('/governance') },
          { label: 'Access Control', icon: Lock, desc: 'Role-based permissions with a full, exportable audit trail.', action: toPath('/governance') },
        ],
      },
      {
        title: 'Trust',
        blurb: 'Security posture and compliance status at a glance.',
        links: [
          { label: 'Security', icon: Lock, desc: 'Encryption in transit and at rest, SSO/SAML on Enterprise plans.', action: toPath('/governance') },
          { label: 'Compliance', icon: FileCheck2, desc: 'SOC 2, GDPR, and HIPAA posture tracked per model.', action: toPath('/governance') },
        ],
      },
    ],
    panel: {
      icon: ShieldCheck,
      title: 'Govern every model in production',
      desc: 'Unified catalog, lineage tracking, and compliance controls across your entire AI estate.',
      ctaLabel: 'Open Governance Center',
      ctaTo: '/governance',
    },
  },
  {
    key: 'integrations',
    label: 'Integrations',
    columns: [
      {
        title: 'Business Systems',
        blurb: 'Plug into the systems your teams already run.',
        seeAllTo: '/integrations',
        links: [
          { label: 'CRM', icon: Users, desc: 'Sync leads, opportunities, and AI-scored accounts into Salesforce & HubSpot.', action: toPath('/integrations') },
          { label: 'ERP', icon: Building2, desc: 'Connect production data pipelines to SAP and NetSuite for unified reporting.', action: toPath('/integrations') },
          { label: 'Finance', icon: DollarSign, desc: 'Categorize transactions and meter usage-based billing automatically.', action: toPath('/integrations') },
        ],
      },
      {
        title: 'Infrastructure',
        blurb: '120+ pre-built connectors across cloud and API.',
        seeAllTo: '/integrations',
        links: [
          { label: 'HR', icon: Users, desc: 'Automate onboarding document processing and resume screening.', action: toPath('/integrations') },
          { label: 'Cloud Platforms', icon: Cloud, desc: 'One-click deployment into Azure, AWS, or GCP with managed scaling.', action: toPath('/integrations') },
          { label: 'API & Webhooks', icon: Plug, desc: 'Subscribe to model events and trigger workflows via REST webhooks.', action: toPath('/integrations') },
        ],
      },
    ],
    panel: {
      icon: Plug,
      title: '120+ pre-built integrations',
      desc: 'Connect your AI stack to the systems your teams already use — no custom glue code required.',
      ctaLabel: 'Browse Integrations',
      ctaTo: '/integrations',
    },
  },
  {
    key: 'documentation',
    label: 'Documentation',
    columns: [
      {
        title: 'Start Here',
        blurb: 'Your first authenticated call in under 5 minutes.',
        seeAllTo: '/documentation',
        links: [
          { label: 'Getting Started', icon: Rocket, desc: 'Make your first authenticated API call in under five minutes.', action: toPath('/documentation') },
          { label: 'Learning Paths', icon: GraduationCap, desc: 'Guided, hands-on paths from beginner to production-ready.', action: toPath('/documentation') },
        ],
      },
      {
        title: 'Build',
        blurb: 'Reference docs, SDKs, and hands-on tutorials.',
        seeAllTo: '/documentation',
        links: [
          { label: 'API Reference', icon: Terminal, desc: 'Every endpoint, request, and response shape, fully documented.', action: toPath('/documentation') },
          { label: 'SDK Guides', icon: Code2, desc: 'Official SDKs for Python, Node.js, and Java.', action: toPath('/documentation') },
          { label: 'Tutorials', icon: BookOpen, desc: 'Task-based walkthroughs for common integration patterns.', action: toPath('/documentation') },
        ],
      },
    ],
    panel: {
      icon: BookOpen,
      title: 'New: Agent Orchestration Path',
      desc: 'A guided, hands-on learning path for building multi-agent workflows in under 2 hours.',
      ctaLabel: 'Start Learning',
      ctaTo: '/documentation',
    },
  },
  {
    key: 'compare',
    label: 'Compare Solutions',
    columns: [
      {
        title: 'Evaluate',
        blurb: 'Ability to execute vs. completeness of vision.',
        seeAllTo: '/compare',
        links: [
          { label: 'Magic Quadrant View', icon: Scale, desc: 'Ability to execute vs. completeness of vision, plotted across the catalog.', action: toPath('/compare') },
          { label: 'Feature Comparison', icon: BarChart4, desc: 'Side-by-side capability matrix for your shortlisted solutions.', action: toPath('/compare') },
        ],
      },
      {
        title: 'Decide',
        blurb: 'Shortlist up to four solutions side by side.',
        seeAllTo: '/compare',
        links: [
          { label: 'Pricing Matrix', icon: DollarSign, desc: 'Compare plan tiers and pricing across up to four solutions.', action: toPath('/compare') },
          { label: 'Vendor Comparison', icon: Building, desc: 'Pros, cons, and ratings radar for each shortlisted vendor.', action: toPath('/compare') },
        ],
      },
    ],
    panel: {
      icon: Scale,
      title: 'See how we stack up',
      desc: 'An independent-style comparison across reasoning quality, cost, uptime, and governance depth.',
      ctaLabel: 'Open Comparison Center',
      ctaTo: '/compare',
    },
  },
  {
    key: 'customers',
    label: 'Customers',
    columns: [
      {
        title: 'Proof',
        blurb: 'Illustrative outcomes across industries and regions.',
        seeAllTo: '/customers',
        links: [
          { label: 'Case Studies', icon: Trophy, desc: 'How enterprise teams deployed YAKKAY across real workflows.', action: toPath('/customers') },
          { label: 'Testimonials', icon: Quote, desc: 'Direct quotes from operators running YAKKAY in production.', action: toPath('/customers') },
          { label: 'Success Stories', icon: Star, desc: 'Outcomes and ROI figures by industry and region.', action: toPath('/customers') },
        ],
      },
    ],
    panel: {
      icon: Trophy,
      title: 'Trusted across the Fortune 500',
      desc: 'See how enterprise teams in financial services, healthcare, and manufacturing deploy YAKKAY at scale.',
      ctaLabel: 'View Customer Stories',
      ctaTo: '/customers',
    },
  },
];

interface MegaMenuProps {
  onNavigate: () => void;
}

const columnVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

// Preview panel content always slides right-to-left: the new topic's details
// enter from the right edge, the old ones exit off the left edge — a
// directional cue that reads as "moving forward" through the list.
const previewSlideVariants = {
  enter: { opacity: 0, x: 22 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -22 },
};

// Directional "flip" — the panel tilts in on a 3D X-axis as it swaps content,
// rather than a flat fade, and reverses direction depending on which way the
// user is moving through the nav (left-to-right vs right-to-left).
const flipVariants = {
  enter: (dir: number) => ({ opacity: 0, rotateX: dir >= 0 ? -12 : 12, y: dir >= 0 ? -10 : 10 }),
  center: { opacity: 1, rotateX: 0, y: 0 },
  exit: (dir: number) => ({ opacity: 0, rotateX: dir >= 0 ? 10 : -10, y: dir >= 0 ? 8 : -8 }),
};

function MegaMenu({ onNavigate }: MegaMenuProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // A single "Explore" trigger now opens this whole menu, so section
  // switching (previously done by hovering one of six separate top-level
  // nav buttons) happens via the tab row rendered inside the panel below.
  const [activeKey, setActiveKey] = useState(MEGA_MENU_SECTIONS[0].key);
  const section = MEGA_MENU_SECTIONS.find((s) => s.key === activeKey);
  const prevIndexRef = useRef(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Both hover and click select a topic and show its details in the panel —
  // neither one navigates away on its own. Hover gives an instant preview
  // (debounced so a fast pass down the list doesn't flip on every item);
  // click is the same action for touch/keyboard users where hover doesn't
  // apply. Only the panel's own Install / More Details / See all buttons
  // actually navigate.
  const [selectedLink, setSelectedLink] = useState<MegaMenuLink | null>(null);
  const [prevActiveKey, setPrevActiveKey] = useState(activeKey);

  if (activeKey !== prevActiveKey) {
    setPrevActiveKey(activeKey);
    setSelectedLink(null);
  }

  const handleLinkHover = (link: MegaMenuLink) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setSelectedLink(link), 70);
  };

  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }, []);

  if (!section) return null;
  const PanelIcon = section.panel.icon;

  const currentIndex = MEGA_MENU_SECTIONS.findIndex((s) => s.key === activeKey);
  const direction = currentIndex >= prevIndexRef.current ? 1 : -1;
  prevIndexRef.current = currentIndex;

  const previewTool = selectedLink?.toolId ? aiTools.find((t) => t.id === selectedLink.toolId) : undefined;

  const handleInstall = (name: string) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: `Installing ${name}...`,
      success: `${name} connected to your workspace!`,
      error: 'Installation failed.',
    });
  };

  return (
    <div className="mega-menu__perspective">
      <div className="mega-menu">
        <div className="mega-menu__tabs" role="tablist" aria-label="Explore sections">
          {MEGA_MENU_SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={s.key === activeKey}
              className={`mega-menu__tab ${s.key === activeKey ? 'mega-menu__tab--active' : ''}`}
              onClick={() => setActiveKey(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={section.key}
            className="mega-menu__content"
            custom={direction}
            variants={flipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
          <div className="mega-menu__body">
            <motion.div className="mega-menu__columns" variants={columnVariants} initial="hidden" animate="visible">
              {section.columns.map((col) => (
                <div key={col.title} className="mega-menu__column">
                  <h4 className="mega-menu__column-title">{col.title}</h4>
                  {col.blurb && <p className="mega-menu__column-blurb">{col.blurb}</p>}
                  <ul className="mega-menu__link-list">
                    {col.links.map((link) => {
                      const LinkIcon = link.icon;
                      const isSelected = selectedLink?.label === link.label;
                      return (
                        <motion.li key={link.label} variants={linkVariants}>
                          <button
                            type="button"
                            className={`mega-menu__link ${isSelected ? 'mega-menu__link--selected' : ''}`}
                            aria-pressed={isSelected}
                            onMouseEnter={() => handleLinkHover(link)}
                            onClick={() => {
                              if (hoverTimer.current) clearTimeout(hoverTimer.current);
                              setSelectedLink(link);
                            }}
                          >
                            <span className="mega-menu__link-tile">
                              <LinkIcon size={14} />
                            </span>
                            {link.label}
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>
                  {col.seeAllTo && (
                    <button
                      type="button"
                      className="mega-menu__see-all"
                      onClick={() => {
                        navigate(col.seeAllTo!);
                        onNavigate();
                      }}
                    >
                      See all <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              ))}
            </motion.div>

            <div className="mega-menu__panel-slot">
              <AnimatePresence mode="wait">
                {selectedLink ? (
                  <motion.div
                    key={selectedLink.label}
                    className="mega-menu__panel mega-menu__panel--preview"
                    variants={previewSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="mega-menu__panel-icon">
                      <selectedLink.icon size={26} />
                    </div>
                    <h4 className="mega-menu__panel-title">{selectedLink.label}</h4>
                    {previewTool && (
                      <div className="mega-menu__preview-meta">
                        <div className="mega-menu__preview-stars">{renderMiniStars(previewTool.rating)}</div>
                        <span className="mega-menu__preview-rating-value">{previewTool.rating.toFixed(1)}</span>
                        <span className="mega-menu__preview-reviews">({previewTool.reviewCount.toLocaleString()})</span>
                      </div>
                    )}
                    <p className="mega-menu__panel-desc">{selectedLink.desc}</p>
                    {previewTool && (
                      <ul className="mega-menu__preview-points">
                        {previewTool.tags.slice(0, 4).map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mega-menu__preview-actions">
                      {previewTool && (
                        <button
                          type="button"
                          className="mega-menu__panel-cta mega-menu__panel-cta--secondary"
                          onClick={() => handleInstall(previewTool.name)}
                        >
                          <Download size={13} /> Install
                        </button>
                      )}
                      <button
                        type="button"
                        className="mega-menu__panel-cta"
                        onClick={() => {
                          if (previewTool) navigate(`/tool/${previewTool.id}`);
                          else selectedLink.action(navigate, dispatch);
                          onNavigate();
                        }}
                      >
                        {previewTool ? 'More Details' : 'View'} <ArrowRight size={13} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    className="mega-menu__panel"
                    variants={previewSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="mega-menu__panel-icon">
                      <PanelIcon size={26} />
                    </div>
                    <h4 className="mega-menu__panel-title">{section.panel.title}</h4>
                    <p className="mega-menu__panel-desc">{section.panel.desc}</p>
                    <button
                      type="button"
                      className="mega-menu__panel-cta"
                      onClick={() => {
                        navigate(section.panel.ctaTo);
                        onNavigate();
                      }}
                    >
                      {section.panel.ctaLabel}
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mega-menu__footer">
            <button
              type="button"
              className="mega-menu__footer-link"
              onClick={() => {
                navigate(section.panel.ctaTo);
                onNavigate();
              }}
            >
              Browse all in {section.label} <ArrowRight size={12} />
            </button>
          </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MegaMenu;
