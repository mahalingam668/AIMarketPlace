import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Search, Users, Building2, DollarSign, Cloud, Plug, Star, X, BookOpen,
  Landmark, type LucideIcon,
} from 'lucide-react';
import './Integrations.css';

interface Integration {
  id: string;
  name: string;
  category: 'CRM' | 'ERP' | 'Finance' | 'HR' | 'Cloud' | 'API';
  description: string;
  rating: number;
  installs: string;
}

const CATEGORY_ICONS: Record<Integration['category'], LucideIcon> = {
  CRM: Users,
  ERP: Building2,
  Finance: DollarSign,
  HR: Users,
  Cloud: Cloud,
  API: Plug,
};

const INTEGRATIONS: Integration[] = [
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', description: 'Sync leads, opportunities, and AI-scored accounts directly into Salesforce.', rating: 4.7, installs: '12.4K' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', description: 'Push AI-generated content and lead scores into HubSpot workflows.', rating: 4.5, installs: '8.9K' },
  { id: 'sap', name: 'SAP S/4HANA', category: 'ERP', description: 'Connect production data pipelines to SAP for unified reporting.', rating: 4.3, installs: '3.1K' },
  { id: 'netsuite', name: 'NetSuite', category: 'ERP', description: 'Automate financial close workflows with AI-assisted reconciliation.', rating: 4.2, installs: '2.4K' },
  { id: 'quickbooks', name: 'QuickBooks', category: 'Finance', description: 'Categorize transactions automatically using language model classification.', rating: 4.6, installs: '6.7K' },
  { id: 'stripe', name: 'Stripe Billing', category: 'Finance', description: 'Meter usage-based AI billing and sync invoices in real time.', rating: 4.8, installs: '9.2K' },
  { id: 'workday', name: 'Workday', category: 'HR', description: 'Summarize resumes and screen candidates with governed AI models.', rating: 4.1, installs: '1.8K' },
  { id: 'bamboohr', name: 'BambooHR', category: 'HR', description: 'Automate onboarding document processing with Document AI.', rating: 4.4, installs: '2.9K' },
  { id: 'azure', name: 'Microsoft Azure', category: 'Cloud', description: 'Deploy models directly into your Azure VPC with managed scaling.', rating: 4.9, installs: '18.6K' },
  { id: 'aws', name: 'AWS', category: 'Cloud', description: 'One-click deployment into AWS with IAM-based access control.', rating: 4.8, installs: '21.3K' },
  { id: 'gcp', name: 'Google Cloud', category: 'Cloud', description: 'Run inference workloads on GCP with autoscaling GPU pools.', rating: 4.6, installs: '11.7K' },
  { id: 'webhooks', name: 'Webhooks & REST API', category: 'API', description: 'Subscribe to model events and trigger custom workflows via webhooks.', rating: 4.7, installs: '15.2K' },
];

const CATEGORIES: Array<Integration['category']> = ['CRM', 'ERP', 'Finance', 'HR', 'Cloud', 'API'];

function Integrations() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Integration['category'] | 'All'>('All');
  const [selected, setSelected] = useState<Integration | null>(null);

  const filtered = useMemo(() => {
    return INTEGRATIONS.filter((i) => {
      if (activeCategory !== 'All' && i.category !== activeCategory) return false;
      if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, activeCategory]);

  const handleInstall = (integration: Integration) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1200)), {
      loading: `Installing ${integration.name}...`,
      success: `${integration.name} connected to your workspace!`,
      error: 'Installation failed. Please try again.',
    });
    setSelected(null);
  };

  return (
    <div className="integrations">
      <div className="integrations__header">
        <span className="integrations__eyebrow"><Plug size={13} /> Integrations</span>
        <h1>Connect YAKKAY to your existing stack</h1>
        <p>120+ pre-built integrations across CRM, ERP, Finance, HR, Cloud, and API infrastructure.</p>
      </div>

      <div className="integrations__toolbar">
        <div className="integrations__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="integrations__categories">
          <button
            type="button"
            className={activeCategory === 'All' ? 'integrations__chip integrations__chip--active' : 'integrations__chip'}
            onClick={() => setActiveCategory('All')}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={activeCategory === cat ? 'integrations__chip integrations__chip--active' : 'integrations__chip'}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="integrations__grid">
        {filtered.map((integration) => {
          const Icon = CATEGORY_ICONS[integration.category];
          return (
            <motion.div key={integration.id} className="integrations__card" whileHover={{ y: -3 }}>
              <div className="integrations__card-icon">
                <Icon size={22} />
              </div>
              <h4>{integration.name}</h4>
              <span className="integrations__card-category">{integration.category}</span>
              <p>{integration.description}</p>
              <div className="integrations__card-footer">
                <span className="integrations__card-rating">
                  <Star size={12} fill="var(--warning)" stroke="var(--warning)" /> {integration.rating.toFixed(1)}
                  <span className="integrations__card-installs">&middot; {integration.installs} installs</span>
                </span>
              </div>
              <div className="integrations__card-actions">
                <button type="button" className="integrations__btn-install" onClick={() => setSelected(integration)}>
                  Install
                </button>
                <button type="button" className="integrations__btn-docs" onClick={() => navigate('/documentation')}>
                  <BookOpen size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="integrations__empty">
          <Landmark size={24} />
          <p>No integrations match your search.</p>
        </div>
      )}

      {/* Install flow modal */}
      <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="integrations__modal-overlay" />
          <Dialog.Content className="integrations__modal">
            {selected && (
              <>
                <div className="integrations__modal-header">
                  <Dialog.Title className="integrations__modal-title">Install {selected.name}</Dialog.Title>
                  <Dialog.Close className="integrations__modal-close"><X size={16} /></Dialog.Close>
                </div>
                <div className="integrations__modal-preview">
                  {(() => { const Icon = CATEGORY_ICONS[selected.category]; return <Icon size={40} />; })()}
                </div>
                <p className="integrations__modal-desc">{selected.description}</p>
                <ul className="integrations__modal-list">
                  <li>Grants read/write access scoped to this integration only</li>
                  <li>Can be revoked anytime from Workspace Settings</li>
                  <li>Usage is subject to your current plan's rate limits</li>
                </ul>
                <div className="integrations__modal-actions">
                  <Dialog.Close className="integrations__btn-cancel">Cancel</Dialog.Close>
                  <button type="button" className="integrations__btn-confirm" onClick={() => handleInstall(selected)}>
                    Confirm Install
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default Integrations;
