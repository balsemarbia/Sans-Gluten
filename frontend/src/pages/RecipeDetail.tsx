import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '@/constants/api';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, ChefHat } from 'lucide-react';
import FavoriteButton from '@/components/ui/FavoriteButton';

interface Recipe {
  _id: string;
  titre: string;
  description: string;
  image: string;
  temps: string;
  difficulte: string;
  portions: number;
  ingredients: string[];
  instructions: string[];
}

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRecipe(id);
    }
  }, [id]);

  const fetchRecipe = async (recipeId: string) => {
    try {
      setLoading(true);
      const data = await apiCall(`/recipes/${recipeId}`);
      setRecipe(data);
    } catch (error: any) {
      console.error('Error fetching recipe:', error);
      navigate('/recipes', { replace: true });
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

  if (!recipe) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Recette non trouvée</h1>
        <Link to="/recipes" className="text-primary-600 font-semibold hover:text-primary-700">
          Retour aux recettes
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-gray-600">
          <li><Link to="/" className="hover:text-primary-600">Accueil</Link></li>
          <li>/</li>
          <li><Link to="/recipes" className="hover:text-primary-600">Recettes</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{recipe.titre}</li>
        </ol>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-primary-600 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      {/* Recipe Header */}
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Recipe Image */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.titre}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Recipe Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {recipe.titre}
            </h1>
            <FavoriteButton
              itemId={recipe._id}
              type="recipe"
              className="p-3 rounded-full"
              iconClassName="w-6 h-6"
            />
          </div>

          {recipe.description && (
            <p className="text-gray-600 text-lg mb-6">{recipe.description}</p>
          )}

          {/* Recipe Meta */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs text-gray-500">Temps</p>
                <p className="font-semibold">{recipe.temps}</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs text-gray-500">Portions</p>
                <p className="font-semibold">{recipe.portions || 2} personnes</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs text-gray-500">Difficulté</p>
                <p className="font-semibold">{recipe.difficulte}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients & Instructions */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ingrédients</h2>
            <ul className="space-y-3">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Aucun ingrédient listé</li>
              )}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Préparation</h2>
            <ol className="space-y-4">
              {recipe.instructions && recipe.instructions.length > 0 ? (
                recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 pt-1">{instruction}</p>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Aucune instruction disponible</li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
