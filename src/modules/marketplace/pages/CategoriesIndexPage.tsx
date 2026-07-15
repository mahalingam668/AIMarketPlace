import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiTools } from '../../../data/mockData';
import { MARKETPLACE_CATEGORIES, getCategoryCounts } from '../data/categories';
import { resolveIcon } from '../components/iconMap';
import './CategoriesIndexPage.css';

function CategoriesIndexPage() {
  const navigate = useNavigate();
  const counts = useMemo(() => getCategoryCounts(aiTools), []);

  return (
    <div className="categories-index">
      <div className="categories-index__header">
        <h1>Browse by Category</h1>
        <p>Explore every solution category in the marketplace</p>
      </div>

      <div className="categories-index__grid">
        {MARKETPLACE_CATEGORIES.map((category) => {
          const Icon = resolveIcon(category.icon);
          const count = counts[category.name] || 0;
          return (
            <button
              key={category.slug}
              type="button"
              className="categories-index__card"
              onClick={() => navigate(`/category/${category.slug}`)}
            >
              <span className="categories-index__icon">
                <Icon size={22} />
              </span>
              <span className="categories-index__name">{category.name}</span>
              <span className="categories-index__count">{count} {count === 1 ? 'gig' : 'gigs'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoriesIndexPage;
