import { useMemo, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from 'recharts';
import { Scale, Check, X, Printer, Star } from 'lucide-react';
import { aiTools } from '../../data/mockData';
import type { AITool } from '../../types';
import './Compare.css';

const QUADRANT_COLORS = ['#0f6cbd', '#0891b2', '#16a34a', '#d97706'];

function getQuadrantPoint(tool: AITool) {
  const vision = Math.min(100, Math.round((tool.activeUsers / 1300)));
  const execution = Math.round(tool.rating * 20);
  return { vision, execution };
}

function getRadarMetrics(tool: AITool) {
  return [
    { metric: 'Reliability', value: Math.round(tool.rating * 20) },
    { metric: 'Uptime', value: Math.round(tool.uptime) },
    { metric: 'Adoption', value: Math.min(100, Math.round(tool.activeUsers / 1300)) },
    { metric: 'Reviews', value: Math.min(100, Math.round(tool.reviewCount / 150)) },
    { metric: 'Value', value: tool.pricing.some((p) => p.price === 0) ? 85 : 60 },
  ];
}

function Compare() {
  const [shortlist, setShortlist] = useState<string[]>(() => aiTools.filter((t) => t.featured).slice(0, 3).map((t) => t.id));

  const selectedTools = useMemo(() => aiTools.filter((t) => shortlist.includes(t.id)), [shortlist]);

  const toggleShortlist = (id: string) => {
    setShortlist((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const allFeatures = useMemo(() => {
    const set = new Set<string>();
    selectedTools.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).slice(0, 8);
  }, [selectedTools]);

  const radarData = useMemo(() => {
    const metrics = ['Reliability', 'Uptime', 'Adoption', 'Reviews', 'Value'];
    return metrics.map((metric) => {
      const row: Record<string, number | string> = { metric };
      selectedTools.forEach((tool) => {
        const found = getRadarMetrics(tool).find((m) => m.metric === metric);
        row[tool.name] = found?.value || 0;
      });
      return row;
    });
  }, [selectedTools]);

  return (
    <div className="compare">
      <div className="compare__header">
        <span className="compare__eyebrow"><Scale size={13} /> Compare Solutions</span>
        <h1>Comparison Center</h1>
        <p>An independent-style view across execution, vision, pricing, and governance depth to help you shortlist confidently.</p>
        <button type="button" className="compare__export-btn" onClick={() => window.print()}>
          <Printer size={14} /> Export as PDF
        </button>
      </div>

      {/* Shortlist selector */}
      <section className="compare__section">
        <h2>Select up to 4 solutions to compare</h2>
        <div className="compare__shortlist-grid">
          {aiTools.map((tool) => (
            <label key={tool.id} className={`compare__shortlist-item ${shortlist.includes(tool.id) ? 'compare__shortlist-item--active' : ''}`}>
              <input
                type="checkbox"
                checked={shortlist.includes(tool.id)}
                onChange={() => toggleShortlist(tool.id)}
              />
              {tool.name}
            </label>
          ))}
        </div>
      </section>

      {/* Magic Quadrant */}
      <section className="compare__section">
        <h2>Magic Quadrant View</h2>
        <p className="compare__section-desc">Ability to Execute vs. Completeness of Vision, plotted across the full catalog.</p>
        <div className="compare__quadrant-chart">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid stroke="var(--border-subtle)" />
              <XAxis type="number" dataKey="vision" name="Completeness of Vision" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="number" dataKey="execution" name="Ability to Execute" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;
                  const p = payload[0].payload as { name: string };
                  return <div className="compare__tooltip">{p.name}</div>;
                }}
              />
              <Scatter
                data={aiTools.map((tool) => ({ ...getQuadrantPoint(tool), name: tool.name }))}
                fill="var(--brand-blue)"
              >
                {aiTools.map((tool, i) => (
                  <Cell key={tool.id} fill={shortlist.includes(tool.id) ? 'var(--brand-blue)' : QUADRANT_COLORS[i % QUADRANT_COLORS.length]} fillOpacity={shortlist.includes(tool.id) ? 1 : 0.35} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="compare__quadrant-labels">
          <span>Niche Players</span>
          <span>Challengers</span>
          <span>Visionaries</span>
          <span className="compare__quadrant-labels--leader">Leaders</span>
        </div>
      </section>

      {selectedTools.length > 0 && (
        <>
          {/* Feature matrix */}
          <section className="compare__section">
            <h2>Feature Comparison Matrix</h2>
            <div className="compare__table-wrap">
              <table className="compare__table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    {selectedTools.map((t) => <th key={t.id}>{t.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature) => (
                    <tr key={feature}>
                      <td className="compare__table-feature">{feature}</td>
                      {selectedTools.map((t) => (
                        <td key={t.id}>
                          {t.tags.includes(feature) ? <Check size={15} className="compare__yes" /> : <X size={15} className="compare__no" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pricing matrix */}
          <section className="compare__section">
            <h2>Pricing Matrix</h2>
            <div className="compare__pricing-grid">
              {selectedTools.map((t) => {
                const min = Math.min(...t.pricing.map((p) => p.price));
                const max = Math.max(...t.pricing.map((p) => p.price));
                return (
                  <div key={t.id} className="compare__pricing-card">
                    <h4>{t.name}</h4>
                    <p className="compare__pricing-range">{min === 0 ? 'Free' : `$${min}`} — ${max}/mo</p>
                    <ul>
                      {t.pricing.map((p) => (
                        <li key={p.name}>{p.name}: {p.price === 0 ? 'Free' : `$${p.price}/${p.period}`}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Radar chart */}
          <section className="compare__section">
            <h2>Ratings Radar</h2>
            <div className="compare__radar-chart">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border-subtle)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  {selectedTools.map((t, i) => (
                    <Radar
                      key={t.id}
                      name={t.name}
                      dataKey={t.name}
                      stroke={QUADRANT_COLORS[i % QUADRANT_COLORS.length]}
                      fill={QUADRANT_COLORS[i % QUADRANT_COLORS.length]}
                      fillOpacity={0.15}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Vendor pros/cons */}
          <section className="compare__section">
            <h2>Vendor Comparison</h2>
            <div className="compare__vendor-grid">
              {selectedTools.map((t) => {
                const isFree = t.pricing.some((p) => p.price === 0);
                return (
                  <div key={t.id} className="compare__vendor-card">
                    <div className="compare__vendor-header">
                      <h4>{t.name}</h4>
                      <span className="compare__vendor-rating"><Star size={12} fill="var(--warning)" stroke="var(--warning)" /> {t.rating.toFixed(1)}</span>
                    </div>
                    <p className="compare__vendor-vendor">{t.vendor}</p>
                    <div className="compare__vendor-pros-cons">
                      <div>
                        <span className="compare__pros-label">Pros</span>
                        <ul>
                          {t.tags.slice(0, 2).map((tag) => <li key={tag}>{tag}</li>)}
                          <li>{t.uptime}% uptime SLA</li>
                        </ul>
                      </div>
                      <div>
                        <span className="compare__cons-label">Cons</span>
                        <ul>
                          <li>{isFree ? 'Free tier is rate-limited' : 'No free tier available'}</li>
                          <li>{t.integrations.length < 4 ? 'Limited integration catalog' : 'Steeper onboarding for full integration suite'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Compare;
