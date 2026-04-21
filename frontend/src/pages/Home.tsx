import { Link, useNavigate } from 'react-router-dom';
import { apiCall } from '@/constants/api';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Clock, Star } from 'lucide-react';
import FavoriteButton from '@/components/ui/FavoriteButton';

interface Product {
  _id: string;
  nom: string;
  prix: number;
  image: string;
  description?: string;
}

interface Recipe {
  _id: string;
  titre: string;
  description: string;
  image: string;
  temps: string;
  difficulte: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [productsData, recipesData] = await Promise.all([
        apiCall('/products?limit=8'),
        apiCall('/recipes?limit=4')
      ]);
      setProducts(productsData);
      setRecipes(recipesData);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      nom: product.nom,
      prix: product.prix,
      image: product.image,
      description: product.description
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Mangez sain, mangez sans gluten
              </h1>
              <p className="text-lg md:text-xl mb-8 text-primary-50">
                Découvrez notre sélection de produits et recettes sans gluten pour une vie plus saine.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors"
                >
                  Découvrir les produits
                </Link>
                <Link
                  to="/recipes"
                  className="bg-primary-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800 transition-colors"
                >
                  Voir les recettes
                </Link>
              </div>
            </div>
            <div className="text-9xl text-center md:text-right">
              🌾
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des produits ou des recettes..."
                className="w-full pl-14 pr-36 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold transition-colors shadow-md"
              >
                Rechercher
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              🔍 Trouvez vos produits et recettes sans gluten préférés
            </p>
          </form>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12 bg-primary-50">
        <div className="container">
          <div className="bg-primary-500 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                -20% sur les Farines Bio
              </h2>
              <p className="text-primary-100">
                Offre limitée. Profitez-en maintenant !
              </p>
            </div>
            <Link
              to="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors whitespace-nowrap"
            >
              Profiter
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Produits Populaires
            </h2>
            <Link
              to="/products"
              className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
            >
              Voir tout →
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <Link
                    to={`/products/${product._id}`}
                    className="block overflow-hidden relative"
                  >
                    <img
                      src={product.image}
                      alt={product.nom}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <FavoriteButton
                      itemId={product._id}
                      type="product"
                      className="absolute top-3 right-3 p-2 rounded-full"
                    />
                  </Link>
                  <div className="p-4">
                    <Link
                      to={`/products/${product._id}`}
                      className="block font-semibold text-gray-900 mb-2 hover:text-primary-600"
                    >
                      {product.nom}
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {product.prix.toFixed(3)} DT
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun produit disponible</p>
            </div>
          )}
        </div>
      </section>

      {/* Recipes Section */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Recettes du jour
            </h2>
            <Link
              to="/recipes"
              className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
            >
              Voir tout →
            </Link>
          </div>

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.map((recipe) => (
                <Link
                  key={recipe._id}
                  to={`/recipes/${recipe._id}`}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative">
                    <img
                      src={recipe.image}
                      alt={recipe.titre}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <FavoriteButton
                      itemId={recipe._id}
                      type="recipe"
                      className="absolute top-4 left-4 p-2 rounded-full"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-semibold text-primary-600">{recipe.temps}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {recipe.titre}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {recipe.description || 'Découvrez cette délicieuse recette sans gluten.'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        recipe.difficulte === 'Facile' ? 'bg-green-100 text-green-700' :
                        recipe.difficulte === 'Moyen' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        <Star className="w-3 h-3 inline mr-1" />
                        {recipe.difficulte}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune recette disponible</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
