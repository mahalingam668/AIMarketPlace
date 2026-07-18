import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  ShoppingBag,
  ShieldCheck,
  RefreshCw,
  Star,
  UserPlus,
  Layers,
  Compass,
  Send,
  Wallet,
  Award,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import './HowItWorks.css';

interface Step {
  step: number;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const HIRING_STEPS: Step[] = [
  {
    step: 1,
    icon: Search,
    title: 'Search & compare',
    desc: 'Browse gigs across Chatbot Development, AI Content Generation, AI Video & Audio, Data Science, and AI Consulting. Filter by budget, delivery time, and seller level to shortlist the right match.',
  },
  {
    step: 2,
    icon: Users,
    title: 'Compare sellers',
    desc: 'Check ratings, completed-order counts, portfolios, and trust badges — New Seller, Level 2, Top Rated, or Verified Specialist — before you commit to anyone.',
  },
  {
    step: 3,
    icon: ShoppingBag,
    title: 'Order a package or post a brief',
    desc: "Order a seller's Basic, Standard, or Premium package directly for a fixed price and scope, or post a project brief and let developers send you proposals if your needs are custom.",
  },
  {
    step: 4,
    icon: ShieldCheck,
    title: 'Funds move into escrow',
    desc: 'Your payment is charged and held in escrow the moment you place the order. The seller sees the funds are secured and gets to work — nothing is paid out until you approve the delivery.',
  },
  {
    step: 5,
    icon: RefreshCw,
    title: 'Review delivery & request revisions',
    desc: 'Inspect the delivered work in your order workspace and request a revision if it doesn\'t match the brief, up to the revision limit listed on the package you ordered.',
  },
  {
    step: 6,
    icon: Star,
    title: 'Release payment & leave a review',
    desc: 'Approve the delivery to release the escrowed funds to the seller, then leave a review tied to that specific, completed order.',
  },
];

const SELLING_STEPS: Step[] = [
  {
    step: 1,
    icon: UserPlus,
    title: 'Build your profile',
    desc: 'Create a Developer workspace and showcase your AI specialty — chatbot development, generative content, data science, or AI consulting — along with your skills and past work.',
  },
  {
    step: 2,
    icon: Layers,
    title: 'Create gig packages',
    desc: 'Publish a gig structured into Basic, Standard, and Premium packages, each with its own scope, price, delivery time, and number of revisions.',
  },
  {
    step: 3,
    icon: Compass,
    title: 'Get discovered',
    desc: 'Buyers searching by category or keyword find your gig in search results. Fast responses, clear packages, and a complete profile help you rank higher and win more orders.',
  },
  {
    step: 4,
    icon: Send,
    title: 'Deliver the work',
    desc: 'Communicate with your client in the order workspace, submit deliverables by the agreed date, and handle revision requests within the terms of the package they ordered.',
  },
  {
    step: 5,
    icon: Wallet,
    title: 'Get paid',
    desc: 'Once the client approves the delivery, the escrowed funds release to your balance, ready to withdraw. No chasing invoices.',
  },
  {
    step: 6,
    icon: Award,
    title: 'Build your reputation',
    desc: 'Every completed order and review moves you up the trust ladder — New Seller, Level 2, Top Rated, Verified Specialist — putting your gigs in front of more buyers.',
  },
];

function StepGrid({ steps }: { steps: Step[] }) {
  return (
    <div className="how-it-works__steps">
      {steps.map((s) => (
        <div key={s.step} className="how-it-works__step">
          <span className="how-it-works__step-number">{s.step}</span>
          <div className="how-it-works__step-icon">
            <s.icon size={18} />
          </div>
          <h4>{s.title}</h4>
          <p>{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="how-it-works">
      <section className="how-it-works__hero">
        <span className="how-it-works__eyebrow">How It Works</span>
        <h1>One marketplace, two ways to move faster on AI</h1>
        <p>
          YAKKAY AI Line connects companies who need AI work done with developers who specialize in building it —
          chatbots, generative content, data pipelines, and AI strategy — with escrow-protected payments on every
          order.
        </p>
      </section>

      <section className="how-it-works__track">
        <div className="how-it-works__track-header">
          <span className="how-it-works__track-tag how-it-works__track-tag--buy">Track 1</span>
          <h2>Hiring on YAKKAY</h2>
          <p>For Companies and visitors who need AI expertise, from a single chatbot script to a full data project.</p>
        </div>
        <StepGrid steps={HIRING_STEPS} />
      </section>

      <section className="how-it-works__track">
        <div className="how-it-works__track-header">
          <span className="how-it-works__track-tag how-it-works__track-tag--sell">Track 2</span>
          <h2>Selling on YAKKAY</h2>
          <p>For AI developers and freelancers who want to turn chatbot, content, data, and consulting skills into paid work.</p>
        </div>
        <StepGrid steps={SELLING_STEPS} />
      </section>

      <section className="how-it-works__cta">
        <div>
          <h3>Ready to get started?</h3>
          <p>Post a brief or browse gigs as a buyer, or set up a seller profile in minutes.</p>
        </div>
        <div className="how-it-works__cta-actions">
          <button type="button" className="how-it-works__cta-btn" onClick={() => navigate('/browse')}>
            Start hiring <ArrowRight size={15} />
          </button>
          <button
            type="button"
            className="how-it-works__cta-btn how-it-works__cta-btn--outline"
            onClick={() => navigate('/register', { state: { role: 'Developer' } })}
          >
            Start selling <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;
