import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, X, Layers } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../store';
import { addSubCategory, renameSubCategory, retireSubCategory } from '../../../store/slices/categoriesSlice';
import { resolveIcon } from '../../marketplace/components/iconMap';

/**
 * Blueprint §5.4 — add/rename/retire sub-categories without a code deploy.
 * Backed by categoriesSlice, which CategoriesIndexPage / CategoryBrowsePage
 * already read from, so changes made here show up on the public marketplace
 * immediately instead of living in an admin-only mock.
 */
function CategoryManagerPage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.categories.categories);
  const [draftBySlug, setDraftBySlug] = useState<Record<string, string>>({});
  const [editingSub, setEditingSub] = useState<{ categorySlug: string; subSlug: string; value: string } | null>(null);

  const handleAddSub = (categorySlug: string) => {
    const name = (draftBySlug[categorySlug] ?? '').trim();
    if (!name) {
      toast.error('Enter a sub-category name first.');
      return;
    }
    dispatch(addSubCategory({ categorySlug, name }));
    setDraftBySlug((prev) => ({ ...prev, [categorySlug]: '' }));
    toast.success(`"${name}" added.`);
  };

  const handleRetire = (categorySlug: string, subSlug: string, name: string) => {
    dispatch(retireSubCategory({ categorySlug, subSlug }));
    toast.success(`"${name}" retired.`);
  };

  const commitRename = () => {
    if (!editingSub) return;
    const value = editingSub.value.trim();
    if (!value) {
      toast.error('Sub-category name cannot be empty.');
      return;
    }
    dispatch(renameSubCategory({ categorySlug: editingSub.categorySlug, subSlug: editingSub.subSlug, name: value }));
    setEditingSub(null);
    toast.success('Sub-category renamed.');
  };

  return (
    <div>
      <div className="adm-header">
        <div>
          <h1 className="adm-header__title">Category & Taxonomy Manager</h1>
          <p className="adm-header__subtitle">Add, rename, or retire AI Services sub-categories — changes apply to the live marketplace immediately.</p>
        </div>
      </div>

      <div className="adm-category-list">
        {categories.map((category) => {
          const Icon = resolveIcon(category.icon);
          return (
            <div key={category.slug} className="adm-section adm-category-card">
              <div className="adm-category-card__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={18} />
                  <div>
                    <div className="adm-category-card__name">{category.name}</div>
                    <p className="adm-category-card__desc">{category.description}</p>
                  </div>
                </div>
                <span className="adm-badge adm-badge--neutral">{category.subCategories.length} sub-categories</span>
              </div>

              <div className="adm-sub-list">
                {category.subCategories.length === 0 && (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No sub-categories yet.</span>
                )}
                {category.subCategories.map((sub) => {
                  const isEditing = editingSub?.categorySlug === category.slug && editingSub.subSlug === sub.slug;
                  return isEditing ? (
                    <span key={sub.slug} className="adm-chip">
                      <input
                        autoFocus
                        value={editingSub.value}
                        onChange={(e) => setEditingSub({ ...editingSub, value: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitRename();
                          if (e.key === 'Escape') setEditingSub(null);
                        }}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontSize: 12,
                          color: 'var(--text-primary)',
                          width: Math.max(60, editingSub.value.length * 7),
                        }}
                      />
                      <button type="button" onClick={commitRename} aria-label="Save" title="Save">
                        <Plus size={12} style={{ transform: 'rotate(45deg)' }} />
                      </button>
                    </span>
                  ) : (
                    <span
                      key={sub.slug}
                      className="adm-chip"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setEditingSub({ categorySlug: category.slug, subSlug: sub.slug, value: sub.name })}
                      title="Click to rename"
                    >
                      {sub.name}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetire(category.slug, sub.slug, sub.name);
                        }}
                        aria-label={`Retire ${sub.name}`}
                        title="Retire"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>

              <div className="adm-inline-form">
                <div className="adm-form-field">
                  <label htmlFor={`new-sub-${category.slug}`}>New sub-category</label>
                  <input
                    id={`new-sub-${category.slug}`}
                    type="text"
                    placeholder="e.g. AI voice cloning"
                    value={draftBySlug[category.slug] ?? ''}
                    onChange={(e) => setDraftBySlug((prev) => ({ ...prev, [category.slug]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSub(category.slug);
                    }}
                  />
                </div>
                <button type="button" className="adm-btn adm-btn--primary" onClick={() => handleAddSub(category.slug)}>
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="adm-empty">
          <div className="adm-empty__icon"><Layers size={20} /></div>
          <h4>No categories configured</h4>
        </div>
      )}
    </div>
  );
}

export default CategoryManagerPage;
