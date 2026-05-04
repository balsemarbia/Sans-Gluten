import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Package, RefreshCw } from 'lucide-react';
import { apiCall } from '@/constants/api';

interface ProductStock {
  _id: string;
  nom: string;
  stock: number;
  categorie: string;
  image: string;
  salesCount?: number;
  lastRestocked?: string;
}

export default function StockManagement() {
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/products', 'GET');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    try {
      setUpdating(productId);
      // await apiCall(`/products/${productId}/stock`, 'PUT', { stock: newStock });
      setProducts(products.map(p =>
        p._id === productId ? { ...p, stock: newStock } : p
      ));
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Erreur lors de la mise à jour du stock');
    } finally {
      setUpdating(null);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'Rupture', color: 'bg-red-100 text-red-700', icon: AlertTriangle };
    if (stock < 10) return { status: 'Stock faible', color: 'bg-yellow-100 text-yellow-700', icon: TrendingUp };
    return { status: 'En stock', color: 'bg-green-100 text-green-700', icon: Package };
  };

  const lowStockProducts = products.filter(p => p.stock < 10);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stock Alerts */}
      {(outOfStockProducts.length > 0 || lowStockProducts.length > 0) && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertes de stock
          </h3>
          <div className="space-y-2">
            {outOfStockProducts.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-orange-700">Rupture de stock:</span>
                <span className="font-bold text-orange-900">{outOfStockProducts.length} produit(s)</span>
              </div>
            )}
            {lowStockProducts.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-orange-700">Stock faible (&lt;10):</span>
                <span className="font-bold text-orange-900">{lowStockProducts.length} produit(s)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stock Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Gestion des Stocks</h3>
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                const StatusIcon = stockStatus.icon;

                return (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.nom}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="font-medium text-gray-900">{product.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.categorie}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          onChange={(e) => updateStock(product._id, parseInt(e.target.value) || 0)}
                          disabled={updating === product._id}
                          className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        />
                        {updating === product._id && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {stockStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => updateStock(product._id, product.stock + 10)}
                        disabled={updating === product._id}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                      >
                        +10
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
