import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useVisibleCrmMenu } from '../../../hooks/useVisibleCrmMenu';

interface BreadcrumbTrailItem {
  label: string;
  path: string;
}

function Breadcrumb({ current }: { current?: string }) {
  const location = useLocation();
  const menuGroups = useVisibleCrmMenu();

  const trail = useMemo<BreadcrumbTrailItem[]>(() => {
    const items: BreadcrumbTrailItem[] = [];
    for (const group of menuGroups) {
      const matchedChild = [...group.children]
        .sort((a, b) => b.path.length - a.path.length)
        .find((child) => location.pathname.startsWith(child.path));
      if (matchedChild) {
        items.push({ label: group.name, path: group.path });
        items.push({ label: matchedChild.name, path: matchedChild.path });
        break;
      }
    }
    return items;
  }, [menuGroups, location.pathname]);

  if (trail.length === 0 && !current) return null;

  return (
    <nav className="crm-breadcrumb" aria-label="Breadcrumb">
      {trail.map((item, i) => {
        const isLast = i === trail.length - 1 && !current;
        return (
          <span key={item.path} className="crm-breadcrumb__segment">
            {isLast ? (
              <span className="crm-breadcrumb__current">{item.label}</span>
            ) : (
              <Link to={item.path} className="crm-breadcrumb__link">{item.label}</Link>
            )}
            {!isLast && <ChevronRight size={13} className="crm-breadcrumb__sep" />}
          </span>
        );
      })}
      {current && <span className="crm-breadcrumb__current">{current}</span>}
    </nav>
  );
}

export default Breadcrumb;
