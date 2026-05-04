import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { apiCall, getToken } from '@/constants/api';

interface WishlistItem {
  _id: string;
  productId: {
    _id: string;
    nom: string;
    prix: number;
    image: string;
    categorie: string;
    stock: number;
  };
  createdAt: string;
}

export default function Wishlist() {
  const { setCartItems } = useCart();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;

      const data = await apiCall('/favorites', 'GET', undefined, token);
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const token = getToken();
      if (!token) return;

      await apiCall(`/favorites/${itemId}`, 'DELETE', undefined, token);
      setWishlist(wishlist.filter(item => item._id !== itemId));
      setRemovedItems(new Set([...removedItems, itemId]));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCart = (item: WishlistItem) => {
    const cartItem = {
      id: item.productId._id,
      nom: item.productId.nom,
      prix: item.productId.prix,
      quantite: 1,
      image: item.productId.image
    };
    setCartItems([cartItem]);
  };

  const moveToCart = async (item: WishlistItem) => {
    addToCart(item);
    await removeFromWishlist(item._id);
  };

  if (loading) {
    return (
      <div className="container py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Ma Liste de Souhaits
        </h1>
        <p className="text-gray-600">
          {wishlist.length} produit{wishlist.length > 1 ? 's' : ''} enregistré{wishlist.length > 1 ? 's' : ''}
        </p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="relative">
                <Link to={`/products/${item.productId._id}`}>
                  <img
                    src={item.productId.image}
                    alt={item.productId.nom}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                {item.productId.stock < 10 && item.productId.stock > 0 && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    Plus que {item.productId.stock} en stock
                  </div>
                )}
                {item.productId.stock === 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Rupture de stock
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors group"
                >
                  <X className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link to={`/products/${item.productId._id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                    {item.productId.nom}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{item.productId.categorie}</p>
                    <p className="text-xl font-bold text-primary-600">
                      {item.productId.prix.toFixed(3)} DT
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => moveToCart(item)}
                    disabled={item.productId.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-white py-3 rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter au panier
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="p-3 border border-gray-300 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Votre liste de souhaits est vide</h2>
          <p className="text-gray-600 mb-6">
            Ajoutez des produits à votre liste de souhaits pour les retrouver plus tard
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            Découvrir nos produits
          </Link>
        </div>
      )}
    </div>
  );
}
