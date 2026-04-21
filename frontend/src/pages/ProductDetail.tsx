import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '@/constants/api';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, CheckCircle, Leaf, AlertTriangle, Package } from 'lucide-react';
import FavoriteButton from '@/components/ui/FavoriteButton';

interface Product {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  image: string;
  categorie: string;
  stock: number;
  ingredients: string[];
  allergenes: string[];
  certifieSansGluten: boolean;
  bio: boolean;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await apiCall(`/products/${productId}`);
      setProduct(data);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      navigate('/products', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        nom: product.nom,
        prix: product.prix,
        image: product.image,
        description: product.description
      });
    }

    // Navigate to cart
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
        <Link to="/products" className="text-primary-600 font-semibold hover:text-primary-700">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-gray-600">
          <li><Link to="/" className="hover:text-primary-600">Accueil</Link></li>
          <li>/</li>
          <li><Link to="/products" className="hover:text-primary-600">Boutique</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{product.nom}</li>
        </ol>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-primary-600 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      {/* Product Details */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <img
            src={product.image}
            alt={product.nom}
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.nom}
            </h1>
            <FavoriteButton
              itemId={product._id}
              type="product"
              className="p-3 rounded-full"
              iconClassName="w-6 h-6"
            />
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-primary-600">
              {product.prix.toFixed(3)} DT
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {product.certifieSansGluten && (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Certifié Sans Gluten
              </div>
            )}
            {product.bio && (
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                100% Bio
              </div>
            )}
            <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2">
              <Package className="w-4 h-4" />
              {product.categorie}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Ingrédients</h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <ul className="space-y-1">
                  {product.ingredients.map((ing, index) => (
                    <li key={index} className="text-gray-700">
                      • {ing}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Allergens */}
          {product.allergenes && product.allergenes.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Allergènes</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-800 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    Peut contenir des traces de : {product.allergenes.join(', ')}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className={`p-4 rounded-xl mb-6 ${
            product.stock > 10 ? 'bg-green-50' :
            product.stock > 0 ? 'bg-yellow-50' : 'bg-red-50'
          }`}>
            <p className={`font-semibold flex items-center gap-2 ${
              product.stock > 10 ? 'text-green-700' :
              product.stock > 0 ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {product.stock > 10 ? '✅ En stock' :
               product.stock > 0 ? `⚠️ Plus que ${product.stock} unités` : '❌ Rupture de stock'}
            </p>
          </div>

          {/* Add to Cart Section */}
          {product.stock > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-semibold text-gray-900">Quantité :</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-semibold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary-500 text-white py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Ajouter au panier
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
