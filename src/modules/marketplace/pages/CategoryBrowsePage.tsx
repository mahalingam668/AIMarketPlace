import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { aiTools } from '../../../data/mockData';
import { getToolsForCategory, toolMatchesSubCategory } from '../data/categories';
import { useAppSelector } from '../../../store';
import GigCard from '../components/GigCard';
import './CategoryBrowsePage.css';

function CategoryBrowsePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeSubSlug, setActiveSubSlug] = useState<string | null>(null);
  const categories = useAppSelector((s) => s.categories.categories);
  const category = slug ? categories.find((c) => c.slug === slug) : undefined;

  const categoryTools = useMemo(() => (category ? getToolsForCategory(aiTools, category.name) : []), [category]);

  const activeSubCategory = category?.subCategories.find((s) => s.slug === activeSubSlug) ?? null;

  const visibleTools = useMemo(() => {
    if (!activeSubCategory) return categoryTools;
    return categoryTools.filter((tool) => toolMatchesSubCategory(tool, activeSubCategory.name));
  }, [categoryTools, activeSubCategory]);

  // Reset the sub-category filter whenever the category itself changes, so
  // navigating between categories doesn't carry over a stale selection.
  useEffect(() => {
    setActiveSubSlug(null);
  }, [slug]);

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
          onClick={() => setActiveSubSlug(null)}
        >
          All {category.name}
        </button>
        {category.subCategories.map((sub) => (
          <button
            key={sub.slug}
            type="button"
            className={`category-browse__chip ${activeSubCategory?.slug === sub.slug ? 'category-browse__chip--active' : ''}`}
            onClick={() => setActiveSubSlug(sub.slug)}
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
          <button type="button" className="category-browse__empty-btn" onClick={() => setActiveSubSlug(null)}>
            Show all {category.name}
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryBrowsePage;
