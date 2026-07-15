import { useNavigate } from 'react-router-dom';
import { Star, BadgeCheck, Award, Diamond, Clock, MapPin } from 'lucide-react';
import type { VendorProfile } from '../../../data/vendorProfiles';
import './SellerCard.css';

interface SellerCardProps {
  seller: VendorProfile;
}

function SellerCard({ seller }: SellerCardProps) {
  const navigate = useNavigate();

  return (
    <div className="seller-card" onClick={() => navigate(`/vendor/${seller.id}`)}>
      <div className="seller-card__header">
        <div className="seller-card__avatar" style={{ background: `${seller.avatarColor}22`, color: seller.avatarColor }}>
          {seller.avatarInitials}
        </div>
        <div className="seller-card__identity">
          <span className="seller-card__name">
            {seller.name}
            {seller.verified && (
              <span className="seller-card__verified" title="Verified profile">
                <BadgeCheck size={13} />
              </span>
            )}
          </span>
          <span className="seller-card__level">
            <Award size={11} /> {seller.level}
            <span className="seller-card__tier" aria-hidden="true">
              {Array.from({ length: seller.tier }, (_, i) => (
                <Diamond key={i} size={8} fill="currentColor" />
              ))}
            </span>
          </span>
        </div>
      </div>

      <div className="seller-card__stats">
        <span><Star size={12} fill="#f59e0b" stroke="#f59e0b" /> {seller.rating.toFixed(1)} ({seller.reviewCount})</span>
        <span><MapPin size={12} /> {seller.location}</span>
      </div>

      <p className="seller-card__response">
        <Clock size={12} /> {seller.responseTime}
      </p>

      <div className="seller-card__languages">
        {seller.languages.map((lang) => (
          <span key={lang} className="seller-card__language-chip">{lang}</span>
        ))}
      </div>

      <button type="button" className="seller-card__btn" onClick={(e) => { e.stopPropagation(); navigate(`/vendor/${seller.id}`); }}>
        View Full Profile
      </button>
    </div>
  );
}

export default SellerCard;
