import { motion } from 'framer-motion';
import { Sparkles, Brain, ShieldCheck, Plug, BarChart3, Quote } from 'lucide-react';
import './AuthVisual.css';

const STATS = [
  { value: '2,847', label: 'AI tools in catalog' },
  { value: '48.2K', label: 'Enterprise teams' },
  { value: '99.99%', label: 'Platform uptime' },
];

const FLOATERS = [
  { icon: Brain, style: { top: '14%', left: '12%' }, delay: 0 },
  { icon: ShieldCheck, style: { top: '22%', right: '10%' }, delay: 0.6 },
  { icon: Plug, style: { bottom: '30%', left: '8%' }, delay: 1.1 },
  { icon: BarChart3, style: { bottom: '16%', right: '14%' }, delay: 1.6 },
];

function AuthVisual() {
  return (
    <div className="auth-visual">
      <div className="auth-visual__tile" aria-hidden="true" />
      <div className="auth-visual__glow" aria-hidden="true" />

      {FLOATERS.map(({ icon: Icon, style, delay }, i) => (
        <motion.div
          key={i}
          className="auth-visual__floater"
          style={style}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
        >
          <Icon size={20} />
        </motion.div>
      ))}

      <div className="auth-visual__content">
        <div className="auth-visual__mark">
          <Sparkles size={28} />
        </div>
        <h2 className="auth-visual__title">The enterprise marketplace for production-grade AI</h2>
        <p className="auth-visual__subtitle">
          Discover, govern, and deploy language models, agents, and integrations through one unified,
          compliant platform.
        </p>

        <div className="auth-visual__stats">
          {STATS.map((s) => (
            <div key={s.label} className="auth-visual__stat">
              <span className="auth-visual__stat-value">{s.value}</span>
              <span className="auth-visual__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="auth-visual__quote">
          <Quote size={16} className="auth-visual__quote-icon" />
          <p>"We replaced three manual review steps with a single governed pipeline — audit-ready from day one."</p>
          <span>Director of Risk Operations, Meridian Financial Group</span>
        </div>
      </div>
    </div>
  );
}

export default AuthVisual;
