import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setSearch, resetFilters } from '../../../store/slices/toolsSlice';
import GigCard from '../components/GigCard';
import './SearchResultsPage.css';

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const filteredTools = useAppSelector((s) => s.tools.filteredTools);

  useEffect(() => {
    dispatch(resetFilters());
    if (query) dispatch(setSearch(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="search-results">
      <div className="search-results__header">
        <h1>Search results for "{query}"</h1>
        <p>{filteredTools.length} {filteredTools.length === 1 ? 'gig' : 'gigs'} found</p>
      </div>

      {filteredTools.length > 0 ? (
        <div className="search-results__grid">
          {filteredTools.map((tool) => (
            <GigCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="search-results__empty">
          <SearchX size={28} />
          <h2>No gigs match "{query}"</h2>
          <p>Try a different search term or browse categories instead.</p>
          <button type="button" className="search-results__empty-btn" onClick={() => navigate('/categories')}>
            Browse Categories
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;
