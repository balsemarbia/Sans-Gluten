import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiCall } from '@/constants/api';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, SlidersHorizontal } from 'lucide-react';
import FavoriteButton from '@/components/ui/FavoriteButton';

interface Product {
  _id: string;
  nom: string;
  prix: number;
  image: string;
  description?: string;
  categorie: string;
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    'Farines', 'Pains', 'Pâtes', 'Snacks',
    'Biscuits', 'Épicerie', 'Boissons', 'Desserts'
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let endpoint = '/products?';

      if (searchQuery) {
        endpoint += `recherche=${encodeURIComponent(searchQuery)}&`;
      }
      if (selectedCategory) {
        endpoint += `categorie=${encodeURIComponent(selectedCategory)}&`;
      }

      const data = await apiCall(endpoint);
      let sortedData = data;

      // Sort products
      switch (sortBy) {
        case 'price-asc':
          sortedData = [...data].sort((a: Product, b: Product) => a.prix - b.prix);
          break;
        case 'price-desc':
          sortedData = [...data].sort((a: Product, b: Product) => b.prix - a.prix);
          break;
        case 'name':
          sortedData = [...data].sort((a: Product, b: Product) => a.nom.localeCompare(b.nom));
          break;
        default: // newest
          sortedData = data;
      }

      setProducts(sortedData);
    } catch (error) {
      console.error('Error fetching products:', error);
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
    fetchProducts();
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Boutique
        </h1>
        <p className="text-gray-600">
          Découvrez tous nos produits sans gluten
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filtres
            </h3>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Catégories</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Toutes</span>
                </label>
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {products.length} produit{products.length !== 1 ? 's' : ''}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom A-Z</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      className="block font-semibold text-gray-900 mb-1 hover:text-primary-600"
                    >
                      {product.nom}
                    </Link>
                    <p className="text-sm text-gray-500 mb-3">{product.categorie}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">
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
            <div className="text-center py-12 bg-white rounded-2xl shadow-md">
              <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="mt-4 text-primary-600 font-semibold hover:text-primary-700"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
