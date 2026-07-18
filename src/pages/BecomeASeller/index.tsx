import { useNavigate } from 'react-router-dom';
import {
  Users,
  Coins,
  ShieldCheck,
  Award,
  ArrowRight,
  UserPlus,
  Layers,
  Send,
  Bot,
  PenSquare,
  Video,
  BarChart4,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';
import './BecomeASeller.css';

interface ValueProp {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const VALUE_PROPS: ValueProp[] = [
  {
    icon: Users,
    title: 'Reach buyers already looking for AI expertise',
    desc: 'Every visitor on YAKKAY is here for AI work — chatbots, generative content, data pipelines, or consulting. You are not competing for attention outside your specialty.',
  },
  {
    icon: Coins,
    title: 'Keep more of what you earn',
    desc: 'Set your own prices across Basic, Standard, and Premium packages. Our service fee is shown up front on every order, so there are no surprise deductions at payout.',
  },
  {
    icon: ShieldCheck,
    title: 'Get paid reliably via escrow',
    desc: "A client's payment is charged and held in escrow the moment they place an order — before you deliver a single file. You are never chasing an invoice or wondering if you'll get paid for finished work.",
  },
  {
    icon: Award,
    title: 'Build a reputation that compounds',
    desc: 'Every completed order and review moves you up the trust ladder — New Seller, Level 2, Top Rated, Verified Specialist — putting your gigs in front of more buyers over time.',
  },
];

interface StartStep {
  step: number;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const START_STEPS: StartStep[] = [
  {
    step: 1,
    icon: UserPlus,
    title: 'Create your Developer workspace',
    desc: 'Sign up and choose the Developer role. It takes a couple of minutes and there is no cost to create a seller profile.',
  },
  {
    step: 2,
    icon: Layers,
    title: 'Publish your first gig',
    desc: 'Define your Basic, Standard, and Premium packages — scope, price, delivery time, and revisions — and showcase relevant past work.',
  },
  {
    step: 3,
    icon: Send,
    title: 'Start receiving orders',
    desc: 'Respond quickly, deliver against the brief, and get paid automatically once the buyer approves — no separate invoicing step required.',
  },
];

const CATEGORIES: { icon: LucideIcon; label: string }[] = [
  { icon: Bot, label: 'Chatbot Development' },
  { icon: PenSquare, label: 'AI Content Generation' },
  { icon: Video, label: 'AI Video & Audio' },
  { icon: BarChart4, label: 'Data Science' },
  { icon: Lightbulb, label: 'AI Consulting' },
];

function BecomeASeller() {
  const navigate = useNavigate();
  const goToRegister = () => navigate('/register', { state: { role: 'Developer' } });

  return (
    <div className="become-seller">
      <section className="become-seller__hero">
        <span className="become-seller__eyebrow">For AI Developers & Freelancers</span>
        <h1>Turn your AI expertise into a business</h1>
        <p>
          List chatbot builds, AI content and video work, data science, or consulting as gigs, get discovered by
          companies actively hiring, and get paid reliably through escrow-protected orders.
        </p>
        <div className="become-seller__hero-actions">
          <button type="button" className="become-seller__cta-btn" onClick={goToRegister}>
            Start selling on YAKKAY <ArrowRight size={16} />
          </button>
          <span className="become-seller__hero-note">Free to join. No cost to publish a gig.</span>
        </div>
      </section>

      <section className="become-seller__categories">
        {CATEGORIES.map((c) => (
          <div key={c.label} className="become-seller__category-chip">
            <c.icon size={15} />
            {c.label}
          </div>
        ))}
      </section>

      <section className="become-seller__values">
        <h2>Why sell on YAKKAY</h2>
        <div className="become-seller__values-grid">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className="become-seller__value-card">
              <div className="become-seller__value-icon">
                <v.icon size={20} />
              </div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="become-seller__start">
        <h2>Three steps to your first order</h2>
        <div className="become-seller__start-grid">
          {START_STEPS.map((s) => (
            <div key={s.step} className="become-seller__start-card">
              <span className="become-seller__start-number">{s.step}</span>
              <div className="become-seller__start-icon">
                <s.icon size={18} />
              </div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="become-seller__final-cta">
        <h3>Your AI skills are in demand. Start getting paid for them.</h3>
        <button type="button" className="become-seller__cta-btn" onClick={goToRegister}>
          Create my Developer workspace <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}

export default BecomeASeller;
