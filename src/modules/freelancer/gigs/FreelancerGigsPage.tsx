import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Plus, Pencil, Trash2, Play, Pause, X, Eye, MousePointerClick, Package } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../store';
import {
  addGig,
  updateGig,
  updateGigStatus,
  deleteGig,
  buildGigPackages,
  type FreelancerGig,
  type GigStatus,
} from '../../../store/slices/freelancerSlice';
import type { PackageTier } from '../../../modules/marketplace/types/gig.types';
import StatusPill from '../components/StatusPill';

const EMPTY_DRAFT = {
  title: '',
  category: '',
  status: 'draft' as GigStatus,
  priceBasic: 60,
  priceStandard: 100,
  pricePremium: 160,
};

function tierPrice(gig: FreelancerGig, tier: PackageTier): number {
  return gig.packages.find((p) => p.tier === tier)?.price ?? 0;
}

function FreelancerGigsPage() {
  const dispatch = useAppDispatch();
  const gigs = useAppSelector((s) => s.freelancer.gigs);
  const [search, setSearch] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [drawerGig, setDrawerGig] = useState<FreelancerGig | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const filteredGigs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return gigs;
    return gigs.filter((g) => g.title.toLowerCase().includes(query) || g.category.toLowerCase().includes(query));
  }, [gigs, search]);

  const openCreateDrawer = () => {
    setDrawerGig(null);
    setDraft(EMPTY_DRAFT);
    setShowDrawer(true);
  };

  const openEditDrawer = (gig: FreelancerGig) => {
    setDrawerGig(gig);
    setDraft({
      title: gig.title,
      category: gig.category,
      status: gig.status,
      priceBasic: tierPrice(gig, 'Basic'),
      priceStandard: tierPrice(gig, 'Standard'),
      pricePremium: tierPrice(gig, 'Premium'),
    });
    setShowDrawer(true);
  };

  const closeDrawer = () => setShowDrawer(false);

  const handleSaveDraft = () => {
    if (!draft.title.trim() || !draft.category.trim()) {
      toast.error('Title and category are required.');
      return;
    }
    if (draft.priceBasic <= 0 || draft.priceStandard <= 0 || draft.pricePremium <= 0) {
      toast.error('Every package needs a price greater than $0.');
      return;
    }
    const packages = buildGigPackages(draft.category, {
      Basic: draft.priceBasic,
      Standard: draft.priceStandard,
      Premium: draft.pricePremium,
    });
    if (drawerGig) {
      dispatch(updateGig({ ...drawerGig, title: draft.title, category: draft.category, status: draft.status, packages }));
      toast.success('Gig updated.');
    } else {
      dispatch(
        addGig({
          id: `gig-${Date.now()}`,
          title: draft.title,
          category: draft.category,
          status: draft.status,
          packages,
          impressions: 0,
          clicks: 0,
          orders: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        })
      );
      toast.success('Gig created.');
    }
    setShowDrawer(false);
  };

  const toggleGigStatus = (gig: FreelancerGig) => {
    const next: GigStatus = gig.status === 'active' ? 'paused' : 'active';
    dispatch(updateGigStatus({ id: gig.id, status: next }));
  };

  const confirmDelete = (id: string) => {
    dispatch(deleteGig(id));
    toast.success('Gig deleted.');
    setPendingDeleteId(null);
  };

  return (
    <div>
      <div className="fl-header">
        <div>
          <h1 className="fl-header__title">Gig Management</h1>
          <p className="fl-header__subtitle">Create, edit, and track performance for your published services.</p>
        </div>
        <div className="fl-header__actions">
          <button type="button" className="fl-btn fl-btn--primary" onClick={openCreateDrawer}>
            <Plus size={14} /> New Gig
          </button>
        </div>
      </div>

      <div className="fl-section">
        <div className="fl-section__header">
          <div className="fl-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search your gigs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filteredGigs.length === 0 ? (
          <div className="fl-empty">
            <div className="fl-empty__icon"><Package size={20} /></div>
            <h4>No gigs found</h4>
            <p>Try a different search, or create your first gig.</p>
          </div>
        ) : (
          <div className="fl-table-wrap">
            <table className="fl-table">
              <thead>
                <tr>
                  <th>Gig</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>Orders</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGigs.map((gig) => (
                  <tr key={gig.id}>
                    <td>
                      <div className="fl-table__title-cell">
                        <strong>{gig.title}</strong>
                        <span>{gig.category}</span>
                      </div>
                    </td>
                    <td><StatusPill status={gig.status} /></td>
                    <td>From ${tierPrice(gig, 'Basic')}</td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Eye size={12} /> {gig.impressions.toLocaleString()}</span></td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MousePointerClick size={12} /> {gig.clicks.toLocaleString()}</span></td>
                    <td>{gig.orders}</td>
                    <td>
                      {pendingDeleteId === gig.id ? (
                        <div className="fl-table__actions">
                          <button type="button" className="fl-btn fl-btn--danger" onClick={() => confirmDelete(gig.id)}>Confirm</button>
                          <button type="button" className="fl-btn" onClick={() => setPendingDeleteId(null)}>Cancel</button>
                        </div>
                      ) : (
                        <div className="fl-table__actions">
                          {gig.status !== 'draft' && (
                            <button
                              type="button"
                              className="fl-btn fl-btn--icon"
                              onClick={() => toggleGigStatus(gig)}
                              aria-label={gig.status === 'active' ? 'Pause gig' : 'Activate gig'}
                              title={gig.status === 'active' ? 'Pause gig' : 'Activate gig'}
                            >
                              {gig.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                            </button>
                          )}
                          <button type="button" className="fl-btn fl-btn--icon" onClick={() => openEditDrawer(gig)} aria-label="Edit gig" title="Edit gig">
                            <Pencil size={14} />
                          </button>
                          <button type="button" className="fl-btn fl-btn--icon fl-btn--danger" onClick={() => setPendingDeleteId(gig.id)} aria-label="Delete gig" title="Delete gig">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDrawer && (
        <div className="fl-drawer-overlay" onClick={closeDrawer}>
          <div className="fl-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="fl-drawer__header">
              <h3>{drawerGig ? 'Edit Gig' : 'New Gig'}</h3>
              <button type="button" className="fl-drawer__close" onClick={closeDrawer} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="fl-form-field">
              <label htmlFor="gig-title">Gig Title</label>
              <input
                id="gig-title"
                type="text"
                placeholder="I will..."
                value={draft.title}
                onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="fl-form-field">
              <label htmlFor="gig-category">Category</label>
              <input
                id="gig-category"
                type="text"
                value={draft.category}
                onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
              />
            </div>

            <div className="fl-form-field">
              <label htmlFor="gig-price-basic">Basic package price (USD)</label>
              <input
                id="gig-price-basic"
                type="number"
                min={5}
                value={draft.priceBasic}
                onChange={(e) => setDraft((prev) => ({ ...prev, priceBasic: Number(e.target.value) }))}
              />
            </div>

            <div className="fl-form-field">
              <label htmlFor="gig-price-standard">Standard package price (USD)</label>
              <input
                id="gig-price-standard"
                type="number"
                min={5}
                value={draft.priceStandard}
                onChange={(e) => setDraft((prev) => ({ ...prev, priceStandard: Number(e.target.value) }))}
              />
            </div>

            <div className="fl-form-field">
              <label htmlFor="gig-price-premium">Premium package price (USD)</label>
              <input
                id="gig-price-premium"
                type="number"
                min={5}
                value={draft.pricePremium}
                onChange={(e) => setDraft((prev) => ({ ...prev, pricePremium: Number(e.target.value) }))}
              />
            </div>

            <div className="fl-form-field">
              <label htmlFor="gig-status">Status</label>
              <select
                id="gig-status"
                value={draft.status}
                onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as GigStatus }))}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                }}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            <div className="fl-form-actions">
              <button type="button" className="fl-btn fl-btn--primary" onClick={handleSaveDraft}>
                {drawerGig ? 'Save Changes' : 'Create Gig'}
              </button>
              <button type="button" className="fl-btn" onClick={closeDrawer}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreelancerGigsPage;
