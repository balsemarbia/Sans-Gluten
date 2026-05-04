import { Link, useNavigate } from 'react-router-dom';
import { apiCall, getToken } from '@/constants/api';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Package,
  User,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Eye,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Truck
} from 'lucide-react';

interface OrderItem {
  nom: string;
  quantite: number;
  prix: number;
}

interface Address {
  nom: string;
  rue: string;
  ville: string;
  codePostal: string;
  telephone: string;
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
  date: string;
  items: OrderItem[];
  adresse: Address;
  userId?: {
    nom: string;
    email: string;
  };
}

const statusConfig = {
  'En attente': {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
    bgColor: 'bg-yellow-50'
  },
  'En cours': {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: RefreshCw,
    bgColor: 'bg-blue-50'
  },
  'En préparation': {
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Package,
    bgColor: 'bg-purple-50'
  },
  'Expédiée': {
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: Truck,
    bgColor: 'bg-indigo-50'
  },
  'Livré': {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    bgColor: 'bg-green-50'
  },
  'Annulée': {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
    bgColor: 'bg-red-50'
  }
};

const allStatuses = ['En attente', 'En cours', 'En préparation', 'Expédiée', 'Livré', 'Annulée'] as const;

export default function OrdersTracker() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        navigate('/admin/login');
        return;
      }
      const data = await apiCall('/admin/orders', 'GET', undefined, token);
      setOrders(data);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      if (error.message?.includes('Administration')) {
        alert('Accès refusé. Vous devez être administrateur.');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = getToken();
      await apiCall(`/admin/orders/${orderId}/status`, 'PUT', { statut: newStatus }, token);
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, statut: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.adresse?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userId?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.adresse?.telephone?.includes(searchQuery);

      const matchesStatus = !statusFilter || order.statut === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let compareValue = 0;
      if (sortBy === 'date') {
        compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        compareValue = a.total - b.total;
      }
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  const toggleSort = (field: 'date' | 'total') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.statut === 'En attente').length,
      processing: orders.filter(o => ['En cours', 'En préparation'].includes(o.statut)).length,
      shipped: orders.filter(o => o.statut === 'Expédiée').length,
      delivered: orders.filter(o => o.statut === 'Livré').length,
      cancelled: orders.filter(o => o.statut === 'Annulée').length,
      revenue: orders.filter(o => o.statut !== 'Annulée').reduce((sum, o) => sum + o.total, 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Commandes
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez et suivez toutes les commandes ({stats.total} au total)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">En cours</p>
          <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
          <p className="text-sm text-gray-500">Expédiées</p>
          <p className="text-2xl font-bold text-gray-900">{stats.shipped}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Livrées</p>
          <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Annulées</p>
          <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-primary-500">
          <p className="text-sm text-gray-500">Revenus</p>
          <p className="text-xl font-bold text-primary-600">{stats.revenue.toFixed(3)} DT</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par ID, client, téléphone..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les statuts</option>
              {allStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              onClick={() => toggleSort('date')}
              className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Date</span>
              {sortBy === 'date' && (
                sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => toggleSort('total')}
              className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Montant</span>
              {sortBy === 'total' && (
                sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedOrders.length > 0 ? (
                filteredAndSortedOrders.map((order) => {
                  const StatusIcon = statusConfig[order.statut as keyof typeof statusConfig]?.icon || Package;
                  const statusInfo = statusConfig[order.statut as keyof typeof statusConfig] || statusConfig['En attente'];

                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-900">
                            #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            {order.adresse?.nom || order.userId?.nom || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {order.adresse?.telephone || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-primary-600 text-lg">
                            {order.total.toFixed(3)} DT
                          </p>
                          {(order.shippingCost !== undefined || order.discount) && (
                            <div className="text-xs text-gray-500 space-y-0.5">
                              {order.subtotal !== undefined && (
                                <p>Sous-total: {order.subtotal.toFixed(3)} DT</p>
                              )}
                              {order.shippingCost !== undefined && (
                                <p>Livraison: {order.shippingCost === 0 ? 'Gratuit' : `${order.shippingCost.toFixed(3)} DT`}</p>
                              )}
                              {order.discount && order.discount > 0 && (
                                <p className="text-green-600">Réduction: -{order.discount.toFixed(3)} DT</p>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {order.statut}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <select
                            value={order.statut}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            {allStatuses.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="text-center">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Aucune commande trouvée
                      </h2>
                      <p className="text-gray-600">
                        {searchQuery || statusFilter
                          ? 'Essayez de modifier vos filtres'
                          : 'Les commandes apparaîtront ici'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards (shown only on small screens) */}
      <div className="lg:hidden space-y-4">
        {filteredAndSortedOrders.length > 0 ? (
          filteredAndSortedOrders.map((order) => {
            const StatusIcon = statusConfig[order.statut as keyof typeof statusConfig]?.icon || Package;
            const statusInfo = statusConfig[order.statut as keyof typeof statusConfig] || statusConfig['En attente'];

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {order.statut}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="font-medium text-gray-900">{order.adresse?.nom || order.userId?.nom || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold text-primary-600">{order.total.toFixed(3)} DT</p>
                      {(order.shippingCost !== undefined || order.discount) && (
                        <div className="text-xs text-gray-500 mt-1">
                          {order.subtotal !== undefined && (
                            <p>Sous-total: {order.subtotal.toFixed(3)} DT</p>
                          )}
                          {order.shippingCost !== undefined && (
                            <p>Livraison: {order.shippingCost === 0 ? 'Gratuit' : `${order.shippingCost.toFixed(3)} DT`}</p>
                          )}
                          {order.discount && order.discount > 0 && (
                            <p className="text-green-600">Réduction: -{order.discount.toFixed(3)} DT</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <select
                        value={order.statut}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {allStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Aucune commande trouvée
            </h2>
            <p className="text-gray-600">
              {searchQuery || statusFilter
                ? 'Essayez de modifier vos filtres'
                : 'Les commandes apparaîtront ici'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
