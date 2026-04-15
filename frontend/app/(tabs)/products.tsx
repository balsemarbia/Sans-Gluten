import React, { useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ALL_PRODUCTS = [
  { id: '1', nom: 'Farine de Riz', prix: '5.800', img: 'https://images.unsplash.com/photo-1508746822551-9da09ef78a56?w=400' },
  { id: '2', nom: 'Pâtes de Maïs', prix: '4.200', img: 'https://images.unsplash.com/photo-1551462147-37885acc3c41?w=400' },
  { id: '3', nom: 'Pain de Mie', prix: '6.500', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
  { id: '4', nom: 'Muesli Sans Gluten', prix: '8.900', img: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400' },
];

export default function ProductsScreen() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre de recherche spécifique aux produits */}
      <View style={styles.searchHeader}>
        <Text style={styles.title}>Notre Boutique 🛒</Text>
        <View style={styles.searchBar}>
          <Text>🔍</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Chercher un produit..." 
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={ALL_PRODUCTS}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.img }} style={styles.productImg} />
            <Text style={styles.productName}>{item.nom}</Text>
            <Text style={styles.productPrice}>{item.prix} DT</Text>
            <TouchableOpacity style={styles.addBtn}><Text style={styles.addBtnText}>Ajouter</Text></TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  searchHeader: { padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#064E3B', marginBottom: 15 },
  searchBar: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 15, padding: 12, alignItems: 'center' },
  input: { marginLeft: 10, flex: 1 },
  list: { padding: 10 },
  productCard: { flex: 1, backgroundColor: '#FFF', margin: 8, borderRadius: 20, padding: 12, elevation: 3, alignItems: 'center' },
  productImg: { width: '100%', height: 120, borderRadius: 15 },
  productName: { fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  productPrice: { color: '#10B981', fontWeight: 'bold', marginVertical: 5 },
  addBtn: { backgroundColor: '#10B981', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 10 },
  addBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' }
});