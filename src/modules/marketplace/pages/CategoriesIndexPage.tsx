import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiTools } from '../../../data/mockData';
import { getCategoryCounts, getCategoryStartingPrices } from '../data/categories';
import { resolveIcon } from '../components/iconMap';
import { useAppSelector } from '../../../store';
import './CategoriesIndexPage.css';

function CategoriesIndexPage() {
  const navigate = useNavigate();
  const categories = useAppSelector((s) => s.categories.categories);
  const counts = useMemo(() => getCategoryCounts(aiTools), []);
  const startingPrices = useMemo(() => getCategoryStartingPrices(aiTools), []);

  return (
    <div className="categories-index">
      <div className="categories-index__header">
        <h1>Browse by Category</h1>
        <p>Explore every solution category in the marketplace</p>
      </div>

      <div className="categories-index__grid">
        {categories.map((category) => {
          const Icon = resolveIcon(category.icon);
          const count = counts[category.name] || 0;
          const startingPrice = startingPrices[category.name];
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
              <span className="categories-index__desc">{category.description}</span>
              <span className="categories-index__sub-preview">
                {category.subCategories.slice(0, 3).map((s) => s.name).join(' · ')}
              </span>
              <div className="categories-index__meta-row">
                <span className="categories-index__count">{count} {count === 1 ? 'gig' : 'gigs'}</span>
                {startingPrice !== undefined && (
                  <span className="categories-index__price">
                    From {startingPrice === 0 ? 'Free' : `$${startingPrice}`}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoriesIndexPage;
