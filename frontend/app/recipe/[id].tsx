import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RecipeDetails() {
  const { title, duration, ingredients, instructions } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#9A3412" />
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{title || "Recette Sans Gluten"}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#EA580C" />
            <Text style={styles.infoText}>{duration || "30 min"}</Text>
            <Ionicons name="restaurant-outline" size={20} color="#EA580C" style={{marginLeft: 15}} />
            <Text style={styles.infoText}>Facile</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Ingrédients 🍎</Text>
          <View style={styles.card}>
            <Text style={styles.bodyText}>{ingredients || "Liste des ingrédients..."}</Text>
          </View>

          <Text style={styles.sectionTitle}>Préparation 👨‍🍳</Text>
          <View style={styles.card}>
            <Text style={styles.bodyText}>{instructions || "Étapes de la recette..."}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  backBtn: { marginTop: 50, marginLeft: 20, backgroundColor: '#FFF', padding: 10, borderRadius: 12, alignSelf: 'flex-start', elevation: 2 },
  header: { padding: 25 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#431407' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  infoText: { marginLeft: 5, color: '#EA580C', fontWeight: '600' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#9A3412', marginBottom: 10, marginTop: 10 },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, elevation: 2, marginBottom: 20 },
  bodyText: { fontSize: 16, color: '#475569', lineHeight: 24 }
});