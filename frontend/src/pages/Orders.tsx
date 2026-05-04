import { Link, useNavigate } from 'react-router-dom';
import { apiCall, getToken } from '@/constants/api';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, Package, ShoppingBag, RefreshCw } from 'lucide-react';
import OrderHistory from '@/components/orders/OrderHistory';

interface Order {
  _id: string;
  total: number;
  subtotal?: number;
  shippingCost?: number;
  discount?: number;
  coupon?: {
    code: string;
    discount: number;
  };
  statut: string;
  date?: string;
  createdAt: string;
  items: Array<{ nom: string; quantite: number; prix: number; image?: string; productId?: string }>;
  adresse?: {
    nom: string;
    rue: string;
    ville: string;
    codePostal: string;
    telephone: string;
  };
}

export default function Orders() {
  const navigate = useNavigate();
  const { setCartItems } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderLoading, setReorderLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getToken();
      console.log('Token:', token ? 'exists' : 'missing');
      if (!token) {
        navigate('/login', { state: { from: { pathname: '/orders' } } });
        return;
      }

      console.log('Fetching orders from /orders/my-orders...');
      const ordersData = await apiCall('/orders/my-orders', 'GET', undefined, token);
      console.log('Received orders:', ordersData);
      console.log('Number of orders:', Array.isArray(ordersData) ? ordersData.length : 'not an array');
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (order: Order) => {
    try {
      setReorderLoading(order._id);

      // Map order items to cart items
      const cartItems = order.items.map(item => ({
        id: item.productId || item.nom, // Fallback to nom if productId is not available
        nom: item.nom,
        prix: item.prix,
        quantite: item.quantite,
        image: item.image || ''
      }));

      setCartItems(cartItems);

      // Navigate to cart
      navigate('/cart');
    } catch (error) {
      console.error('Error reordering:', error);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setReorderLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="ml-4 text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 mb-4 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au profil
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Mes Commandes
        </h1>
        <p className="text-gray-600">
          Consultez l'historique de vos commandes et suivez leurs statuts
        </p>
      </div>

      {/* Quick Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700">En cours</p>
                <p className="text-2xl font-bold text-blue-900">
                  {orders.filter(o => ['En attente', 'En cours', 'En préparation', 'Expédiée'].includes(o.statut)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700">Livrées</p>
                <p className="text-2xl font-bold text-green-900">
                  {orders.filter(o => o.statut === 'Livré').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Total commandes</p>
                <p className="text-2xl font-bold text-purple-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold">DT</span>
              </div>
              <div>
                <p className="text-sm text-primary-700">Total dépensé</p>
                <p className="text-xl font-bold text-primary-900">
                  {orders.filter(o => o.statut !== 'Annulée').reduce((sum, o) => sum + o.total, 0).toFixed(3)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order History */}
      <OrderHistory orders={orders} onReorder={handleReorder} reorderLoading={reorderLoading} />

      {/* Continue Shopping */}
      {orders.length > 0 && (
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Continuer mes achats
          </Link>
        </div>
      )}
    </div>
  );
}
