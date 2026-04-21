import { Link, useNavigate } from 'react-router-dom';
import { apiCall, getToken, removeToken } from '@/constants/api';
import { useState, useEffect } from 'react';
import { User, ShoppingBag, LogOut, MapPin, Settings, Package } from 'lucide-react';

interface UserProfile {
  _id: string;
  nom: string;
  email: string;
  telephone?: string;
}

interface Order {
  _id: string;
  total: number;
  statut: string;
  createdAt: string;
  items: Array<{ nom: string; quantite: number; prix: number }>;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const userData = await apiCall('/users/profile', 'GET', undefined, token);
      setUser(userData);

      const ordersData = await apiCall('/orders/my-orders', 'GET', undefined, token);
      setOrders(ordersData);
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
                to="/profile/orders"
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
              Commandes récentes
            </h2>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Commande #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.statut === 'Livré' ? 'bg-green-100 text-green-700' :
                        order.statut === 'En cours' ? 'bg-yellow-100 text-yellow-700' :
                        order.statut === 'Annulé' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.statut}
                      </span>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600 mb-2">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </p>
                      <p className="font-bold text-primary-600">
                        Total: {order.total.toFixed(3)} DT
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Aucune commande pour le moment</p>
                <Link
                  to="/products"
                  className="text-primary-600 font-semibold hover:text-primary-700"
                >
                  Découvrir nos produits
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
