import { Link, useNavigate } from 'react-router-dom';
import { apiCall, getToken } from '@/constants/api';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';

interface Product {
  _id: string;
  nom: string;
  prix: number;
  image: string;
  categorie: string;
  stock: number;
  actif: boolean;
}

export default function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    image: '',
    categorie: 'Farines',
    stock: '',
    ingredients: '',
    allergenes: '',
    certifieSansGluten: true,
    bio: false
  });

  const categories = [
    'Farines', 'Pains', 'Pâtes', 'Snacks',
    'Biscuits', 'Épicerie', 'Boissons', 'Desserts'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }
      const data = await apiCall('/products', 'GET', undefined, token);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nom: product.nom,
      description: '',
      prix: product.prix.toString(),
      image: product.image,
      categorie: product.categorie,
      stock: product.stock.toString(),
      ingredients: '',
      allergenes: '',
      certifieSansGluten: true,
      bio: false
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const token = getToken();
      await apiCall(`/products/${id}`, 'DELETE', undefined, token);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      const productData = {
        nom: formData.nom,
        description: formData.description,
        prix: parseFloat(formData.prix),
        image: formData.image,
        categorie: formData.categorie,
        stock: parseInt(formData.stock),
        ingredients: formData.ingredients.split(',').map(i => i.trim()),
        allergenes: formData.allergenes.split(',').map(a => a.trim()),
        certifieSansGluten: formData.certifieSansGluten,
        bio: formData.bio
      };

      if (editingProduct) {
        await apiCall(`/products/${editingProduct._id}`, 'PUT', productData, token);
        setProducts(products.map(p => p._id === editingProduct._id ? { ...p, ...productData } : p));
      } else {
        const newProduct = await apiCall('/products', 'POST', productData, token);
        setProducts([...products, newProduct.product]);
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      prix: '',
      image: '',
      categorie: 'Farines',
      stock: '',
      ingredients: '',
      allergenes: '',
      certifieSansGluten: true,
      bio: false
    });
  };

  const filteredProducts = products.filter(p =>
    p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categorie.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gérer les produits</h1>
          <p className="text-gray-600">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouveau produit
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Produit</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Catégorie</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Prix</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Stock</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Statut</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.nom}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <span className="font-medium text-gray-900">{product.nom}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{product.categorie}</td>
                  <td className="py-4 px-6 font-bold text-primary-600">
                    {product.prix.toFixed(3)} DT
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      product.stock > 10 ? 'bg-green-100 text-green-700' :
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      product.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Edit className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nom du produit</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Prix (DT)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Catégorie</label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.certifieSansGluten}
                    onChange={(e) => setFormData({ ...formData, certifieSansGluten: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <span>Certifié Sans Gluten</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <span>Bio</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                >
                  {editingProduct ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
