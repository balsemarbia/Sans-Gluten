import { Link } from 'react-router-dom';
import { apiCall } from '@/constants/api';
import { useState, useEffect } from 'react';
import { Clock, Star } from 'lucide-react';
import FavoriteButton from '@/components/ui/FavoriteButton';

interface Recipe {
  _id: string;
  titre: string;
  description: string;
  image: string;
  temps: string;
  difficulte: string;
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/recipes');
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Recettes Sans Gluten
        </h1>
        <p className="text-gray-600">
          Découvrez nos délicieuses recettes pour une vie saine
        </p>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe._id}
              to={`/recipes/${recipe._id}`}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.titre}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <FavoriteButton
                  itemId={recipe._id}
                  type="recipe"
                  className="absolute top-4 left-4 p-2 rounded-full"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-semibold text-primary-600">{recipe.temps}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {recipe.titre}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {recipe.description || 'Découvrez cette délicieuse recette sans gluten.'}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    recipe.difficulte === 'Facile' ? 'bg-green-100 text-green-700' :
                    recipe.difficulte === 'Moyen' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    <Star className="w-3 h-3 inline mr-1" />
                    {recipe.difficulte}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl shadow-md">
          <p className="text-gray-500 text-lg">Aucune recette disponible</p>
        </div>
      )}
    </div>
  );
}
