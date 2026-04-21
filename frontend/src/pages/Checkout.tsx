import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { apiCall, getToken } from '@/constants/api';
import { useState } from 'react';
import { MapPin, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    nom: '',
    adresse: '',
    ville: '',
    codePostal: '',
    telephone: ''
  });

  if (cartItems.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Panier vide</h1>
          <p className="text-gray-600 mb-6">Ajoutez des produits avant de passer la commande</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
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
      clearCart();
      navigate('/profile?order=' + response.order._id);
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(error.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour au panier
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

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
                  onChange={(e) => setShippingForm({ ...shippingForm, nom: e.target.value })}
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
                  onChange={(e) => setShippingForm({ ...shippingForm, adresse: e.target.value })}
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
                    onChange={(e) => setShippingForm({ ...shippingForm, ville: e.target.value })}
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
                    onChange={(e) => setShippingForm({ ...shippingForm, codePostal: e.target.value })}
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
                  onChange={(e) => setShippingForm({ ...shippingForm, telephone: e.target.value })}
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
              {cartItems.map((item) => (
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
                <span>{getTotal().toFixed(3)} DT</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>7.000 DT</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">{(getTotal() + 7).toFixed(3)} DT</span>
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
