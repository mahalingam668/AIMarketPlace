import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Rss, MessageCircle, Share2, Globe2, ShieldCheck } from 'lucide-react';
import './Footer.css';

interface FooterSection {
  title: string;
  links: { text: string; href: string }[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { text: 'Browse Marketplace', href: '#/browse' },
      { text: 'AI Solutions', href: '#/browse' },
      { text: 'Data & Model Catalog', href: '#/catalog' },
      { text: 'Governance Center', href: '#/governance' },
      { text: 'Integrations', href: '#/integrations' },
      { text: 'Pricing & Plans', href: '#/pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { text: 'Documentation', href: '#/documentation' },
      { text: 'Comparison Center', href: '#/compare' },
      { text: 'Customer Stories', href: '#/customers' },
      { text: 'Request a Demo', href: '#/request-demo' },
    ],
  },
  {
    title: 'Company',
    links: [
      { text: 'About YAKKAY', href: '#/about' },
      { text: 'Contact Sales', href: '#/contact' },
      { text: 'Careers', href: '#' },
      { text: 'Press Kit', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { text: 'Terms of Service', href: '#' },
      { text: 'Privacy Policy', href: '#' },
      { text: 'Cookie Policy', href: '#' },
      { text: 'Service Level Agreement', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Share2, label: 'Social Feed', href: '#' },
  { icon: MessageCircle, label: 'Developer Community', href: '#' },
  { icon: Rss, label: 'Blog RSS', href: '#' },
  { icon: Globe2, label: 'Global Status Page', href: '#' },
];

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#/')) {
      e.preventDefault();
      navigate(href.slice(1));
    }
  };

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <div className="footer__brand-logo">
            <span className="footer__brand-icon">
              <Sparkles size={18} />
            </span>
            <span className="footer__brand-name">YAKKAY AI Line</span>
          </div>
          <p className="footer__brand-desc">
            The enterprise marketplace for discovering, governing, and deploying production-grade AI —
            models, agents, and integrations — through one unified, compliant platform.
          </p>
          <div className="footer__brand-badges">
            <span className="footer__brand-badge">
              <ShieldCheck size={12} /> Sample compliance data — for demo purposes
            </span>
            <span className="footer__brand-badge">
              <Globe2 size={12} /> 99.99% Global Uptime
            </span>
          </div>
          <div className="footer__socials">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} className="footer__social-link" aria-label={label}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer__grid">
          {footerSections.map((section) => (
            <div key={section.title} className="footer__column">
              <h4 className="footer__title">{section.title}</h4>
              <ul className="footer__links">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <a href={link.href} className="footer__link" onClick={(e) => handleLinkClick(e, link.href)}>
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          © {new Date().getFullYear()} YAKKAY AI Line, Inc. All rights reserved.
        </p>
        <p className="footer__tagline">Built for teams shipping AI at scale.</p>
      </div>
    </footer>
  );
};

export default Footer;
