import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Type pour nos produits
interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
}

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Pain Complet Sans Gluten', price: '4.500', description: 'Pain artisanal riche en fibres.' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // États pour le formulaire
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // Fonction pour Ajouter ou Modifier
  const handleSaveProduct = () => {
    if (!name || !price) {
      Alert.alert("Erreur", "Le nom et le prix sont obligatoires.");
      return;
    }

    if (editingProduct) {
      // Modification
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, name, price, description } : p));
    } else {
      // Ajout
      const newProduct = { id: Date.now().toString(), name, price, description };
      setProducts([...products, newProduct]);
    }
    closeModal();
  };

  const deleteProduct = (id: string) => {
    Alert.alert("Supprimer", "Voulez-vous supprimer ce produit ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => setProducts(products.filter(p => p.id !== id)) }
    ]);
  };

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
    } else {
      setEditingProduct(null);
      setName('');
      setPrice('');
      setDescription('');
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingProduct(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion Produits 🍏</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
          <Ionicons name="add-circle" size={30} color="#FFF" />
          <Text style={styles.addBtnText}>Nouveau</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price} DT</Text>
            </View>
            <View style={styles.actionBtns}>
              <TouchableOpacity onPress={() => openModal(item)} style={styles.editBtn}>
                <Ionicons name="pencil" size={20} color="#059669" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteProduct(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash" size={20} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal pour Ajouter/Modifier */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingProduct ? "Modifier" : "Ajouter"} un produit</Text>
            
            <TextInput style={styles.input} placeholder="Nom du produit" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Prix (ex: 5.500)" keyboardType="numeric" value={price} onChangeText={setPrice} />
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Description" multiline value={description} onChangeText={setDescription} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProduct}>
                <Text style={styles.saveBtnText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#064E3B' },
  addBtn: { backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12 },
  addBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },
  
  productCard: { 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 10, 
    alignItems: 'center',
    elevation: 2 
  },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  productPrice: { color: '#059669', fontWeight: '600', marginTop: 4 },
  actionBtns: { flexDirection: 'row' },
  editBtn: { backgroundColor: '#D1FAE5', padding: 8, borderRadius: 8, marginRight: 8 },
  deleteBtn: { backgroundColor: '#FEE2E2', padding: 8, borderRadius: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', width: '90%', padding: 25, borderRadius: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#064E3B', textAlign: 'center' },
  input: { backgroundColor: '#F8FAFC', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { padding: 15, flex: 1, alignItems: 'center' },
  cancelBtnText: { color: '#64748B', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#10B981', padding: 15, flex: 1, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold' }
});