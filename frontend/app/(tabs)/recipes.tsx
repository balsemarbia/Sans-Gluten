import React, { useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ALL_RECIPES = [
  { id: '1', titre: 'Pizza Sans Gluten', temps: '30 min', diff: 'Facile', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
  { id: '2', titre: 'Gâteau au Chocolat', temps: '45 min', diff: 'Moyen', img: 'https://images.unsplash.com/photo-1564035032355-ba58bf800a69?w=500' },
];

export default function RecipesScreen() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        <Text style={styles.title}>Recettes & Astuces 👨‍🍳</Text>
        <View style={styles.searchBar}>
          <Text>🔍</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Trouver une recette..." 
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={ALL_RECIPES}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeCard}>
            <Image source={{ uri: item.img }} style={styles.recipeImg} />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{item.titre}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badge}><Text style={styles.badgeText}>⏱ {item.temps}</Text></View>
                <View style={[styles.badge, {backgroundColor: '#D1FAE5'}]}><Text style={styles.badgeText}>🌟 {item.diff}</Text></View>
              </View>
            </View>
          </TouchableOpacity>
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
  recipeCard: { backgroundColor: '#FFF', borderRadius: 25, marginBottom: 20, overflow: 'hidden', elevation: 4 },
  recipeImg: { width: '100%', height: 200 },
  recipeInfo: { padding: 15 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  badgeRow: { flexDirection: 'row', marginTop: 10 },
  badge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, marginRight: 10 },
  badgeText: { fontSize: 12, color: '#064E3B', fontWeight: '500' }
});