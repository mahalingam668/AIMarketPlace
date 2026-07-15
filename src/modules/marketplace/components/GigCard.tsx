import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { AITool } from '../../../types';
import { resolveIcon } from './iconMap';
import './GigCard.css';

interface GigCardProps {
  tool: AITool;
}

function formatPrice(tool: AITool): string {
  const freePlan = tool.pricing.find((p) => p.price === 0);
  const paidPlan = tool.pricing.find((p) => p.price > 0);
  if (freePlan && !paidPlan) return 'Free';
  if (paidPlan) return `From $${paidPlan.price}`;
  return 'Free';
}

function GigCard({ tool }: GigCardProps) {
  const navigate = useNavigate();
  const Icon = resolveIcon(tool.icon);

  return (
    <div className="gig-card" onClick={() => navigate(`/gig/${tool.id}`)}>
      <div className="gig-card__header" style={{ background: tool.gradient }}>
        {tool.badge && <span className="gig-card__badge">{tool.badge}</span>}
        <Icon size={40} className="gig-card__header-icon" strokeWidth={1.5} />
      </div>
      <div className="gig-card__body">
        <span className="gig-card__category">{tool.category}</span>
        <h3 className="gig-card__name">{tool.name}</h3>
        <p className="gig-card__company">{tool.company}</p>
        <div className="gig-card__footer">
          <span className="gig-card__rating">
            <Star size={12} fill="#f59e0b" stroke="#f59e0b" /> {tool.rating.toFixed(1)}
            <span className="gig-card__review-count">({tool.reviewCount})</span>
          </span>
          <span className="gig-card__price">{formatPrice(tool)}</span>
        </div>
      </div>
    </div>
  );
}

export default GigCard;
