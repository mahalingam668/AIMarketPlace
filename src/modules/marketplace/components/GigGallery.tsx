import { resolveIcon } from './iconMap';
import './GigGallery.css';

interface GigGalleryProps {
  icons: string[];
  gradient: string;
}

/**
 * Decorative icon-based gallery — this app deliberately never hotlinks or
 * invents external image URLs, so the "gallery" is a set of large icon
 * tiles on the gig's own gradient rather than stock photography.
 */
function GigGallery({ icons, gradient }: GigGalleryProps) {
  return (
    <div className="gig-gallery">
      {icons.map((iconName, i) => {
        const Icon = resolveIcon(iconName);
        return (
          <div key={`${iconName}-${i}`} className="gig-gallery__tile" style={{ background: gradient }}>
            <Icon size={48} strokeWidth={1.25} className="gig-gallery__icon" />
          </div>
        );
      })}
    </div>
  );
}

export default GigGallery;
