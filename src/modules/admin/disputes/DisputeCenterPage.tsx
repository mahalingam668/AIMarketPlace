import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ChevronDown, ChevronUp, Scale, Gavel } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { resolveDispute, type Dispute } from '../../../store/slices/adminSlice';

/**
 * Blueprint §5.5 — dispute resolution center. Escalated company/developer
 * conflicts land here; admins review the case and issue a binding decision:
 * full refund, partial refund + partial payout, or full payout to the
 * developer. There's no live Order/chat system yet, so cases are realistic
 * seeded mock data rather than pulled from a real order — the resolution
 * actions themselves are real and mutate adminSlice state.
 *
 */

type Resolution = NonNullable<Dispute['resolution']>;

const RESOLUTION_LABEL: Record<Resolution, string> = {
  full_refund: 'Full refund',
  partial_refund: 'Partial refund',
  release_to_developer: 'Release to developer',
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function DisputeCenterPage() {
  const dispatch = useAppDispatch();
  const disputes = useAppSelector((s) => s.admin.disputes);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingResolution, setPendingResolution] = useState<{ id: string; resolution: Resolution } | null>(null);

  const sortedDisputes = useMemo(() => {
    return [...disputes].sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === 'open' ? -1 : 1;
    });
  }, [disputes]);

  const openCount = disputes.filter((d) => d.status === 'open').length;

  const toggleExpand = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
    setPendingResolution(null);
  };

  const startResolution = (id: string, resolution: Resolution) => {
    setPendingResolution({ id, resolution });
  };

  const cancelResolution = () => setPendingResolution(null);

  const confirmResolution = (id: string) => {
    if (!pendingResolution || pendingResolution.id !== id) return;
    dispatch(resolveDispute({ id, resolution: pendingResolution.resolution, resolvedAt: todayISO() }));
    toast.success(`Dispute resolved: ${RESOLUTION_LABEL[pendingResolution.resolution]}`);
    setPendingResolution(null);
  };

  return (
    <div>
      <div className="adm-header">
        <div>
          <h1 className="adm-header__title">Dispute Resolution Center</h1>
          <p className="adm-header__subtitle">
            {openCount} open {openCount === 1 ? 'case' : 'cases'} awaiting a binding decision. Review the brief, delivered work, and chat history, then resolve.
          </p>
        </div>
      </div>

      {sortedDisputes.length === 0 ? (
        <div className="adm-section">
          <div className="adm-empty">
            <div className="adm-empty__icon"><Scale size={20} /></div>
            <h4>No disputes on record</h4>
          </div>
        </div>
      ) : (
        <div className="adm-category-list">
          {sortedDisputes.map((dispute) => {
            const isOpen = dispute.status === 'open';
            const isExpanded = expandedId === dispute.id;
            const isPendingHere = pendingResolution?.id === dispute.id;

            return (
              <div key={dispute.id} className="adm-section adm-category-card">
                <div
                  className="adm-category-card__header"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleExpand(dispute.id)}
                >
                  <div>
                    <div className="adm-category-card__name">
                      {dispute.orderRef} &middot; {dispute.companyName} vs. {dispute.developerName}
                    </div>
                    <p className="adm-category-card__desc">{dispute.reason}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                      ${dispute.amount.toLocaleString()}
                    </span>
                    <span className={`adm-badge ${isOpen ? 'adm-badge--warning' : 'adm-badge--success'}`}>
                      {isOpen ? 'Open' : 'Resolved'}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 14, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>Order ref: <strong style={{ color: 'var(--text-secondary)' }}>{dispute.orderRef}</strong></span>
                      <span>Company: <strong style={{ color: 'var(--text-secondary)' }}>{dispute.companyName}</strong></span>
                      <span>Developer: <strong style={{ color: 'var(--text-secondary)' }}>{dispute.developerName}</strong></span>
                      <span>Amount in dispute: <strong style={{ color: 'var(--text-secondary)' }}>${dispute.amount.toLocaleString()}</strong></span>
                      <span>Opened: <strong style={{ color: 'var(--text-secondary)' }}>{dispute.openedAt}</strong></span>
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                      <strong>Reported issue:</strong> {dispute.reason}
                    </p>

                    {dispute.status === 'resolved' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                        <Gavel size={14} />
                        <span>
                          Resolved &mdash; <strong>{RESOLUTION_LABEL[dispute.resolution as Resolution]}</strong>
                          {dispute.resolvedAt && <> on {dispute.resolvedAt}</>}
                        </span>
                      </div>
                    ) : isPendingHere ? (
                      <div className="adm-table__actions" style={{ alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          Confirm decision: <strong>{RESOLUTION_LABEL[pendingResolution.resolution]}</strong>?
                        </span>
                        <button type="button" className="adm-btn adm-btn--primary" onClick={() => confirmResolution(dispute.id)}>
                          Confirm
                        </button>
                        <button type="button" className="adm-btn" onClick={cancelResolution}>Cancel</button>
                      </div>
                    ) : (
                      <div className="adm-table__actions">
                        <button
                          type="button"
                          className="adm-btn adm-btn--danger"
                          onClick={() => startResolution(dispute.id, 'full_refund')}
                        >
                          Full refund
                        </button>
                        <button
                          type="button"
                          className="adm-btn"
                          onClick={() => startResolution(dispute.id, 'partial_refund')}
                        >
                          Partial refund
                        </button>
                        <button
                          type="button"
                          className="adm-btn adm-btn--primary"
                          onClick={() => startResolution(dispute.id, 'release_to_developer')}
                        >
                          Release to developer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DisputeCenterPage;
