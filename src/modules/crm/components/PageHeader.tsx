import type { ReactNode } from 'react';
import { usePageConfig } from '../../../hooks/usePageConfig';
import { resolveCrmIcon } from './crmIcons';
import Breadcrumb from './Breadcrumb';
import PageBanner from './PageBanner';

interface PageHeaderProps {
  pageKey: string;
  actions?: ReactNode;
  showBanner?: boolean;
}

/**
 * Reads title/subtitle/icon/colors for `pageKey` from PageConfigurationContext.
 * Editing that page's row on the Pages screen updates this header everywhere
 * it's rendered — nothing here is hardcoded per-page.
 */
function PageHeader({ pageKey, actions, showBanner = true }: PageHeaderProps) {
  const config = usePageConfig(pageKey);
  const Icon = resolveCrmIcon(config.icon);

  return (
    <div className="crm-page-header">
      <Breadcrumb />
      {showBanner && <PageBanner config={config} />}
      <div className="crm-page-header__row">
        <div className="crm-page-header__heading">
          <span className="crm-page-header__icon" aria-hidden="true">
            <Icon size={22} />
          </span>
          <div>
            <h1 className="crm-page-header__title" style={{ color: config.titleColor }}>{config.title}</h1>
            {config.subtitle && <p className="crm-page-header__subtitle" style={{ color: config.textColor }}>{config.subtitle}</p>}
          </div>
        </div>
        {actions && <div className="crm-page-header__actions">{actions}</div>}
      </div>
      {config.description && <p className="crm-page-header__description">{config.description}</p>}
    </div>
  );
}

export default PageHeader;
