import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <span>🌾</span>
              <span>Balsem</span>
            </h3>
            <p className="text-gray-400">
              Votre destination pour une vie saine sans gluten.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Boutique</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Produits</Link></li>
              <li><Link to="/recipes" className="text-gray-400 hover:text-white transition-colors">Recettes</Link></li>
              <li><Link to="/favorites" className="text-gray-400 hover:text-white transition-colors">Favoris</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4">Compte</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors">Mon Profil</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white transition-colors">Panier</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Connexion</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">contact@balsem.tn</li>
              <li className="text-gray-400">+216 XX XXX XXX</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Balsem. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
