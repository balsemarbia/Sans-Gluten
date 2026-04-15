import React, { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// --- DONNÉES FICTIVES (À lier plus tard à votre BDD MySQL) ---
const PRODUCT_DATA = [
  { id: '1', nom: 'Pain Complet', prix: '4.500', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300' },
  { id: '2', nom: 'Cookies Choco', prix: '3.200', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=300' },
  { id: '3', nom: 'Farine de Riz', prix: '5.800', image: 'https://images.unsplash.com/photo-1508746822551-9da09ef78a56?q=80&w=300' },
];

const RECIPE_DATA = [
  { 
    id: '1', 
    titre: 'Bol de Riz Santé', 
    temps: '20 min', 
    desc: 'Un mélange nutritif de légumes frais et riz basmati sans gluten.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500' 
  },
  { 
    id: '2', 
    titre: 'Salade de Quinoa', 
    temps: '15 min', 
    desc: 'Fraîcheur garantie avec cette salade riche en protéines.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500' 
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- 1. HEADER & BIENVENUE --- */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerSubtitle}>Mangez sain, mangez sans gluten.</Text>
        </View>

        {/* --- 2. BARRE DE RECHERCHE DYNAMIQUE --- */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Chercher un produit, une recette..." 
              placeholderTextColor="#94A3B8"
              value={searchQuery} 
              onChangeText={(text) => setSearchQuery(text)} 
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={{fontSize: 20}}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* --- 3. BANNIÈRE PROMO (HERO) --- */}
        <View style={styles.hero}>
           <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>-20% sur les Farines Bio</Text>
            <TouchableOpacity style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Profiter</Text>
            </TouchableOpacity>
           </View>
           <Text style={styles.heroEmoji}>🌾</Text>
        </View>

        {/* --- 4. SECTION PRODUITS (Horizontal) --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produits Populaires</Text>
          <TouchableOpacity><Text style={styles.seeAllText}>Voir tout</Text></TouchableOpacity>
        </View>
        
        <FlatList
          data={PRODUCT_DATA}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingBottom: 15 }}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImg} />
              <Text style={styles.productName} numberOfLines={1}>{item.nom}</Text>
              <View style={styles.productFooter}>
                <Text style={styles.productPrice}>{item.prix} DT</Text>
                <TouchableOpacity style={styles.addBtn}>
                  <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* --- 5. SECTION RECETTES (Vertical) --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recettes du jour</Text>
        </View>

        {RECIPE_DATA.map((recipe) => (
          <TouchableOpacity key={recipe.id} style={styles.recipeCard} activeOpacity={0.9}>
            <Image source={{ uri: recipe.image }} style={styles.recipeImg} />
            <View style={styles.recipeBadge}>
              <Text style={styles.recipeBadgeText}>⏱ {recipe.temps}</Text>
            </View>
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{recipe.titre}</Text>
              <Text style={styles.recipeDesc} numberOfLines={2}>{recipe.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  scrollContent: { paddingBottom: 20 },
  headerContainer: { paddingHorizontal: 25, paddingTop: 20 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#064E3B' },
  headerSubtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },

  // Barre de recherche
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, marginBottom: 10 },
  searchBar: { 
    flex: 1, flexDirection: 'row', backgroundColor: '#FFF', 
    borderRadius: 15, alignItems: 'center', paddingHorizontal: 15, 
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 50, color: '#1E293B', fontSize: 15 },
  filterBtn: { 
    backgroundColor: '#10B981', width: 50, height: 50, borderRadius: 15, 
    marginLeft: 10, justifyContent: 'center', alignItems: 'center', elevation: 3 
  },

  // Hero Banner
  hero: { 
    backgroundColor: '#10B981', margin: 20, borderRadius: 25, padding: 20, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' 
  },
  heroTextContainer: { flex: 1 },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  heroBtn: { backgroundColor: '#FFF', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, marginTop: 12, alignSelf: 'flex-start' },
  heroBtnText: { color: '#10B981', fontWeight: 'bold', fontSize: 13 },
  heroEmoji: { fontSize: 55, opacity: 0.9 },

  // Sections
  sectionTitle: { fontSize: 19, fontWeight: 'bold', color: '#064E3B', marginLeft: 20, marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20, marginBottom: 10 },
  seeAllText: { color: '#10B981', fontWeight: '600', marginTop: 10 },

  // Cartes Produits
  productCard: { 
    backgroundColor: '#FFF', marginRight: 15, borderRadius: 20, padding: 12, 
    width: 160, elevation: 5, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 
  },
  productImg: { width: '100%', height: 110, borderRadius: 15 },
  productName: { fontWeight: 'bold', marginTop: 10, color: '#1E293B', fontSize: 15 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  productPrice: { color: '#10B981', fontWeight: 'bold', fontSize: 14 },
  addBtn: { backgroundColor: '#10B981', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },

  // Cartes Recettes
  recipeCard: { 
    backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 15, borderRadius: 25, 
    overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1 
  },
  recipeImg: { width: '100%', height: 190 },
  recipeBadge: { 
    position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(255,255,255,0.95)', 
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 
  },
  recipeBadgeText: { fontWeight: 'bold', fontSize: 12, color: '#064E3B' },
  recipeInfo: { padding: 18 },
  recipeTitle: { fontSize: 19, fontWeight: 'bold', color: '#064E3B' },
  recipeDesc: { color: '#64748B', fontSize: 13, marginTop: 6, lineHeight: 19 },
});