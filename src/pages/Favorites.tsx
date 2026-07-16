import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  HeartOff,
  Star,
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
  Globe,
  MessageSquare,
  Palette,
  Layers,
  Zap,
  Music,
  PieChart,
  ArrowRight,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleFavorite } from '../store/slices/toolsSlice';
import { aiTools } from '../data/mockData';
import { VENDOR_PROFILES } from '../data/vendorProfiles';
import type { AITool } from '../types';
import './Favorites.css';

const iconMap: Record<string, LucideIcon> = {
  Brain, Image, Code, BarChart3, Mic, Video, FileText, Search, Bot,
  Sparkles, Shield, Database, Globe, MessageSquare, Palette, Layers,
  Zap, Music, PieChart,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Language Models': '#8b5cf6',
  'Image Generation': '#ec4899',
  'Code Assistant': '#06b6d4',
  'Data Analytics': '#f59e0b',
  'Voice & Audio': '#10b981',
  'Video Generation': '#f43f5e',
  'Document AI': '#6366f1',
  'Search & Research': '#0ea5e9',
};

const BADGE_MAP: Record<string, 'new' | 'featured' | 'popular' | 'beta' | 'enterprise'> = {
  New: 'new',
  Featured: 'featured',
  Popular: 'popular',
  Beta: 'beta',
  Enterprise: 'enterprise',
};

function formatPrice(tool: AITool): { text: string; isFree: boolean } {
  if (!tool.pricing || tool.pricing.length === 0) return { text: 'Free', isFree: true };
  const freePlan = tool.pricing.find((p) => p.price === 0);
  if (freePlan && tool.pricing.length === 1) return { text: 'Free', isFree: true };
  const paidPlan = tool.pricing.find((p) => p.price > 0);
  if (freePlan && paidPlan) return { text: `From $${paidPlan.price}/mo`, isFree: false };
  if (paidPlan) return { text: `$${paidPlan.price}/mo`, isFree: false };
  return { text: 'Free', isFree: true };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

function Favorites() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((s) => s.tools.favorites);

  const favoriteTools = useMemo(
    () => favoriteIds.map((id) => aiTools.find((t) => t.id === id)).filter((t): t is AITool => Boolean(t)),
    [favoriteIds]
  );

  const favoriteVendors = useMemo(
    () => favoriteIds.map((id) => VENDOR_PROFILES.find((v) => v.id === id)).filter((v): v is (typeof VENDOR_PROFILES)[number] => Boolean(v)),
    [favoriteIds]
  );

  const totalFavorites = favoriteTools.length + favoriteVendors.length;

  return (
    <motion.div
      className="favorites"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="favorites__header">
        <div>
          <h1>Your Favorites</h1>
          <p>AI tools and vendor profiles you've starred for quick access</p>
        </div>
        <span className="favorites__count">
          <Heart size={12} fill="currentColor" />
          {totalFavorites} saved
        </span>
      </div>

      {totalFavorites === 0 ? (
        <motion.div
          className="favorites__empty"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="favorites__empty-icon">
            <HeartOff size={30} />
          </div>
          <h3>No favorites yet</h3>
          <p>Tap the heart on any tool or vendor's detail page to save it here for quick access later.</p>
          <button type="button" className="favorites__browse-btn" onClick={() => navigate('/browse')}>
            <Compass size={16} />
            Browse AI Tools
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="favorites__grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {favoriteTools.map((tool) => {
              const ToolIcon = iconMap[tool.icon] || Brain;
              const price = formatPrice(tool);
              const iconColor = CATEGORY_COLORS[tool.category] || '#8b5cf6';
              return (
                <motion.div
                  key={tool.id}
                  layout
                  variants={cardVariants}
                  exit="exit"
                  className="favorites__card"
                  onClick={() => navigate(`/tool/${tool.id}`)}
                >
                  <button
                    type="button"
                    className="favorites__unfav-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleFavorite(tool.id));
                    }}
                    aria-label={`Remove ${tool.name} from favorites`}
                  >
                    <Heart size={16} fill="#a78bfa" stroke="#a78bfa" />
                  </button>

                  {tool.badge && (
                    <div className="favorites__badge-wrapper">
                      <Badge variant={BADGE_MAP[tool.badge] || 'new'} size="sm">
                        {tool.badge}
                      </Badge>
                    </div>
                  )}

                  <div className="favorites__card-icon" style={{ background: `${iconColor}18`, color: iconColor }}>
                    <ToolIcon size={24} />
                  </div>

                  <h3 className="favorites__card-name">{tool.name}</h3>
                  <p className="favorites__card-company">{tool.company}</p>
                  <p className="favorites__card-desc">{tool.description}</p>

                  <div className="favorites__card-footer">
                    <div className="favorites__card-rating">
                      <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                      <span>{tool.rating.toFixed(1)}</span>
                    </div>
                    <span className={`favorites__card-price ${price.isFree ? 'favorites__card-price--free' : ''}`}>
                      {price.text}
                    </span>
                  </div>

                  <div className="favorites__card-view">
                    View details <ArrowRight size={13} />
                  </div>
                </motion.div>
              );
            })}

            {favoriteVendors.map((vendor) => {
              const VendorIcon = vendor.bannerIcon;
              return (
                <motion.div
                  key={vendor.id}
                  layout
                  variants={cardVariants}
                  exit="exit"
                  className="favorites__card"
                  onClick={() => navigate(`/vendor/${vendor.id}`)}
                >
                  <button
                    type="button"
                    className="favorites__unfav-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleFavorite(vendor.id));
                    }}
                    aria-label={`Remove ${vendor.name} from favorites`}
                  >
                    <Heart size={16} fill="#a78bfa" stroke="#a78bfa" />
                  </button>

                  <div className="favorites__card-icon" style={{ background: `${vendor.avatarColor}18`, color: vendor.avatarColor }}>
                    <VendorIcon size={24} />
                  </div>

                  <h3 className="favorites__card-name">{vendor.name}</h3>
                  <p className="favorites__card-company">{vendor.title}</p>
                  <p className="favorites__card-desc">{vendor.bio}</p>

                  <div className="favorites__card-footer">
                    <div className="favorites__card-rating">
                      <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                      <span>{vendor.rating.toFixed(1)}</span>
                    </div>
                    <span className="favorites__card-price">{vendor.startingPrice}</span>
                  </div>

                  <div className="favorites__card-view">
                    View profile <ArrowRight size={13} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Favorites;
