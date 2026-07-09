import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Rocket } from 'lucide-react';
import './RequestDemo.css';

const TEAM_SIZES = ['1–50', '51–200', '201–1,000', '1,000+'];
const USE_CASES = ['Language Models', 'AI Agents', 'Data Analytics', 'Document Processing', 'Governance & Compliance', 'Other'];

function RequestDemo() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', teamSize: TEAM_SIZES[0], useCase: USE_CASES[0] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="request-demo">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key="form" className="request-demo__card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <span className="request-demo__eyebrow"><Rocket size={13} /> Request a Demo</span>
            <h1>See YAKKAY AI Line in action</h1>
            <p>Tell us a bit about your team and a solutions engineer will follow up to schedule a walkthrough.</p>

            <form onSubmit={handleSubmit}>
              <div className="request-demo__grid">
                <label>
                  <span>Full Name</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label>
                  <span>Work Email</span>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
              </div>
              <label>
                <span>Company</span>
                <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </label>
              <div className="request-demo__grid">
                <label>
                  <span>Team Size</span>
                  <select value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })}>
                    {TEAM_SIZES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label>
                  <span>Primary Use Case</span>
                  <select value={form.useCase} onChange={(e) => setForm({ ...form, useCase: e.target.value })}>
                    {USE_CASES.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </label>
              </div>
              <button type="submit" className="request-demo__submit">Request Demo</button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="success" className="request-demo__card request-demo__success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="request-demo__success-icon"><CheckCircle2 size={36} /></div>
            <h2>Thanks, {form.name.split(' ')[0] || 'there'}!</h2>
            <p>A solutions engineer will reach out to {form.email || 'your inbox'} within one business day to schedule your walkthrough.</p>
            <div className="request-demo__success-actions">
              <button type="button" onClick={() => navigate('/browse')}>Browse Marketplace</button>
              <button type="button" onClick={() => navigate('/')}>Back to Home</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RequestDemo;
