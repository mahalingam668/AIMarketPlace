import { useParams, useNavigate } from 'react-router-dom';
import * as Accordion from '@radix-ui/react-accordion';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Star, ChevronDown, HelpCircle, SearchX } from 'lucide-react';
import { useGig } from '../hooks/useGig';
import { useRelatedGigs } from '../hooks/useRelatedGigs';
import { getVendorProfileById } from '../../../data/vendorProfiles';
import { resolveIcon } from '../components/iconMap';
import { useAppSelector } from '../../../store';
import { savePendingGigSelection } from '../utils/pendingGigSelection';
import type { GigPackage } from '../types/gig.types';
import GigGallery from '../components/GigGallery';
import PackageTable from '../components/PackageTable';
import ReviewList from '../components/ReviewList';
import SellerCard from '../components/SellerCard';
import GigCard from '../components/GigCard';
import './GigDetailsPage.css';

function GigDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: gig, isLoading } = useGig(id);
  const { data: relatedGigs } = useRelatedGigs(gig);
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  if (isLoading) {
    return <div className="gig-details__loading" aria-busy="true" />;
  }

  if (!gig) {
    return (
      <div className="gig-details__empty">
        <SearchX size={28} />
        <h2>Gig not found</h2>
        <p>The gig you're looking for doesn't exist or has been removed.</p>
        <button type="button" className="gig-details__empty-btn" onClick={() => navigate('/categories')}>
          Back to Marketplace
        </button>
      </div>
    );
  }

  // Implements the visitor decision point (blueprint §2.2 step 5): a guest
  // selecting a package is prompted to sign up as a company, with their
  // intent preserved across the redirect (see pendingGigSelection.ts).
  const handleSelectPackage = (pkg: GigPackage) => {
    if (!isAuthenticated || !user) {
      savePendingGigSelection({ gigId: gig.id, gigName: gig.name, tier: pkg.tier });
      navigate('/register', { state: { role: 'Company' } });
      return;
    }

    if (user.role === 'Developer') {
      toast.error('Sign in as a company to order services.');
      return;
    }

    // Real order placement/escrow isn't built yet — this is intentionally a
    // lightweight confirmation rather than a fabricated order record.
    toast.success(`${pkg.tier} package request sent to ${gig.company}. Full order tracking is coming soon.`);
  };

  const seller = getVendorProfileById(gig.sellerId);
  const HeroIcon = resolveIcon(gig.icon);

  return (
    <div className="gig-details">
      <button type="button" className="gig-details__back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="gig-details__hero" style={{ background: gig.gradient }}>
        {gig.badge && <span className="gig-details__badge">{gig.badge}</span>}
        <HeroIcon size={64} strokeWidth={1.25} className="gig-details__hero-icon" />
        <div className="gig-details__hero-text">
          <span className="gig-details__category">{gig.category}</span>
          <h1 className="gig-details__title">{gig.name}</h1>
          <p className="gig-details__company">by {gig.company}</p>
          <div className="gig-details__rating-row">
            <Star size={15} fill="#f59e0b" stroke="#f59e0b" />
            <strong>{gig.rating.toFixed(1)}</strong>
            <span>({gig.reviewCount.toLocaleString()} reviews)</span>
          </div>
        </div>
      </div>

      <div className="gig-details__layout">
        <div className="gig-details__main">
          <section className="gig-details__section">
            <h2>About This Gig</h2>
            <p className="gig-details__description">{gig.longDescription || gig.description}</p>
            <div className="gig-details__tags">
              {gig.tags.map((tag) => (
                <span key={tag} className="gig-details__tag">{tag}</span>
              ))}
            </div>
          </section>

          <section className="gig-details__section">
            <h2>Gallery</h2>
            <GigGallery icons={gig.galleryIcons} gradient={gig.gradient} />
          </section>

          <section className="gig-details__section">
            <h2>Packages</h2>
            <PackageTable packages={gig.packages} onSelect={handleSelectPackage} />
          </section>

          <section className="gig-details__section">
            <h2>Frequently Asked Questions</h2>
            <Accordion.Root type="single" collapsible className="gig-details__faq">
              {gig.faq.map((item, i) => (
                <Accordion.Item key={item.question} value={`faq-${i}`} className="gig-details__faq-item">
                  <Accordion.Header>
                    <Accordion.Trigger className="gig-details__faq-trigger">
                      <span><HelpCircle size={15} /> {item.question}</span>
                      <ChevronDown size={15} className="gig-details__faq-chevron" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="gig-details__faq-content">{item.answer}</Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </section>

          <section className="gig-details__section">
            <h2>Reviews</h2>
            <ReviewList reviews={gig.reviews} />
          </section>
        </div>

        <aside className="gig-details__sidebar">
          {seller && <SellerCard seller={seller} />}
        </aside>
      </div>

      {relatedGigs && relatedGigs.length > 0 && (
        <section className="gig-details__section gig-details__related">
          <h2>Related Gigs</h2>
          <div className="gig-details__related-grid">
            {relatedGigs.map((related) => (
              <GigCard key={related.id} tool={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default GigDetailsPage;
