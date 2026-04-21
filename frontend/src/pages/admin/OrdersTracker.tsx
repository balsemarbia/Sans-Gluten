import { Link, useNavigate } from 'react-router-dom';
import { apiCall, getToken } from '@/constants/api';
import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Package, User, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

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
  statut: string;
  date: string;
  items: OrderItem[];
  adresse: Address;
  userId?: {
    nom: string;
    email: string;
  };
}

const statusColors = {
  'En attente': 'bg-yellow-100 text-yellow-700',
  'En cours': 'bg-blue-100 text-blue-700',
  'En préparation': 'bg-purple-100 text-purple-700',
  'Expédiée': 'bg-indigo-100 text-indigo-700',
  'Livré': 'bg-green-100 text-green-700',
  'Annulée': 'bg-red-100 text-red-700'
};

const allStatuses = ['En attente', 'En cours', 'En préparation', 'Expédiée', 'Livré', 'Annulée'];

export default function OrdersTracker() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }
      const data = await apiCall('/admin/orders', 'GET', undefined, token);
      setOrders(data);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      if (error.message?.includes('Administration')) {
        alert('Accès refusé. Vous devez être administrateur.');
        navigate('/');
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.adresse?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId?.nom?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || order.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 mb-4 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au tableau de bord
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Suivi des commandes
        </h1>
        <p className="text-gray-600">
          Gérez et suivez toutes les commandes
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par ID, client..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-primary-600">
                      {order.total.toFixed(3)} DT
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      statusColors[order.statut as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                    }`}>
                      {order.statut}
                    </span>
                    {expandedOrder === order._id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className="border-t p-6 space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-400" />
                      Informations client
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Nom</p>
                        <p className="font-medium">{order.adresse?.nom || order.userId?.nom || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{order.userId?.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      Adresse de livraison
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-medium">{order.adresse?.nom}</p>
                      <p className="text-gray-600">{order.adresse?.rue}</p>
                      <p className="text-gray-600">
                        {order.adresse?.codePostal} {order.adresse?.ville}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <p>{order.adresse?.telephone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Articles commandés</h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                              {item.quantite}
                            </span>
                            <span className="font-medium">{item.nom}</span>
                          </div>
                          <span className="font-bold text-primary-600">
                            {(item.prix * item.quantite).toFixed(3)} DT
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-3 font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary-600">{order.total.toFixed(3)} DT</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Mettre à jour le statut</h3>
                    <div className="flex flex-wrap gap-2">
                      {allStatuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order._id, status)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            order.statut === status
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
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
