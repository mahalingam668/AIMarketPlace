import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ShieldCheck, AlertTriangle, Clock, CheckCircle2, XCircle,
  Lock, FileCheck2, KeyRound,
} from 'lucide-react';
import { aiTools } from '../../data/mockData';
import './Governance.css';

type ComplianceStatus = 'Approved' | 'Under Review' | 'Flagged';

function getComplianceStatus(rating: number): ComplianceStatus {
  if (rating >= 4.5) return 'Approved';
  if (rating >= 4.0) return 'Under Review';
  return 'Flagged';
}

const STATUS_META: Record<ComplianceStatus, { color: string; icon: typeof CheckCircle2 }> = {
  Approved: { color: 'var(--success)', icon: CheckCircle2 },
  'Under Review': { color: 'var(--warning)', icon: Clock },
  Flagged: { color: 'var(--error)', icon: XCircle },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function Governance() {
  const governedModels = useMemo(
    () => aiTools.map((tool) => ({ ...tool, status: getComplianceStatus(tool.rating) })),
    []
  );

  const summary = useMemo(() => {
    const approved = governedModels.filter((m) => m.status === 'Approved').length;
    const review = governedModels.filter((m) => m.status === 'Under Review').length;
    const flagged = governedModels.filter((m) => m.status === 'Flagged').length;
    return { approved, review, flagged, total: governedModels.length };
  }, [governedModels]);

  const handleRequestAccess = (name: string) => {
    toast.success(`Access request submitted for ${name}. Your governance admin will review shortly.`);
  };

  return (
    <div className="governance">
      <div className="governance__header">
        <span className="governance__eyebrow"><ShieldCheck size={13} /> Catalog & Governance</span>
        <h1>Governance Center</h1>
        <p>Monitor compliance status, manage access requests, and enforce policy across every model in production.</p>
      </div>

      {/* Summary cards */}
      <motion.div className="governance__summary" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="governance__summary-card" variants={itemVariants}>
          <ShieldCheck size={20} />
          <div>
            <span className="governance__summary-value">{summary.total}</span>
            <span className="governance__summary-label">Models Governed</span>
          </div>
        </motion.div>
        <motion.div className="governance__summary-card governance__summary-card--success" variants={itemVariants}>
          <CheckCircle2 size={20} />
          <div>
            <span className="governance__summary-value">{summary.approved}</span>
            <span className="governance__summary-label">Approved</span>
          </div>
        </motion.div>
        <motion.div className="governance__summary-card governance__summary-card--warning" variants={itemVariants}>
          <Clock size={20} />
          <div>
            <span className="governance__summary-value">{summary.review}</span>
            <span className="governance__summary-label">Under Review</span>
          </div>
        </motion.div>
        <motion.div className="governance__summary-card governance__summary-card--error" variants={itemVariants}>
          <AlertTriangle size={20} />
          <div>
            <span className="governance__summary-value">{summary.flagged}</span>
            <span className="governance__summary-label">Flagged</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Compliance status table */}
      <section className="governance__section">
        <h2><FileCheck2 size={18} /> Compliance Status</h2>
        <div className="governance__table-wrap">
          <table className="governance__table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Category</th>
                <th>Status</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {governedModels.map((model) => {
                const meta = STATUS_META[model.status];
                const StatusIcon = meta.icon;
                return (
                  <tr key={model.id}>
                    <td className="governance__table-name">{model.name}</td>
                    <td>{model.category}</td>
                    <td>
                      <span className="governance__status" style={{ color: meta.color, background: `${meta.color}18` }}>
                        <StatusIcon size={12} /> {model.status}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="governance__request-btn" onClick={() => handleRequestAccess(model.name)}>
                        <KeyRound size={12} /> Request Access
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Access control */}
      <section className="governance__section">
        <h2><Lock size={18} /> Access Control Policy</h2>
        <div className="governance__policy-grid">
          <div className="governance__policy-card">
            <h4>Least Privilege by Default</h4>
            <p>New workspace members start with Viewer access. Elevated roles require an approved access request.</p>
          </div>
          <div className="governance__policy-card">
            <h4>SSO / SAML Enforcement</h4>
            <p>Enterprise workspaces can require single sign-on for all catalog and governance actions.</p>
          </div>
          <div className="governance__policy-card">
            <h4>Full Audit Trail</h4>
            <p>Every access grant, model promotion, and policy change is logged and exportable for review.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Governance;
