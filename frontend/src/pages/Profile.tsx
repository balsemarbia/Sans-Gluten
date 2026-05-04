import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiCall, getToken, removeToken } from '@/constants/api';
import { useState, useEffect } from 'react';
import { User, ShoppingBag, LogOut, MapPin, Settings, Package, Shield, RefreshCw } from 'lucide-react';
import OrderHistory from '@/components/orders/OrderHistory';

interface UserProfile {
  _id: string;
  nom: string;
  email: string;
  telephone?: string;
  role?: string;
}

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
  items: Array<{ nom: string; quantite: number; prix: number; image?: string }>;
  adresse?: {
    nom: string;
    rue: string;
    ville: string;
    codePostal: string;
    telephone: string;
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasIncompleteOrder, setHasIncompleteOrder] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    checkIncompleteOrder();
  }, []);

  useEffect(() => {
    // Show success message if coming from an order
    const orderId = searchParams.get('order');
    if (orderId) {
      // Could show a success toast here
      console.log('Order completed:', orderId);
    }
  }, [searchParams]);

  const checkIncompleteOrder = () => {
    try {
      const savedOrderJson = localStorage.getItem('incompleteOrder');
      if (savedOrderJson) {
        const savedData = JSON.parse(savedOrderJson);
        const savedDate = new Date(savedData.savedAt);
        const daysDiff = Math.floor((Date.now() - savedDate.getTime()) / (1000 * 60 * 60 * 24));
        // Show notice if saved within last 7 days
        if (daysDiff < 7) {
          setHasIncompleteOrder(true);
        }
      }
    } catch (error) {
      console.error('Error checking incomplete order:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = getToken();
      console.log('Profile - Token:', token ? 'exists' : 'missing');
      if (!token) {
        navigate('/login');
        return;
      }

      const userData = await apiCall('/users/profile', 'GET', undefined, token);
      setUser(userData);

      console.log('Profile - Fetching orders from /orders/my-orders...');
      const ordersData = await apiCall('/orders/my-orders', 'GET', undefined, token);
      console.log('Profile - Received orders:', ordersData);
      console.log('Profile - Number of orders:', Array.isArray(ordersData) ? ordersData.length : 'not an array');
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <p className="text-gray-600 mb-4">Vous devez être connecté pour voir cette page</p>
        <Link
          to="/login"
          className="bg-primary-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Mon Compte
        </h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Incomplete Order Notice */}
        {hasIncompleteOrder && (
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900">Commande en cours</h3>
                    <p className="text-blue-700 text-sm">
                      Vous avez une commande non finalisée. Continuez vos achats où vous vous êtes arrêté !
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => localStorage.removeItem('incompleteOrder')}
                    className="px-4 py-2 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Ignorer
                  </button>
                  <Link
                    to="/continue-order"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Continuer ma commande
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.nom}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <Link
                to="/profile"
                className="flex items-center gap-3 text-gray-700 hover:text-primary-600 py-2"
              >
                <User className="w-5 h-5" />
                Mes informations
              </Link>
              <Link
                to="/orders"
                className="flex items-center gap-3 text-gray-700 hover:text-primary-600 py-2"
              >
                <Package className="w-5 h-5" />
                Mes commandes
              </Link>
              <Link
                to="/profile/addresses"
                className="flex items-center gap-3 text-gray-700 hover:text-primary-600 py-2"
              >
                <MapPin className="w-5 h-5" />
                Adresses de livraison
              </Link>
              <Link
                to="/profile/settings"
                className="flex items-center gap-3 text-gray-700 hover:text-primary-600 py-2"
              >
                <Settings className="w-5 h-5" />
                Paramètres
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 text-primary-600 hover:text-primary-700 py-2 font-semibold"
                >
                  <Shield className="w-5 h-5" />
                  Administration
                </Link>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-6 flex items-center justify-center gap-2 text-red-600 hover:text-red-700 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary-600" />
              Historique des commandes
            </h2>

            <OrderHistory orders={orders} />
          </div>
        </div>
      </div>
    </div>
  );
}
