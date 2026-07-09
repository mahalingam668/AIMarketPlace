import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Database, Search, Tag, ShieldCheck, ArrowRight, GitBranch,
  Server, Layers, FileCheck2, Lock,
} from 'lucide-react';
import { aiTools } from '../../data/mockData';
import './Catalog.css';

const CLASSIFICATIONS = ['Public', 'Internal', 'Confidential'] as const;

function getClassification(index: number): (typeof CLASSIFICATIONS)[number] {
  return CLASSIFICATIONS[index % CLASSIFICATIONS.length];
}

const CLASSIFICATION_COLOR: Record<string, string> = {
  Public: 'var(--success)',
  Internal: 'var(--info)',
  Confidential: 'var(--warning)',
};

const PERMISSION_ROWS = [
  { role: 'Owner', read: true, write: true, deploy: true, delete: true },
  { role: 'Editor', read: true, write: true, deploy: true, delete: false },
  { role: 'Contributor', read: true, write: true, deploy: false, delete: false },
  { role: 'Viewer', read: true, write: false, deploy: false, delete: false },
];

function Catalog() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const assets = useMemo(() => {
    return aiTools
      .map((tool, i) => ({
        ...tool,
        classification: getClassification(i),
        qualityScore: Math.round(tool.rating * 20),
      }))
      .filter((tool) => tool.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div className="catalog">
      <div className="catalog__header">
        <div>
          <span className="catalog__eyebrow"><Database size={13} /> Catalog & Governance</span>
          <h1>Data & Model Catalog</h1>
          <p>Discover, classify, and trace every model and dataset asset across your AI estate.</p>
        </div>
      </div>

      <div className="catalog__search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search the catalog by asset name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Data Lineage */}
      <section className="catalog__section">
        <h2><GitBranch size={18} /> Data Lineage</h2>
        <p className="catalog__section-desc">
          A simplified lineage view showing how data flows from raw sources through to production serving.
        </p>
        <div className="catalog__lineage">
          {[
            { label: 'Raw Data Sources', icon: Server },
            { label: 'Feature Store', icon: Layers },
            { label: 'Model Training', icon: Database },
            { label: 'Production Serving', icon: ShieldCheck },
          ].map((step, i) => (
            <div className="catalog__lineage-step-wrap" key={step.label}>
              <div className="catalog__lineage-step">
                <step.icon size={18} />
                <span>{step.label}</span>
              </div>
              {i < 3 && <ArrowRight size={16} className="catalog__lineage-arrow" />}
            </div>
          ))}
        </div>
      </section>

      {/* Asset Catalog Grid */}
      <section className="catalog__section">
        <h2><Tag size={18} /> Asset Catalog ({assets.length})</h2>
        <div className="catalog__grid">
          {assets.map((asset) => (
            <motion.div
              key={asset.id}
              className="catalog__card"
              whileHover={{ y: -3 }}
              onClick={() => navigate(`/tool/${asset.id}`)}
            >
              <div className="catalog__card-header">
                <span
                  className="catalog__classification"
                  style={{ color: CLASSIFICATION_COLOR[asset.classification], background: `${CLASSIFICATION_COLOR[asset.classification]}18` }}
                >
                  <Lock size={10} /> {asset.classification}
                </span>
                <span className="catalog__quality">Quality {asset.qualityScore}%</span>
              </div>
              <h4>{asset.name}</h4>
              <p className="catalog__card-owner">Owner: {asset.vendor}</p>
              <div className="catalog__card-tags">
                {asset.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="catalog__card-tag">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Permissions Matrix */}
      <section className="catalog__section">
        <h2><FileCheck2 size={18} /> Permissions Matrix</h2>
        <p className="catalog__section-desc">Standard role-based access template applied to catalog assets.</p>
        <div className="catalog__table-wrap">
          <table className="catalog__table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Read</th>
                <th>Write</th>
                <th>Deploy</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {PERMISSION_ROWS.map((row) => (
                <tr key={row.role}>
                  <td className="catalog__table-role">{row.role}</td>
                  <td>{row.read ? <ShieldCheck size={14} className="catalog__perm-yes" /> : '—'}</td>
                  <td>{row.write ? <ShieldCheck size={14} className="catalog__perm-yes" /> : '—'}</td>
                  <td>{row.deploy ? <ShieldCheck size={14} className="catalog__perm-yes" /> : '—'}</td>
                  <td>{row.delete ? <ShieldCheck size={14} className="catalog__perm-yes" /> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Catalog;
