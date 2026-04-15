import React, { useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const INITIAL_FAVORITES = [
  { id: '1', titre: 'Pain de Campagne Sans Gluten', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', type: 'Recette' },
  { id: '2', titre: 'Cookies aux Pépites de Chocolat', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=300', type: 'Produit' },
];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Favoris ❤️</Text>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.favCard}>
              <Image source={{ uri: item.image }} style={styles.favImg} />
              <View style={styles.favInfo}>
                <Text style={styles.favType}>{item.type}</Text>
                <Text style={styles.favName}>{item.titre}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.removeBtn}>
                <Text style={{color: '#EF4444'}}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={{fontSize: 50}}>🍃</Text>
          <Text style={styles.emptyText}>Aucun favori pour le moment.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  header: { padding: 20, backgroundColor: '#FFF', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#064E3B' },
  favCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 12, marginBottom: 15, alignItems: 'center', elevation: 2 },
  favImg: { width: 70, height: 70, borderRadius: 12 },
  favInfo: { flex: 1, marginLeft: 15 },
  favType: { fontSize: 12, color: '#10B981', fontWeight: 'bold', textTransform: 'uppercase' },
  favName: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginTop: 2 },
  removeBtn: { padding: 10 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 10, color: '#64748B', fontSize: 16 }
});