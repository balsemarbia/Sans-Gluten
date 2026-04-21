import { Link, useNavigate } from 'react-router-dom';
import { apiCall, getToken } from '@/constants/api';
import { useState, useEffect } from 'react';
import { ShoppingBag, Users, Package, TrendingUp, ArrowRight, Plus } from 'lucide-react';

interface Stats {
  products: number;
  orders: number;
  users: number;
  revenue: number;
}

interface RecentOrder {
  _id: string;
  total: number;
  statut: string;
  createdAt: string;
  user: { nom: string };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const [statsData, ordersData] = await Promise.all([
        apiCall('/admin/stats', 'GET', undefined, token),
        apiCall('/admin/orders', 'GET', undefined, token)
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre boutique
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.products}</h3>
          <p className="text-gray-600">Produits</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.orders}</h3>
          <p className="text-gray-600">Commandes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+24%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.users}</h3>
          <p className="text-gray-600">Utilisateurs</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+18%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.revenue.toFixed(3)} DT</h3>
          <p className="text-gray-600">Revenus</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-md p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Ajouter un produit</h3>
          <p className="text-primary-100 mb-4">Créez un nouveau produit pour votre boutique</p>
          <Link
            to="/admin/products?action=new"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouveau produit
          </Link>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-md p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Ajouter une recette</h3>
          <p className="text-orange-100 mb-4">Partagez une nouvelle recette sans gluten</p>
          <Link
            to="/admin/recipes?action=new"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvelle recette
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Commandes récentes</h2>
          <Link
            to="/admin/orders"
            className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
          >
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Commande</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Client</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 px-4">{order.user?.nom || 'N/A'}</td>
                    <td className="py-3 px-4">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.statut === 'Livré' ? 'bg-green-100 text-green-700' :
                        order.statut === 'En cours' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.statut}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-primary-600">
                      {order.total.toFixed(3)} DT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune commande récente</p>
          </div>
        )}
      </div>
    </div>
  );
}
