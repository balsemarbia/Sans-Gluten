import { useState } from 'react';
import { Ticket, Check, X } from 'lucide-react';

interface CouponCodeProps {
  onApplyCoupon: (code: string, discount: number) => void;
  appliedCoupon?: { code: string; discount: number };
}

interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount?: number;
  expiryDate?: string;
  description: string;
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'BIENVENUE10',
    discount: 10,
    type: 'percentage',
    description: '10% de réduction sur votre première commande'
  },
  {
    code: 'SANSGLUTEN5',
    discount: 5,
    type: 'fixed',
    minAmount: 50,
    description: '5 DT de réduction à partir de 50 DT d\'achat'
  },
  {
    code: 'LIVRAISONGRAT',
    discount: 7,
    type: 'fixed',
    minAmount: 100,
    description: 'Livraison gratuite à partir de 100 DT'
  }
];

export default function CouponCode({ onApplyCoupon, appliedCoupon }: CouponCodeProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showAvailable, setShowAvailable] = useState(false);

  const validateCoupon = (couponCode: string): Coupon | null => {
    const coupon = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (!coupon) {
      setError('Code promo invalide');
      return null;
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      setError('Ce code promo a expiré');
      return null;
    }

    setError('');
    return coupon;
  };

  const handleApplyCoupon = () => {
    if (!code.trim()) {
      setError('Veuillez entrer un code promo');
      return;
    }

    const coupon = validateCoupon(code);
    if (coupon) {
      onApplyCoupon(coupon.code, coupon.discount);
      setCode('');
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon('', 0);
  };

  return (
    <div className="space-y-4">
      {/* Applied Coupon */}
      {appliedCoupon && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900">{appliedCoupon.code}</p>
                <p className="text-sm text-green-700">
                  {appliedCoupon.discount}% de réduction appliquée
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-green-700" />
            </button>
          </div>
        </div>
      )}

      {/* Coupon Input */}
      <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
              placeholder="Code promo"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
              disabled={!!appliedCoupon}
            />
          </div>
          {!appliedCoupon && (
            <button
              onClick={handleApplyCoupon}
              className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold"
            >
              Appliquer
            </button>
          )}
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* Available Coupons */}
      <div>
        <button
          onClick={() => setShowAvailable(!showAvailable)}
          className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-2"
        >
          {showAvailable ? 'Masquer' : 'Voir'} les codes promo disponibles
        </button>

        {showAvailable && (
          <div className="mt-3 space-y-2">
            {AVAILABLE_COUPONS.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-primary-900">{coupon.code}</span>
                      <span className="text-sm bg-primary-200 text-primary-800 px-2 py-0.5 rounded-full">
                        -{coupon.discount}
                        {coupon.type === 'percentage' ? '%' : ' DT'}
                      </span>
                    </div>
                    <p className="text-sm text-primary-700">{coupon.description}</p>
                    {coupon.minAmount && (
                      <p className="text-xs text-primary-600 mt-1">
                        Minimum d'achat: {coupon.minAmount} DT
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setCode(coupon.code);
                      setShowAvailable(false);
                    }}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-semibold"
                  >
                    Utiliser
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
