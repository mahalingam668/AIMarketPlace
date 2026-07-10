import type { CrmPageConfig } from '../data/pages.mock';
import { resolveCrmIcon } from './crmIcons';

function PageBanner({ config }: { config: CrmPageConfig }) {
  const Icon = resolveCrmIcon(config.icon);
  return (
    <div className="crm-page-banner" style={{ background: config.banner }}>
      <Icon size={28} className="crm-page-banner__icon" aria-hidden="true" />
    </div>
  );
}

export default PageBanner;
