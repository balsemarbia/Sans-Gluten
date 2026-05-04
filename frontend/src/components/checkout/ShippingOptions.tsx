import { useState, useEffect } from 'react';
import { Truck, Clock, Home, Store } from 'lucide-react';

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: any;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Livraison standard',
    description: 'Livraison à domicile en 3-5 jours ouvrés',
    price: 7,
    estimatedDays: '3-5 jours ouvrés',
    icon: Truck
  },
  {
    id: 'express',
    name: 'Livraison express',
    description: 'Livraison accélérée en 24-48h',
    price: 12,
    estimatedDays: '24-48h',
    icon: Clock
  },
  {
    id: 'pickup',
    name: 'Retrait en magasin',
    description: 'Récupérez votre commande en magasin',
    price: 0,
    estimatedDays: 'Disponible immédiatement',
    icon: Store
  },
  {
    id: 'relay',
    name: 'Point relais',
    description: 'Livraison dans un point relais proche',
    price: 5,
    estimatedDays: '2-3 jours ouvrés',
    icon: Home
  }
];

interface ShippingOptionsProps {
  onShippingChange: (option: ShippingOption) => void;
  selectedOption?: ShippingOption;
  subtotal: number;
}

export default function ShippingOptions({ onShippingChange, selectedOption, subtotal }: ShippingOptionsProps) {
  const [selected, setSelected] = useState<ShippingOption | undefined>(selectedOption);

  useEffect(() => {
    setSelected(selectedOption);
  }, [selectedOption]);

  const handleSelectOption = (option: ShippingOption) => {
    setSelected(option);
    onShippingChange(option);
  };

  // Free shipping for orders over 100 DT
  const hasFreeShipping = subtotal >= 100;
  const adjustedOptions = SHIPPING_OPTIONS.map(option => ({
    ...option,
    price: (option.id === 'standard' || option.id === 'relay') && hasFreeShipping ? 0 : option.price
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">Options de livraison</h3>
        {hasFreeShipping && (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
            <Truck className="w-4 h-4" />
            Livraison gratuite offerte !
          </span>
        )}
      </div>

      <div className="space-y-3">
        {adjustedOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selected?.id === option.id;

          return (
            <div
              key={option.id}
              onClick={() => handleSelectOption(option)}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-primary-500' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className={`font-semibold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                        {option.name}
                                                      </p>
                                                      <p className={`text-sm ${isSelected ? 'text-primary-700' : 'text-gray-600'}`}>
                                                        {option.description}
                                                      </p>
                                                    </div>
                                                    <div className="text-right">
                                                      {option.price === 0 ? (
                                                        <span className={`font-bold ${isSelected ? 'text-green-600' : 'text-green-700'}`}>
                                                          Gratuit
                                                        </span>
                                                      ) : (
                                                        <span className={`font-bold ${isSelected ? 'text-primary-600' : 'text-gray-900'}`}>
                                                          {option.price.toFixed(3)} DT
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {option.estimatedDays}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                };
