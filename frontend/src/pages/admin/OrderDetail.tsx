import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiCall, getToken } from '@/constants/api';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  Mail,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

interface OrderItem {
  nom: string;
  quantite: number;
  prix: number;
  image?: string;
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
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string;
}

const statusConfig = {
  'En attente': {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
    description: 'Commande en attente de confirmation'
  },
  'En cours': {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: RefreshCw,
    description: 'Commande en cours de traitement'
  },
  'En préparation': {
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Package,
    description: 'Commande en cours de préparation'
  },
  'Expédiée': {
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: Truck,
    description: 'Commande expédiée'
  },
  'Livré': {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    description: 'Commande livrée avec succès'
  },
  'Annulée': {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
    description: 'Commande annulée'
  }
};

const allStatuses = ['En attente', 'En cours', 'En préparation', 'Expédiée', 'Livré', 'Annulée'] as const;

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

  const fetchOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        navigate('/admin/login');
        return;
      }
      console.log('Fetching order:', orderId);
      const data = await apiCall(`/admin/orders/${orderId}`, 'GET', undefined, token);
      console.log('Order data received:', data);
      setOrder(data);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      if (error.message?.includes('Administration') || error.message?.includes('Accès refusé')) {
        alert('Accès refusé. Vous devez être administrateur.');
        navigate('/admin');
      } else if (error.message?.includes('Commande non trouvée')) {
        alert('Commande non trouvée.');
        navigate('/admin/orders');
      } else {
        alert(`Erreur lors du chargement de la commande: ${error.message || 'Erreur inconnue'}`);
        navigate('/admin/orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order || !id) return;

    try {
      setUpdating(true);
      const token = getToken();
      await apiCall(`/admin/orders/${id}/status`, 'PUT', { statut: newStatus }, token);
      setOrder({ ...order, statut: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Commande non trouvée</h2>
        <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700">
          Retour aux commandes
        </Link>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.statut as keyof typeof statusConfig]?.icon || Package;
  const statusInfo = statusConfig[order.statut as keyof typeof statusConfig] || statusConfig['En attente'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux commandes
        </Link>
      </div>

      {/* Order Title */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Commande #{order._id.slice(-6).toUpperCase()}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusInfo.color}`}>
                <StatusIcon className="w-4 h-4 inline mr-1" />
                {order.statut}
              </span>
            </div>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(order.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total de la commande</p>
            <p className="text-3xl font-bold text-primary-600">
              {order.total.toFixed(3)} DT
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Informations client
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-semibold text-gray-900">{order.adresse?.nom || order.userId?.nom || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {order.userId?.email || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {order.adresse?.telephone || 'N/A'}
                  </p>
                </div>
                {order.paymentMethod && (
                  <div>
                    <p className="text-sm text-gray-500">Mode de paiement</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      {order.paymentMethod}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" />
              Adresse de livraison
            </h2>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4">
              <p className="font-bold text-gray-900 mb-1">{order.adresse?.nom}</p>
              <p className="text-gray-700">{order.adresse?.rue}</p>
              <p className="text-gray-700">
                {order.adresse?.codePostal} {order.adresse?.ville}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              Articles commandés ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.nom}</p>
                    <p className="text-sm text-gray-500">
                      {item.prix.toFixed(3)} DT × {item.quantite}
                    </p>
                  </div>
                  <p className="font-bold text-primary-600 text-lg">
                    {(item.prix * item.quantite).toFixed(3)} DT
                  </p>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            {(order.subtotal !== undefined || order.shippingCost !== undefined || order.discount) && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Détails du paiement</h3>
                <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-4 space-y-2">
                  {order.subtotal !== undefined && (
                    <div className="flex justify-between text-gray-700">
                      <span>Sous-total (articles)</span>
                      <span className="font-medium">{order.subtotal.toFixed(3)} DT</span>
                    </div>
                  )}
                  {order.shippingCost !== undefined && (
                    <div className="flex justify-between text-gray-700">
                      <span>Frais de livraison</span>
                      <span className="font-medium">
                        {order.shippingCost === 0 ? 'Gratuit' : `${order.shippingCost.toFixed(3)} DT`}
                      </span>
                    </div>
                  )}
                  {order.discount && order.discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>
                        Réduction
                        {order.coupon?.code && ` (${order.coupon.code})`}
                      </span>
                      <span className="font-medium">-{order.discount.toFixed(3)} DT</span>
                    </div>
                  )}
                  <div className="border-t border-primary-200 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-primary-600">{order.total.toFixed(3)} DT</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Simple Total if no breakdown */}
            {(!order.subtotal && order.shippingCost === undefined && !order.discount) && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary-600">{order.total.toFixed(3)} DT</span>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-700 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Statut de la commande</h2>
            <div className={`p-4 rounded-xl border ${statusInfo.color} mb-4`}>
              <div className="flex items-center gap-2 mb-1">
                <StatusIcon className="w-5 h-5" />
                <p className="font-semibold">{order.statut}</p>
              </div>
              <p className="text-sm opacity-75">{statusInfo.description}</p>
            </div>

            <h3 className="text-sm font-semibold text-gray-700 mb-3">Mettre à jour le statut</h3>
            <div className="space-y-2">
              {allStatuses.map((status) => {
                const isActive = order.statut === status;
                const btnConfig = statusConfig[status];
                const BtnIcon = btnConfig.icon;

                return (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(status)}
                    disabled={updating || isActive}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <BtnIcon className="w-4 h-4" />
                    <span className="font-medium">{status}</span>
                    {isActive && <CheckCircle className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h2>
            <div className="space-y-2">
              <button
                onClick={() => updateOrderStatus('En préparation')}
                disabled={updating}
                className="w-full flex items-center gap-3 px-4 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                <Package className="w-4 h-4" />
                <span className="font-medium">Marquer en préparation</span>
              </button>
              <button
                onClick={() => updateOrderStatus('Expédiée')}
                disabled={updating}
                className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors disabled:opacity-50"
              >
                <Truck className="w-4 h-4" />
                <span className="font-medium">Marquer comme expédiée</span>
              </button>
              <button
                onClick={() => updateOrderStatus('Livré')}
                disabled={updating}
                className="w-full flex items-center gap-3 px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Marquer comme livrée</span>
              </button>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Historique</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Commande créée</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              {order.statut !== 'En attente' && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Statut mis à jour</p>
                    <p className="text-sm text-gray-500">La commande est maintenant {order.statut.toLowerCase()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
