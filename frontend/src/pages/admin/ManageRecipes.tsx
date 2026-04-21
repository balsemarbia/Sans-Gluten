import { Link, useNavigate } from 'react-router-dom';
import { apiCall, getToken } from '@/constants/api';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';

interface Recipe {
  _id: string;
  titre: string;
  description: string;
  image: string;
  temps: string;
  difficulte: string;
  portions: number;
}

export default function ManageRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    image: '',
    temps: '30 min',
    difficulte: 'Facile',
    portions: '2',
    ingredients: '',
    instructions: ''
  });

  const difficulties = ['Facile', 'Moyen', 'Difficile'];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }
      const data = await apiCall('/recipes', 'GET', undefined, token);
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      titre: recipe.titre,
      description: recipe.description,
      image: recipe.image,
      temps: recipe.temps,
      difficulte: recipe.difficulte,
      portions: recipe.portions.toString(),
      ingredients: '',
      instructions: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) return;

    try {
      const token = getToken();
      await apiCall(`/recipes/${id}`, 'DELETE', undefined, token);
      setRecipes(recipes.filter(r => r._id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      const recipeData = {
        titre: formData.titre,
        description: formData.description,
        image: formData.image,
        temps: formData.temps,
        difficulte: formData.difficulte,
        portions: parseInt(formData.portions),
        ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
        instructions: formData.instructions.split('\n').filter(i => i.trim())
      };

      if (editingRecipe) {
        await apiCall(`/recipes/${editingRecipe._id}`, 'PUT', recipeData, token);
        setRecipes(recipes.map(r => r._id === editingRecipe._id ? { ...r, ...recipeData } : r));
      } else {
        const newRecipe = await apiCall('/recipes', 'POST', recipeData, token);
        setRecipes([...recipes, newRecipe.recipe]);
      }

      setShowModal(false);
      setEditingRecipe(null);
      resetForm();
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      image: '',
      temps: '30 min',
      difficulte: 'Facile',
      portions: '2',
      ingredients: '',
      instructions: ''
    });
  };

  const filteredRecipes = recipes.filter(r =>
    r.titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gérer les recettes</h1>
          <p className="text-gray-600">{recipes.length} recette{recipes.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingRecipe(null);
            setShowModal(true);
          }}
          className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouvelle recette
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une recette..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div key={recipe._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.titre}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{recipe.titre}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                  {recipe.temps}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  recipe.difficulte === 'Facile' ? 'bg-green-100 text-green-700' :
                  recipe.difficulte === 'Moyen' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {recipe.difficulte}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(recipe)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(recipe._id)}
                  className="p-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingRecipe ? 'Modifier la recette' : 'Nouvelle recette'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingRecipe(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Titre</label>
                <input
                  type="text"
                  required
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Temps</label>
                  <input
                    type="text"
                    required
                    value={formData.temps}
                    onChange={(e) => setFormData({ ...formData, temps: e.target.value })}
                    placeholder="30 min"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Difficulté</label>
                  <select
                    value={formData.difficulte}
                    onChange={(e) => setFormData({ ...formData, difficulte: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {difficulties.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Portions</label>
                  <input
                    type="number"
                    required
                    value={formData.portions}
                    onChange={(e) => setFormData({ ...formData, portions: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Ingrédients (un par ligne)
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  rows={5}
                  placeholder="- 200g de farine sans gluten&#10;- 3 oeufs&#10;- 100ml de lait"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Instructions (une par ligne)
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  rows={6}
                  placeholder="1. Mélanger la farine et les oeufs&#10;2. Ajouter le lait progressivement&#10;3. Cuire à feu doux"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRecipe(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                >
                  {editingRecipe ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
