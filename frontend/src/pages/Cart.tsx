import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotal, getItemCount } = useCart();

  const handleQuantityChange = (id: string, delta: number) => {
    updateQuantity(id, delta);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
          <p className="text-gray-600 mb-6">
            Ajoutez des produits pour commencer vos achats
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
          >
            Découvrir les produits
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 border-b">
              <div className="col-span-6">Produit</div>
              <div className="col-span-2 text-center">Prix</div>
              <div className="col-span-2 text-center">Quantité</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Cart Items List */}
            <div className="divide-y">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center"
                >
                  {/* Product Info */}
                  <div className="col-span-6 flex gap-4 mb-4 md:mb-0">
                    <img
                      src={item.image}
                      alt={item.nom}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.id}`}
                        className="font-semibold text-gray-900 hover:text-primary-600 block mb-1"
                      >
                        {item.nom}
                      </Link>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="md:hidden mt-2 text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center mb-4 md:mb-0">
                    <span className="md:hidden font-semibold">Prix : </span>
                    {item.prix.toFixed(3)} DT
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center gap-3 mb-4 md:mb-0">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      disabled={item.quantite <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantite}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Total & Remove */}
                  <div className="col-span-2 flex items-center justify-between md:justify-end gap-4">
                    <span className="font-bold text-lg text-primary-600">
                      {(item.prix * item.quantite).toFixed(3)} DT
                    </span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="hidden md:block text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé de la commande</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total ({getItemCount()} article{getItemCount() !== 1 ? 's' : ''})</span>
                <span>{getTotal().toFixed(3)} DT</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>Calculée à la prochaine étape</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">{getTotal().toFixed(3)} DT</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary-500 text-white py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 mb-3"
            >
              Passer la commande
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              to="/products"
              className="block text-center text-gray-600 hover:text-primary-600 font-medium"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
