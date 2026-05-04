import { useState } from 'react';
import { Package, MapPin, Phone, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, RefreshCw, Truck, Copy, ShoppingCart } from 'lucide-react';

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
  createdAt: string;
  items: OrderItem[];
  adresse: Address;
}

interface OrderHistoryProps {
  orders: Order[];
  onReorder?: (order: Order) => void;
  reorderLoading?: string | null;
}

const statusConfig = {
  'En attente': {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    bgColor: 'bg-yellow-50',
    icon: Clock,
    label: 'En attente de confirmation'
  },
  'En cours': {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    bgColor: 'bg-blue-50',
    icon: RefreshCw,
    label: 'Commande confirmée'
  },
  'En préparation': {
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    bgColor: 'bg-purple-50',
    icon: Package,
    label: 'En cours de préparation'
  },
  'Expédiée': {
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    bgColor: 'bg-indigo-50',
    icon: Truck,
    label: 'Commande expédiée'
  },
  'Livré': {
    color: 'bg-green-100 text-green-700 border-green-200',
    bgColor: 'bg-green-50',
    icon: CheckCircle,
    label: 'Commande livrée'
  },
  'Annulée': {
    color: 'bg-red-100 text-red-700 border-red-200',
    bgColor: 'bg-red-50',
    icon: XCircle,
    label: 'Commande annulée'
  }
};

const statusOrder = ['Livré', 'Expédiée', 'En préparation', 'En cours', 'En attente', 'Annulée'];

export default function OrderHistory({ orders, onReorder, reorderLoading }: OrderHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    if (filter === 'active') {
      return ['En attente', 'En cours', 'En préparation', 'Expédiée'].includes(order.statut);
    }
    if (filter === 'completed') {
      return order.statut === 'Livré';
    }
    if (filter === 'cancelled') {
      return order.statut === 'Annulée';
    }
    if (statusFilter) {
      return order.statut === statusFilter;
    }
    return true;
  });

  const copyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    // Could add a toast notification here
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      active: orders.filter(o => ['En attente', 'En cours', 'En préparation', 'Expédiée'].includes(o.statut)).length,
      completed: orders.filter(o => o.statut === 'Livré').length,
      cancelled: orders.filter(o => o.statut === 'Annulée').length,
      totalSpent: orders.filter(o => o.statut !== 'Annulée').reduce((sum, o) => sum + o.total, 0)
    };
  };

  const stats = getOrderStats();

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-md">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Aucune commande</h2>
        <p className="text-gray-600 mb-6">Commencez vos achats pour voir vos commandes ici</p>
        <a
          href="/products"
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
        >
          Découvrir nos produits
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-gray-500">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">En cours</p>
          <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Livrées</p>
          <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Annulées</p>
          <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-primary-500 col-span-2 md:col-span-1">
          <p className="text-sm text-gray-500">Total dépensé</p>
          <p className="text-xl font-bold text-primary-600">{stats.totalSpent.toFixed(3)} DT</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setFilter('all'); setStatusFilter(''); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' && !statusFilter
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => { setFilter('active'); setStatusFilter(''); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => { setFilter('completed'); setStatusFilter(''); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Livrées
            </button>
            <button
              onClick={() => { setFilter('cancelled'); setStatusFilter(''); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'cancelled'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Annulées
            </button>
          </div>
          <div className="flex-1">
            <select
              value={statusFilter}
              onChange={(e) => { setFilter('all'); setStatusFilter(e.target.value); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Filtrer par statut</option>
              {Object.keys(statusConfig).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.statut as keyof typeof statusConfig]?.icon || Clock;
            const statusInfo = statusConfig[order.statut as keyof typeof statusConfig] || statusConfig['En attente'];
            const isExpanded = expandedOrder === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div
                  className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyOrderId(order._id);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copier l'ID"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.date || order.createdAt).toLocaleDateString('fr-FR', {
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
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                        <p className="text-xl font-bold text-primary-600">
                          {order.total.toFixed(3)} DT
                        </p>
                      </div>
                      {onReorder && order.statut === 'Livré' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onReorder(order);
                          }}
                          disabled={reorderLoading === order._id}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-nowrap flex items-center gap-2"
                        >
                          {reorderLoading === order._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Re commander
                            </>
                          )}
                        </button>
                      )}
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4 inline mr-1" />
                        {order.statut}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-5 space-y-6">
                    {/* Status Timeline */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Suivi de la commande</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Articles commandés</h3>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 bg-white p-3 rounded-xl"
                          >
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {item.image ? (
                                <img src={item.image} alt={item.nom} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.nom}</p>
                              <p className="text-sm text-gray-500">
                                {item.prix.toFixed(3)} DT × {item.quantite}
                              </p>
                            </div>
                            <p className="font-bold text-primary-600">
                              {(item.prix * item.quantite).toFixed(3)} DT
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.adresse && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Adresse de livraison
                        </h3>
                        <div className="bg-white p-4 rounded-xl">
                          <p className="font-medium text-gray-900">{order.adresse.nom}</p>
                          <p className="text-gray-600">{order.adresse.rue}</p>
                          <p className="text-gray-600">
                            {order.adresse.codePostal} {order.adresse.ville}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <p>{order.adresse.telephone}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Détails du paiement</h4>
                      <div className="space-y-2 bg-white p-4 rounded-xl">
                        <div className="flex justify-between text-gray-600">
                          <span>Sous-total</span>
                          <span>{(order.subtotal || order.total).toFixed(3)} DT</span>
                        </div>
                        {order.shippingCost !== undefined && (
                          <div className="flex justify-between text-gray-600">
                            <span>Livraison</span>
                            <span>
                              {order.shippingCost === 0
                                ? 'Gratuit'
                                : `${order.shippingCost.toFixed(3)} DT`}
                            </span>
                          </div>
                        )}
                        {order.discount && order.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>
                              Réduction
                              {order.coupon?.code && ` (${order.coupon.code})`}
                            </span>
                            <span>-{order.discount.toFixed(3)} DT</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-primary-600">{order.total.toFixed(3)} DT</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 mb-4">
                        <span className="text-lg font-semibold text-gray-900">Total de la commande</span>
                        <span className="text-2xl font-bold text-primary-600">
                          {order.total.toFixed(3)} DT
                        </span>
                      </div>

                      {onReorder && order.statut === 'Livré' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onReorder(order);
                          }}
                          disabled={reorderLoading === order._id}
                          className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {reorderLoading === order._id ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Ajout au panier...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" />
                              Commander à nouveau
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aucune commande trouvée</h2>
            <p className="text-gray-600">
              {filter !== 'all' || statusFilter
                ? 'Essayez de modifier vos filtres'
                : 'Les commandes apparaîtront ici'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
