import { useState, useEffect } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdvancedSearchProps {
  onClose?: () => void;
}

export default function AdvancedSearch({ onClose }: AdvancedSearchProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    'Pain sans gluten',
    'Farine de riz',
    'Pâtes sans gluten',
    'Biscuits',
    'Gâteaux'
  ]);

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    // Navigate to products page with search query
    navigate(`/products?search=${encodeURIComponent(query)}`);
    onClose?.();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            placeholder="Rechercher des produits..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Quick Suggestions */}
      {searchQuery && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Suggestions</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && !searchQuery && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Recherches récentes</h3>
            <button
              onClick={clearRecentSearches}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Effacer
            </button>
          </div>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(search)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="flex-1">{search}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Searches */}
      {!searchQuery && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Recherches populaires
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((trending, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(trending)}
                className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-full text-sm transition-colors"
              >
                {trending}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
