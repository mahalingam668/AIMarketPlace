import { useNavigate } from 'react-router-dom';
import { Check, Rocket, PhoneCall } from 'lucide-react';
import './Pricing.css';

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'For individuals evaluating the platform.',
    features: ['Access to the full Marketplace', 'Community support', 'Up to 3 saved favorites', 'Basic usage analytics'],
  },
  {
    name: 'Professional',
    price: '$199',
    period: '/mo per workspace',
    popular: true,
    desc: 'For growing teams shipping AI in production.',
    features: ['Everything in Starter', 'Full Catalog & Governance access', 'Priority support', 'Unlimited favorites & bookmarks', 'Team roles & permissions'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'For organizations with compliance and scale needs.',
    features: ['Everything in Professional', 'SSO / SAML', 'Dedicated account manager', 'Custom SLAs & on-prem options', 'Audit-ready compliance reporting'],
  },
];

function Pricing() {
  const navigate = useNavigate();
  return (
    <div className="pricing">
      <div className="pricing__header">
        <h1>Simple, transparent workspace pricing</h1>
        <p>Individual product pricing is set per model on its product page. This is your platform-level workspace plan.</p>
      </div>

      <div className="pricing__grid">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`pricing__card ${plan.popular ? 'pricing__card--popular' : ''}`}>
            {plan.popular && <span className="pricing__badge">Most Popular</span>}
            <h3>{plan.name}</h3>
            <div className="pricing__price-row">
              <span className="pricing__price">{plan.price}</span>
              {plan.period && <span className="pricing__period">{plan.period}</span>}
            </div>
            <p className="pricing__desc">{plan.desc}</p>
            <ul>
              {plan.features.map((f) => (
                <li key={f}><Check size={14} /> {f}</li>
              ))}
            </ul>
            <button
              type="button"
              className={plan.popular ? 'pricing__cta pricing__cta--primary' : 'pricing__cta'}
              onClick={() => navigate(plan.name === 'Enterprise' ? '/contact' : '/request-demo')}
            >
              {plan.name === 'Enterprise' ? <PhoneCall size={14} /> : <Rocket size={14} />}
              {plan.name === 'Enterprise' ? 'Contact Sales' : 'Request a Demo'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
