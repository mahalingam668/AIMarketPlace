import {
  ShieldCheck,
  Lock,
  CircleCheckBig,
  Sparkles,
  BadgeCheck,
  Trophy,
  Gavel,
  MessageSquare,
  ClipboardCheck,
  Scale,
  Star,
  type LucideIcon,
} from 'lucide-react';
import './TrustSafety.css';

interface EscrowStep {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const ESCROW_FLOW: EscrowStep[] = [
  {
    icon: Lock,
    title: 'Charged & held',
    desc: 'Payment is charged the moment an order is placed and held in escrow — not sent to the seller yet.',
  },
  {
    icon: ClipboardCheck,
    title: 'Work delivered',
    desc: 'The seller delivers against the package brief. The buyer reviews it and can request revisions within the limit.',
  },
  {
    icon: CircleCheckBig,
    title: 'Funds released',
    desc: 'Once the buyer approves the delivery, the held funds release to the seller. Nothing pays out before approval.',
  },
];

interface BadgeTier {
  icon: LucideIcon;
  name: string;
  criteria: string;
}

const BADGE_TIERS: BadgeTier[] = [
  {
    icon: Sparkles,
    name: 'New Seller',
    criteria: 'Just joined YAKKAY. Full escrow and dispute protections apply from their very first order, even before they have a review history.',
  },
  {
    icon: Star,
    name: 'Level 2 Seller',
    criteria: 'A consistent track record — multiple completed orders, on-time delivery, and a strong average rating sustained over a rolling period.',
  },
  {
    icon: Trophy,
    name: 'Top Rated Seller',
    criteria: 'Sustained high performance at volume: a high completed-order count, top-tier ratings, fast response time, and a low cancellation rate.',
  },
  {
    icon: BadgeCheck,
    name: 'Verified Specialist',
    criteria: 'Identity-verified and skill-assessed in a specific AI domain — chatbot engineering, generative content, data science, or AI consulting — the highest trust signal for specialized work.',
  },
];

interface DisputeStep {
  step: number;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const DISPUTE_STEPS: DisputeStep[] = [
  {
    step: 1,
    icon: MessageSquare,
    title: 'Resolve it directly',
    desc: 'Most delivery disagreements are worked out in the order workspace, using the revisions already included in the package.',
  },
  {
    step: 2,
    icon: Gavel,
    title: 'Escalate to admin review',
    desc: "If buyer and seller can't agree, either side can open a dispute. A Super Admin reviews the original brief, the delivered files, and the full message history.",
  },
  {
    step: 3,
    icon: Scale,
    title: 'Binding decision',
    desc: 'The admin issues a binding decision — releasing the payout to the seller, refunding the buyer, or splitting the escrowed funds — based strictly on what was agreed and delivered.',
  },
];

function TrustSafety() {
  return (
    <div className="trust-safety">
      <section className="trust-safety__hero">
        <span className="trust-safety__eyebrow">Trust & Safety</span>
        <h1>Built so every order is safe to start, and safe to finish</h1>
        <p>
          Escrow-protected payments, criteria-based seller badges, a binding dispute process, and reviews tied to
          real completed orders — the mechanics that make hiring and selling AI services on YAKKAY feel safe on
          both sides.
        </p>
      </section>

      <section className="trust-safety__section">
        <div className="trust-safety__section-header">
          <ShieldCheck size={20} />
          <h2>Escrow protection</h2>
        </div>
        <p className="trust-safety__section-intro">
          Money never moves straight from buyer to seller. It moves through escrow, in three steps.
        </p>
        <div className="trust-safety__escrow-flow">
          {ESCROW_FLOW.map((s, i) => (
            <div key={s.title} className="trust-safety__escrow-step-wrap">
              <div className="trust-safety__escrow-step">
                <div className="trust-safety__escrow-icon">
                  <s.icon size={18} />
                </div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
              {i < ESCROW_FLOW.length - 1 && <span className="trust-safety__escrow-arrow">→</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="trust-safety__section">
        <div className="trust-safety__section-header">
          <BadgeCheck size={20} />
          <h2>Seller badges & trust tiers</h2>
        </div>
        <p className="trust-safety__section-intro">
          Every seller is placed on a criteria-based trust ladder — earned through delivery, not paid for.
        </p>
        <div className="trust-safety__badges-grid">
          {BADGE_TIERS.map((b) => (
            <div key={b.name} className="trust-safety__badge-card">
              <div className="trust-safety__badge-icon">
                <b.icon size={20} />
              </div>
              <h4>{b.name}</h4>
              <p>{b.criteria}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="trust-safety__section">
        <div className="trust-safety__section-header">
          <Gavel size={20} />
          <h2>Dispute resolution</h2>
        </div>
        <p className="trust-safety__section-intro">
          If a delivery is contested, it doesn't just sit unresolved — here's exactly what happens.
        </p>
        <div className="trust-safety__dispute-steps">
          {DISPUTE_STEPS.map((d) => (
            <div key={d.step} className="trust-safety__dispute-step">
              <span className="trust-safety__dispute-number">{d.step}</span>
              <div className="trust-safety__dispute-icon">
                <d.icon size={18} />
              </div>
              <h4>{d.title}</h4>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="trust-safety__section">
        <div className="trust-safety__section-header">
          <Star size={20} />
          <h2>Review integrity</h2>
        </div>
        <p className="trust-safety__review-copy">
          Only the buyer on a verified, completed order can leave a review for that order — reviews aren't open
          text anyone can post, they're tied to a real, escrow-settled transaction. That's what makes a seller's
          rating and badge progress a signal of actual delivered work, not manipulation.
        </p>
      </section>
    </div>
  );
}

export default TrustSafety;
