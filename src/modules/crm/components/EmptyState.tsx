import { Inbox } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

function EmptyState({ icon: Icon = Inbox, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="crm-empty-state">
      <div className="crm-empty-state__icon">
        <Icon size={26} />
      </div>
      <h3 className="crm-empty-state__title">{title}</h3>
      {message && <p className="crm-empty-state__message">{message}</p>}
      {actionLabel && onAction && (
        <button type="button" className="crm-btn crm-btn--primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
