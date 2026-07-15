import { Check, Clock, RotateCcw } from 'lucide-react';
import type { GigPackage } from '../types/gig.types';
import './PackageTable.css';

interface PackageTableProps {
  packages: GigPackage[];
  onSelect?: (pkg: GigPackage) => void;
}

function PackageTable({ packages, onSelect }: PackageTableProps) {
  return (
    <div className="package-table">
      {packages.map((pkg) => (
        <div key={pkg.tier} className={`package-table__card ${pkg.tier === 'Standard' ? 'package-table__card--highlight' : ''}`}>
          {pkg.tier === 'Standard' && <span className="package-table__popular">Most Popular</span>}
          <span className="package-table__tier">{pkg.tier}</span>
          <h4 className="package-table__name">{pkg.name}</h4>
          <div className="package-table__price">
            {pkg.price === 0 ? 'Free' : `$${pkg.price}`}
            {pkg.price > 0 && <span>/mo</span>}
          </div>

          <div className="package-table__meta">
            <span><Clock size={13} /> {pkg.deliveryDays}-day delivery</span>
            <span><RotateCcw size={13} /> {pkg.revisions}</span>
          </div>

          <ul className="package-table__features">
            {pkg.features.map((feature) => (
              <li key={feature}>
                <Check size={14} className="package-table__check" /> {feature}
              </li>
            ))}
          </ul>

          <button type="button" className="package-table__cta" onClick={() => onSelect?.(pkg)}>
            Select {pkg.tier}
          </button>
        </div>
      ))}
    </div>
  );
}

export default PackageTable;
