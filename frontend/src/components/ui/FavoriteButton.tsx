import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { apiCall, getToken } from '@/constants/api';

interface FavoriteButtonProps {
  itemId: string;
  type: 'product' | 'recipe';
  className?: string;
  iconClassName?: string;
}

export default function FavoriteButton({
  itemId,
  type,
  className = '',
  iconClassName = 'w-5 h-5'
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    checkFavorite();
  }, [itemId, type]);

  const checkFavorite = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const favorites = await apiCall('/favorites', 'GET', undefined, token);
      const fav = favorites.find(
        (f: any) => f.itemId?._id === itemId && f.type === type
      );
      if (fav) {
        setIsFavorite(true);
        setFavoriteId(fav._id);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getToken();
    if (!token) {
      alert('Vous devez être connecté pour ajouter des favoris');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite && favoriteId) {
        // Remove from favorites
        await apiCall(`/favorites/${favoriteId}`, 'DELETE', undefined, token);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        // Add to favorites
        const result = await apiCall('/favorites', 'POST', { itemId, type }, token);
        setIsFavorite(true);
        setFavoriteId(result.favorite?._id);
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      // Don't show alert for "already in favorites" error, just sync state
      if (!error.message?.includes('Déjà dans les favoris')) {
        alert(error.message || 'Erreur lors de la gestion des favoris');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`transition-all duration-200 ${
        isFavorite
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white/90 text-gray-400 hover:bg-red-50 hover:text-red-500'
      } ${className}`}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        className={`${iconClassName} ${isFavorite ? 'fill-red-500' : ''} ${
          loading ? 'animate-pulse' : ''
        }`}
      />
    </button>
  );
}
