import { ShieldCheck, Globe2, Users, Target } from 'lucide-react';
import './About.css';

const VALUES = [
  { icon: ShieldCheck, title: 'Governance-first', desc: 'Every model in the catalog is traceable, auditable, and governed by design — not bolted on afterward.' },
  { icon: Globe2, title: 'Open by default', desc: 'We favor open standards and portable integrations over vendor lock-in wherever we can.' },
  { icon: Users, title: 'Built for teams', desc: 'From individual evaluators to enterprise platform teams, the same catalog scales with you.' },
  { icon: Target, title: 'Outcome-focused', desc: 'We measure success in hours saved and incidents avoided, not just API calls served.' },
];

const STATS = [
  { value: '2,847', label: 'AI tools in catalog' },
  { value: '48.2K', label: 'Enterprise teams' },
  { value: '99.99%', label: 'Platform uptime' },
];

function About() {
  return (
    <div className="about">
      <section className="about__hero">
        <span className="about__eyebrow">About YAKKAY</span>
        <h1>The enterprise AI marketplace, built for governance-first teams</h1>
        <p>
          YAKKAY AI Line unifies model discovery, governance, and deployment into a single marketplace so
          enterprise teams can move fast without losing control of what's running in production.
        </p>
      </section>

      <section className="about__stats">
        {STATS.map((s) => (
          <div key={s.label} className="about__stat">
            <span className="about__stat-value">{s.value}</span>
            <span className="about__stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      <section className="about__values">
        <h2>What we optimize for</h2>
        <div className="about__values-grid">
          {VALUES.map((v) => (
            <div key={v.title} className="about__value-card">
              <div className="about__value-icon"><v.icon size={20} /></div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
