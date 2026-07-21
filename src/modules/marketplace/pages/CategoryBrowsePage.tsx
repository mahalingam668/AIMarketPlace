import { useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { aiTools } from '../../../data/mockData';
import { getToolsForCategory, toolMatchesSubCategory } from '../data/categories';
import { useAppSelector } from '../../../store';
import GigCard from '../components/GigCard';
import './CategoryBrowsePage.css';

function CategoryBrowsePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  // The active sub-category filter lives entirely in the URL (?sub=...)
  // rather than local component state — that's what lets a link elsewhere
  // in the app (e.g. the mega menu) deep-link straight into a specific
  // sub-category instead of only ever landing on the unfiltered parent
  // category page, and it comes for free with correct behavior when the
  // category itself changes (a fresh URL has no stale sub-filter to reset).
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useAppSelector((s) => s.categories.categories);
  const category = slug ? categories.find((c) => c.slug === slug) : undefined;

  const categoryTools = useMemo(() => (category ? getToolsForCategory(aiTools, category.name) : []), [category]);

  const activeSubSlug = searchParams.get('sub');
  const activeSubCategory = category?.subCategories.find((s) => s.slug === activeSubSlug) ?? null;

  const visibleTools = useMemo(() => {
    if (!activeSubCategory) return categoryTools;
    return categoryTools.filter((tool) => toolMatchesSubCategory(tool, activeSubCategory.name));
  }, [categoryTools, activeSubCategory]);

  const selectSubCategory = (subSlug: string | null) => {
    setSearchParams(subSlug ? { sub: subSlug } : {}, { replace: true });
  };

  if (!category) {
    return (
      <div className="category-browse__empty">
        <SearchX size={28} />
        <h2>Category not found</h2>
        <p>This category doesn't exist. Browse all categories instead.</p>
        <button type="button" className="category-browse__empty-btn" onClick={() => navigate('/categories')}>
          Browse Categories
        </button>
      </div>
    );
  }

  return (
    <div className="category-browse">
      <div className="category-browse__header">
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </div>

      <div className="category-browse__sub-chips">
        <button
          type="button"
          className={`category-browse__chip ${!activeSubCategory ? 'category-browse__chip--active' : ''}`}
          onClick={() => selectSubCategory(null)}
        >
          All {category.name}
        </button>
        {category.subCategories.map((sub) => (
          <button
            key={sub.slug}
            type="button"
            className={`category-browse__chip ${activeSubCategory?.slug === sub.slug ? 'category-browse__chip--active' : ''}`}
            onClick={() => selectSubCategory(sub.slug)}
          >
            {sub.name}
          </button>
        ))}
      </div>

      <p className="category-browse__count">{visibleTools.length} {visibleTools.length === 1 ? 'gig' : 'gigs'} available</p>

      {visibleTools.length > 0 ? (
        <div className="category-browse__grid">
          {visibleTools.map((tool) => (
            <GigCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="category-browse__empty">
          <SearchX size={28} />
          <h2>No gigs match this sub-category yet</h2>
          <p>Check back soon, or browse all of {category.name}.</p>
          <button type="button" className="category-browse__empty-btn" onClick={() => selectSubCategory(null)}>
            Show all {category.name}
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryBrowsePage;
