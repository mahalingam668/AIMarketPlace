import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { resetFilters, toggleCategory } from '../../../store/slices/toolsSlice';
import { getCategoryBySlug } from '../data/categories';
import GigCard from '../components/GigCard';
import './CategoryBrowsePage.css';

function CategoryBrowsePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const filteredTools = useAppSelector((s) => s.tools.filteredTools);
  const category = slug ? getCategoryBySlug(slug) : undefined;

  useEffect(() => {
    dispatch(resetFilters());
    if (category) dispatch(toggleCategory(category.name));
    // Re-run whenever the slug changes so navigating between categories
    // re-filters instead of reusing the previous category's selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <p>{filteredTools.length} {filteredTools.length === 1 ? 'gig' : 'gigs'} available</p>
      </div>

      {filteredTools.length > 0 ? (
        <div className="category-browse__grid">
          {filteredTools.map((tool) => (
            <GigCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="category-browse__empty">
          <SearchX size={28} />
          <h2>No gigs in this category yet</h2>
          <p>Check back soon, or explore another category.</p>
          <button type="button" className="category-browse__empty-btn" onClick={() => navigate('/categories')}>
            Browse Categories
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryBrowsePage;
