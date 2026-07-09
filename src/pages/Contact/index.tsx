import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Mail, Building2, Headphones, Newspaper } from 'lucide-react';
import './Contact.css';

const CONTACT_CHANNELS = [
  { icon: Building2, title: 'Sales', desc: 'Talk to us about Enterprise plans and custom deployments.', email: 'sales@yakkay.ai' },
  { icon: Headphones, title: 'Support', desc: 'Get help with your existing workspace or integration.', email: 'support@yakkay.ai' },
  { icon: Newspaper, title: 'Press', desc: 'Media inquiries and partnership requests.', email: 'press@yakkay.ai' },
];

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks — we'll get back to you within one business day.");
    setForm({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="contact">
      <div className="contact__header">
        <h1>Get in touch</h1>
        <p>Whether you're evaluating the platform or already running it in production, we're here to help.</p>
      </div>

      <div className="contact__channels">
        {CONTACT_CHANNELS.map((c) => (
          <div key={c.title} className="contact__channel">
            <div className="contact__channel-icon"><c.icon size={18} /></div>
            <h4>{c.title}</h4>
            <p>{c.desc}</p>
            <a href={`mailto:${c.email}`}><Mail size={12} /> {c.email}</a>
          </div>
        ))}
      </div>

      <form className="contact__form" onSubmit={handleSubmit}>
        <div className="contact__form-grid">
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
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </label>
        <label>
          <span>Message</span>
          <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </label>
        <button type="submit" className="contact__submit">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;
