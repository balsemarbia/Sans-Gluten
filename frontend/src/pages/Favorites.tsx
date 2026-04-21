import { Link } from 'react-router-dom';
import { apiCall, getToken } from '@/constants/api';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, ChefHat, Clock, Star } from 'lucide-react';

interface FavoriteItem {
  _id: string;
  itemId: any;
  type: 'product' | 'recipe';
  createdAt: string;
}

export default function Favorites() {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await apiCall('/favorites', 'GET', undefined, token);
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      const token = getToken();
      if (!token) return;
      await apiCall(`/favorites/${id}`, 'DELETE', undefined, token);
      setFavorites(favorites.filter(fav => fav._id !== id));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleAddToCart = (item: FavoriteItem) => {
    if (item.type === 'product' && item.itemId) {
      addToCart({
        id: item.itemId._id,
        nom: item.itemId.nom || 'Produit',
        prix: item.itemId.prix || 0,
        image: item.itemId.image || '',
        description: item.itemId.description
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          Mes Favoris
        </h1>
        <p className="text-gray-600">
          Retrouvez tous vos produits et recettes préférés
        </p>
      </div>

      {!getToken() ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connectez-vous pour voir vos favoris
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à vos favoris
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-primary-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group relative"
            >
              {/* Remove favorite button */}
              <button
                onClick={() => handleRemoveFavorite(favorite._id)}
                className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-50 transition-colors"
                aria-label="Remove from favorites"
              >
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </button>

              {favorite.type === 'product' ? (
                <>
                  <Link
                    to={`/products/${favorite.itemId?._id}`}
                    className="block overflow-hidden"
                  >
                    <img
                      src={favorite.itemId?.image || 'https://via.placeholder.com/300'}
                      alt={favorite.itemId?.nom || 'Produit'}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-4">
                    <Link
                      to={`/products/${favorite.itemId?._id}`}
                      className="block font-semibold text-gray-900 mb-2 hover:text-primary-600 line-clamp-2"
                    >
                      {favorite.itemId?.nom || 'Produit sans nom'}
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {favorite.itemId?.prix !== undefined
                          ? favorite.itemId.prix.toFixed(3)
                          : '0.000'} DT
                      </span>
                      <button
                        onClick={() => handleAddToCart(favorite)}
                        className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to={`/recipes/${favorite.itemId?._id}`}
                    className="block overflow-hidden relative"
                  >
                    <img
                      src={favorite.itemId?.image || 'https://via.placeholder.com/500'}
                      alt={favorite.itemId?.titre || 'Recette'}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {favorite.itemId?.temps && (
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-primary-600" />
                        <span className="text-xs font-semibold text-primary-600">
                          {favorite.itemId.temps}
                        </span>
                      </div>
                    )}
                  </Link>
                  <div className="p-4">
                    <Link
                      to={`/recipes/${favorite.itemId?._id}`}
                      className="block font-semibold text-gray-900 mb-2 hover:text-primary-600 line-clamp-2"
                    >
                      {favorite.itemId?.titre || 'Recette sans titre'}
                    </Link>
                    {favorite.itemId?.description && (
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {favorite.itemId.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {favorite.itemId?.difficulte && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          favorite.itemId.difficulte === 'Facile' ? 'bg-green-100 text-green-700' :
                          favorite.itemId.difficulte === 'Moyen' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          <Star className="w-3 h-3 inline mr-1" />
                          {favorite.itemId.difficulte}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-gray-400">
                        <ChefHat className="w-4 h-4" />
                        <span className="text-xs">Recette</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Aucun favori pour le moment
          </h2>
          <p className="text-gray-600 mb-6">
            Ajoutez des produits et recettes à vos favoris pour les retrouver facilement
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
            >
              Découvrir les produits
            </Link>
            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
            >
              Voir les recettes
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
