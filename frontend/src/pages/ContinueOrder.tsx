import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { apiCall, getToken } from '@/constants/api';
import { useState, useEffect } from 'react';
import { MapPin, CreditCard, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';

interface SavedOrderData {
  items: Array<{
    id: string;
    nom: string;
    prix: number;
    quantite: number;
    image: string;
  }>;
  total: number;
  shippingForm: {
    nom: string;
    adresse: string;
    ville: string;
    codePostal: string;
    telephone: string;
  };
  savedAt: string;
}

const SHIPPING_COST = 7;

export default function ContinueOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartItems, setCartItems, clearCart, getTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [savedData, setSavedData] = useState<SavedOrderData | null>(null);
  const [shippingForm, setShippingForm] = useState({
    nom: '',
    adresse: '',
    ville: '',
    codePostal: '',
    telephone: ''
  });

  useEffect(() => {
    loadSavedOrder();
  }, []);

  const loadSavedOrder = () => {
    try {
      const savedOrderJson = localStorage.getItem('incompleteOrder');
      const orderId = searchParams.get('order');

      if (orderId) {
        // Load from specific order ID (from database)
        loadOrderFromDB(orderId);
      } else if (savedOrderJson) {
        // Load from localStorage
        const data: SavedOrderData = JSON.parse(savedOrderJson);
        setSavedData(data);
        setShippingForm(data.shippingForm);
        setCartItems(data.items);
        setRestoring(false);
      } else {
        // No saved order found
        setRestoring(false);
      }
    } catch (error) {
      console.error('Error loading saved order:', error);
      setRestoring(false);
    }
  };

  const loadOrderFromDB = async (orderId: string) => {
    try {
      const token = getToken();
      if (!token) {
        navigate('/login', { state: { from: { pathname: '/continue-order' } } });
        return;
      }

      const order = await apiCall(`/orders/${orderId}`, 'GET', undefined, token);

      if (order.statut === 'Brouillon' || order.statut === 'En cours') {
        // Restore items to cart
        const items = order.items.map((item: any) => ({
          id: item.productId?._id || item.productId,
          nom: item.nom,
          prix: item.prix,
          quantite: item.quantite,
          image: item.productId?.image || ''
        }));
        setCartItems(items);

        // Set shipping form
        const formData = {
          nom: order.adresse?.nom || '',
          adresse: order.adresse?.rue || '',
          ville: order.adresse?.ville || '',
          codePostal: order.adresse?.codePostal || '',
          telephone: order.adresse?.telephone || ''
        };
        setShippingForm(formData);

        setSavedData({
          items,
          total: order.total,
          shippingForm: formData,
          savedAt: order.date
        });
      } else {
        alert('Cette commande ne peut pas être modifiée.');
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Error loading order:', error);
      alert('Erreur lors du chargement de la commande');
      navigate('/profile');
    } finally {
      setRestoring(false);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem('incompleteOrder');
    clearCart();
    navigate('/products');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      navigate('/login', { state: { from: { pathname: '/continue-order' } } });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          produit: item.id,
          quantite: item.quantite
        })),
        adresse: {
          nom: shippingForm.nom,
          rue: shippingForm.adresse,
          ville: shippingForm.ville,
          codePostal: shippingForm.codePostal,
          telephone: shippingForm.telephone
        }
      };

      const response = await apiCall('/orders', 'POST', orderData, token);
      localStorage.removeItem('incompleteOrder');
      clearCart();
      navigate('/profile?order=' + response.order._id);
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(error.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (restoring) {
    return (
      <div className="container py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="ml-4 text-gray-600">Restauration de votre commande...</p>
        </div>
      </div>
    );
  }

  if (!savedData || savedData.items.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Aucune commande à poursuivre</h1>
          <p className="text-gray-600 mb-6">
            Vous n'avez aucune commande en cours. Commencez vos achats dès maintenant !
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
            >
              Voir les produits
            </Link>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              Mon panier
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const savedDate = new Date(savedData.savedAt);
  const timeDiff = Math.floor((Date.now() - savedDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="container py-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour au panier
      </Link>

      {/* Saved Order Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-900">Commande sauvegardée</p>
              <p className="text-sm text-blue-700">
                {timeDiff === 0
                  ? 'Sauvegardée aujourd\'hui'
                  : timeDiff === 1
                  ? 'Sauvegardée hier'
                  : `Sauvegardée il y a ${timeDiff} jours`}
              </p>
            </div>
          </div>
          <button
            onClick={discardDraft}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Poursuivre ma commande</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary-600" />
              Adresse de livraison
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nom complet</label>
                <input
                  type="text"
                  required
                  placeholder="Jean Dupont"
                  value={shippingForm.nom}
                  onChange={(e) => {
                    setShippingForm({ ...shippingForm, nom: e.target.value });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Adresse</label>
                <input
                  type="text"
                  required
                  placeholder="123 Rue de la République"
                  value={shippingForm.adresse}
                  onChange={(e) => {
                    setShippingForm({ ...shippingForm, adresse: e.target.value });
                                      }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Ville</label>
                  <input
                    type="text"
                    required
                    placeholder="Tunis"
                    value={shippingForm.ville}
                    onChange={(e) => {
                      setShippingForm({ ...shippingForm, ville: e.target.value });
                                          }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Code postal</label>
                  <input
                    type="text"
                    required
                    placeholder="1001"
                    value={shippingForm.codePostal}
                    onChange={(e) => {
                      setShippingForm({ ...shippingForm, codePostal: e.target.value });
                                          }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Téléphone</label>
                <input
                  type="tel"
                  required
                  placeholder="+216 XX XXX XXX"
                  value={shippingForm.telephone}
                  onChange={(e) => {
                    setShippingForm({ ...shippingForm, telephone: e.target.value });
                                      }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </form>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary-600" />
              Paiement
            </h2>

            <p className="text-gray-600 mb-4">
              Le paiement à la livraison est actuellement disponible.
            </p>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-900">Paiement à la livraison</p>
              <p className="text-sm text-gray-600">Payez en espèces ou par carte à la réception</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>

            <div className="space-y-4 mb-6">
              {savedData.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.nom}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.nom}</p>
                    <p className="text-sm text-gray-500">Qté: {item.quantite}</p>
                  </div>
                  <p className="font-bold text-primary-600">
                    {(item.prix * item.quantite).toFixed(3)} DT
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{savedData.total.toFixed(3)} DT</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{SHIPPING_COST.toFixed(3)} DT</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">{(savedData.total + SHIPPING_COST).toFixed(3)} DT</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary-500 text-white py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? 'Traitement...' : (
                <>
                  Confirmer la commande
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
