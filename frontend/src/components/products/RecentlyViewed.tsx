import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';

interface RecentlyViewedProduct {
  _id: string;
  nom: string;
  prix: number;
  image: string;
  viewedAt: string;
}

const MAX_RECENTLY_VIEWED = 8;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing recently viewed:', error);
      }
    }
  }, []);

  const addToRecentlyViewed = (product: any) => {
    const newProduct: RecentlyViewedProduct = {
      _id: product._id || product.id,
      nom: product.nom,
      prix: product.prix,
      image: product.image,
      viewedAt: new Date().toISOString()
    };

    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p._id !== newProduct._id);
      // Add to beginning and limit
      const updated = [newProduct, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recentlyViewed');
  };

  return { recentlyViewed, addToRecentlyViewed, clearRecentlyViewed };
}

interface RecentlyViewedProps {
  currentProductId?: string;
}

export default function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const { recentlyViewed } = useRecentlyViewed();

  // Filter out current product
  const filtered = recentlyViewed.filter(p => p._id !== currentProductId);

  if (filtered.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-600" />
          Vus récemment
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.nom}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600">
                  {product.nom}
                </p>
                <p className="text-sm font-bold text-primary-600">
                  {product.prix.toFixed(3)} DT
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
