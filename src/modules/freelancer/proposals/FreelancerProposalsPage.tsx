import { useMemo, useState } from 'react';
import { Send, Calendar, DollarSign, Clock } from 'lucide-react';
import { useAppSelector } from '../../../store';
import type { ProposalStatus } from '../../../store/slices/freelancerSlice';
import StatusPill from '../components/StatusPill';

const TABS: { id: 'all' | ProposalStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'declined', label: 'Declined' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function FreelancerProposalsPage() {
  const proposals = useAppSelector((s) => s.freelancer.proposals);
  const [activeTab, setActiveTab] = useState<'all' | ProposalStatus>('all');

  const filteredProposals = useMemo(
    () => (activeTab === 'all' ? proposals : proposals.filter((p) => p.status === activeTab)),
    [proposals, activeTab]
  );

  return (
    <div>
      <div className="fl-header">
        <div>
          <h1 className="fl-header__title">Proposals</h1>
          <p className="fl-header__subtitle">Track every proposal you've submitted to open jobs.</p>
        </div>
      </div>

      <div className="fl-tabs" role="tablist" aria-label="Filter proposals by status">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`fl-tab ${activeTab === tab.id ? 'fl-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredProposals.length === 0 ? (
        <div className="fl-section">
          <div className="fl-empty">
            <div className="fl-empty__icon"><Send size={20} /></div>
            <h4>No proposals here yet</h4>
            <p>Proposals you submit to open jobs will show up in this list.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredProposals.map((proposal) => (
            <div className="fl-section" key={proposal.id}>
              <div className="fl-section__header">
                <div>
                  <h3 className="fl-section__title">{proposal.jobTitle}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{proposal.clientName}</p>
                </div>
                <StatusPill status={proposal.status} />
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 14px 0' }}>
                {proposal.coverLetterExcerpt}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 12, color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <DollarSign size={12} /> ${proposal.bidAmount.toLocaleString()} bid
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={12} /> {proposal.deliveryDays}-day delivery
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Calendar size={12} /> Submitted {formatDate(proposal.submittedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FreelancerProposalsPage;
