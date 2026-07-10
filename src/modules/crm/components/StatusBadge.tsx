export type CrmStatusTone = 'success' | 'warning' | 'error' | 'neutral' | 'info';

const STATUS_TONE_MAP: Record<string, CrmStatusTone> = {
  Active: 'success',
  Published: 'success',
  Draft: 'warning',
  Hidden: 'neutral',
  Deprecated: 'error',
  Archived: 'error',
};

interface StatusBadgeProps {
  status: string;
  tone?: CrmStatusTone;
}

function StatusBadge({ status, tone }: StatusBadgeProps) {
  const resolvedTone = tone ?? STATUS_TONE_MAP[status] ?? 'neutral';
  return <span className={`crm-status-badge crm-status-badge--${resolvedTone}`}>{status}</span>;
}

export default StatusBadge;
