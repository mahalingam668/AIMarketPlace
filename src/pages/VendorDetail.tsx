import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  BadgeCheck,
  Award,
  Diamond,
  Clock,
  MapPin,
  CheckCircle,
  MessageCircle,
  Heart,
} from 'lucide-react';
import { getVendorProfileById, getRelatedVendorProfiles } from '../data/vendorProfiles';
import './VendorDetail.css';

function formatReviewCount(count: number): string {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : `${count}`;
}

function VendorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const profile = useMemo(() => getVendorProfileById(id ?? ''), [id]);
  const relatedProfiles = useMemo(() => (profile ? getRelatedVendorProfiles(profile) : []), [profile]);

  if (!profile) {
    return (
      <motion.div className="vendor-detail__not-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2>Profile Not Found</h2>
        <p>The vendor or developer profile you're looking for doesn't exist or has been removed.</p>
        <button type="button" className="vendor-detail__cta-primary" onClick={() => navigate('/browse')}>
          Back to Marketplace
        </button>
      </motion.div>
    );
  }

  const BannerIcon = profile.bannerIcon;

  return (
    <motion.div className="vendor-detail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <button type="button" className="vendor-detail__back" onClick={() => navigate('/browse')}>
        <ArrowLeft size={16} />
        Back to Marketplace
      </button>

      {/* Hero */}
      <div
        className="vendor-detail__hero"
        style={{ background: `linear-gradient(135deg, ${profile.avatarColor} 0%, ${profile.avatarColor}99 100%)` }}
      >
        <BannerIcon size={140} strokeWidth={1} className="vendor-detail__hero-icon" aria-hidden="true" />

        <div className="vendor-detail__hero-content">
          <div className="vendor-detail__avatar" style={{ background: `${profile.avatarColor}33`, color: '#ffffff' }}>
            {profile.avatarInitials}
          </div>

          <div className="vendor-detail__identity">
            <div className="vendor-detail__name-row">
              <h1 className="vendor-detail__name">{profile.name}</h1>
              {profile.verified && (
                <span className="vendor-detail__verified" title="Verified profile">
                  <BadgeCheck size={18} />
                </span>
              )}
            </div>
            <p className="vendor-detail__title">{profile.title}</p>

            <div className="vendor-detail__badges">
              <span className={`vendor-detail__role-badge vendor-detail__role-badge--${profile.role.toLowerCase()}`}>
                {profile.role}
              </span>
              <span className="vendor-detail__level-badge">
                <Award size={12} /> {profile.level}
                <span className="vendor-detail__tier" aria-hidden="true">
                  {Array.from({ length: profile.tier }, (_, i) => (
                    <Diamond key={i} size={9} fill="currentColor" />
                  ))}
                </span>
              </span>
            </div>
          </div>

          <div className="vendor-detail__hero-actions">
            <span className="vendor-detail__price">{profile.startingPrice}</span>
            <div className="vendor-detail__hero-buttons">
              <button
                type="button"
                className={`vendor-detail__btn-save ${isSaved ? 'vendor-detail__btn-save--active' : ''}`}
                onClick={() => setIsSaved((prev) => !prev)}
                aria-pressed={isSaved}
              >
                <Heart size={15} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved' : 'Save'}
              </button>
              <button type="button" className="vendor-detail__btn-message">
                <MessageCircle size={15} /> Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="vendor-detail__stats-row">
        <div className="vendor-detail__stat-box">
          <div className="vendor-detail__stat-value">
            <Star size={16} fill="#f59e0b" stroke="#f59e0b" /> {profile.rating.toFixed(1)}
          </div>
          <div className="vendor-detail__stat-label">{formatReviewCount(profile.reviewCount)} reviews</div>
        </div>
        <div className="vendor-detail__stat-box">
          <div className="vendor-detail__stat-value">{profile.completedProjects}</div>
          <div className="vendor-detail__stat-label">Projects completed</div>
        </div>
        <div className="vendor-detail__stat-box">
          <div className="vendor-detail__stat-value"><Clock size={16} /> {profile.responseTime.replace('Usually responds in ', '')}</div>
          <div className="vendor-detail__stat-label">Response time</div>
        </div>
        <div className="vendor-detail__stat-box">
          <div className="vendor-detail__stat-value"><MapPin size={16} /> {profile.location.split(',')[0]}</div>
          <div className="vendor-detail__stat-label">{profile.location.split(',')[1]?.trim()}</div>
        </div>
      </div>

      {/* About */}
      <div className="vendor-detail__section">
        <h3>About</h3>
        <p className="vendor-detail__bio">{profile.longBio}</p>
      </div>

      {/* Skills */}
      <div className="vendor-detail__section">
        <h3>Skills</h3>
        <div className="vendor-detail__skills">
          {profile.skills.map((skill) => (
            <span key={skill} className="vendor-detail__skill-chip">{skill}</span>
          ))}
        </div>
      </div>

      {/* Portfolio Highlights */}
      <div className="vendor-detail__section">
        <h3>Portfolio Highlights</h3>
        <div className="vendor-detail__portfolio-grid">
          {profile.portfolioHighlights.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.label}
                className="vendor-detail__portfolio-card"
                style={{ background: `linear-gradient(135deg, ${profile.avatarColor}26, ${profile.avatarColor}0d)` }}
              >
                <div className="vendor-detail__portfolio-icon" style={{ background: `${profile.avatarColor}22`, color: profile.avatarColor }}>
                  <ItemIcon size={20} />
                </div>
                <h4 className="vendor-detail__portfolio-label">{item.label}</h4>
                <span className="vendor-detail__portfolio-category">
                  <CheckCircle size={11} /> {item.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Related Profiles */}
      {relatedProfiles.length > 0 && (
        <div className="vendor-detail__section">
          <h3>More {profile.role}s</h3>
          <div className="vendor-detail__related-grid">
            {relatedProfiles.map((related) => {
              const RelatedIcon = related.bannerIcon;
              return (
                <div
                  key={related.id}
                  className="vendor-detail__related-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/vendor/${related.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/vendor/${related.id}`);
                  }}
                >
                  <div className="vendor-detail__related-icon" style={{ background: `${related.avatarColor}22`, color: related.avatarColor }}>
                    <RelatedIcon size={20} />
                  </div>
                  <div>
                    <h4>{related.name}</h4>
                    <p>{related.title}</p>
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

export default VendorDetail;
