import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Recipe {
  id: string;
  title: string;
  duration: string;
  ingredients: string;
  instructions: string;
}

export default function ManageRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([
    { 
      id: '1', 
      title: 'Gâteau Chocolat Sans Gluten', 
      duration: '45 min', 
      ingredients: 'Farine de riz, Cacao, Œufs...',
      instructions: 'Mélanger et cuire à 180°C.' 
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // États du formulaire
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSave = () => {
    if (!title || !duration) {
      Alert.alert("Erreur", "Le titre et le temps sont obligatoires.");
      return;
    }

    const recipeData = { 
      id: editingRecipe ? editingRecipe.id : Date.now().toString(), 
      title, duration, ingredients, instructions 
    };

    if (editingRecipe) {
      setRecipes(recipes.map(r => r.id === editingRecipe.id ? recipeData : r));
    } else {
      setRecipes([...recipes, recipeData]);
    }
    closeModal();
  };

  const deleteRecipe = (id: string) => {
    Alert.alert("Supprimer", "Supprimer cette recette ?", [
      { text: "Non" },
      { text: "Oui", style: "destructive", onPress: () => setRecipes(recipes.filter(r => r.id !== id)) }
    ]);
  };

  const openModal = (recipe: Recipe | null = null) => {
    if (recipe) {
      setEditingRecipe(recipe);
      setTitle(recipe.title);
      setDuration(recipe.duration);
      setIngredients(recipe.ingredients);
      setInstructions(recipe.instructions);
    } else {
      setEditingRecipe(null);
      setTitle('');
      setDuration('');
      setIngredients('');
      setInstructions('');
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingRecipe(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Orange pour différencier des Produits */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestion Recettes 👨‍🍳</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
          <Ionicons name="restaurant" size={20} color="#FFF" />
          <Text style={styles.addBtnText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <Text style={styles.recipeTime}><Ionicons name="time-outline" /> {item.duration}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openModal(item)} style={styles.editBtn}>
                <Ionicons name="pencil" size={18} color="#EA580C" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteRecipe(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash" size={18} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{editingRecipe ? "Modifier" : "Nouvelle"} Recette</Text>
              
              <TextInput style={styles.input} placeholder="Nom de la recette" value={title} onChangeText={setTitle} />
              <TextInput style={styles.input} placeholder="Temps (ex: 30 min)" value={duration} onChangeText={setDuration} />
              <TextInput style={[styles.input, { height: 80 }]} placeholder="Ingrédients" multiline value={ingredients} onChangeText={setIngredients} />
              <TextInput style={[styles.input, { height: 100 }]} placeholder="Instructions de préparation" multiline value={instructions} onChangeText={setInstructions} />

              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={closeModal} style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                  <Text style={styles.saveText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' }, // Fond légèrement orangé
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#9A3412' },
  addBtn: { backgroundColor: '#EA580C', flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12 },
  addBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },

  card: { backgroundColor: '#FFF', flexDirection: 'row', padding: 15, borderRadius: 15, marginBottom: 12, elevation: 3 },
  recipeTitle: { fontSize: 16, fontWeight: 'bold', color: '#431407' },
  recipeTime: { color: '#EA580C', marginTop: 5, fontSize: 13 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  editBtn: { backgroundColor: '#FFEDD5', padding: 8, borderRadius: 8, marginRight: 8 },
  deleteBtn: { backgroundColor: '#FEE2E2', padding: 8, borderRadius: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalContent: { backgroundColor: '#FFF', margin: 20, padding: 20, borderRadius: 25, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#9A3412', textAlign: 'center' },
  input: { backgroundColor: '#F9FAFB', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#FED7AA', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', marginTop: 10 },
  cancelBtn: { flex: 1, padding: 15, alignItems: 'center' },
  cancelText: { color: '#94A3B8', fontWeight: 'bold' },
  saveBtn: { flex: 1, backgroundColor: '#EA580C', padding: 15, borderRadius: 12, alignItems: 'center' },
  saveText: { color: '#FFF', fontWeight: 'bold' }
});