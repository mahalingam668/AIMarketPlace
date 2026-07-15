interface StatusPillProps {
  status: string;
}

/** Renders any gig/proposal/order status string as a themed pill — relies on
 * `.fl-status-pill--<status>` existing in freelancer.css for known statuses,
 * falls back to the neutral/draft look for anything else. */
function StatusPill({ status }: StatusPillProps) {
  return <span className={`fl-status-pill fl-status-pill--${status}`}>{status}</span>;
}

export default StatusPill;
