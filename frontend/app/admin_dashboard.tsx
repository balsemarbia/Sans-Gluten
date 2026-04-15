import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* En-tête Admin */}
        <View style={styles.header}>
          <Text style={styles.title}>Tableau de Bord 🛠️</Text>
          <Text style={styles.subtitle}>Gestion "Sans Gluten Store"</Text>
        </View>

        {/* Statistiques Rapides */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Commandes</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
            <Text style={styles.statNumber}>1.240</Text>
            <Text style={styles.statLabel}>Revenus (DT)</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Clients</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FEE2E2' }]}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Ruptures Stock</Text>
          </View>
        </View>

        {/* Menu de Gestion */}
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        
        <AdminMenuBtn icon="📦" title="Gérer les Stocks" color="#10B981" />
        <AdminMenuBtn icon="📜" title="Voir les Commandes" color="#3B82F6" />
        <AdminMenuBtn icon="🥗" title="Publier une Recette" color="#F59E0B" />
        <AdminMenuBtn icon="👥" title="Liste des Utilisateurs" color="#6B7280" />

      </ScrollView>
    </SafeAreaView>
  );
}

// Composant Bouton de menu
const AdminMenuBtn = ({ icon, title, color }: any) => (
  <TouchableOpacity style={styles.menuBtn}>
    <View style={[styles.iconBox, { backgroundColor: color }]}>
      <Text style={{ fontSize: 20, color: '#FFF' }}>{icon}</Text>
    </View>
    <Text style={styles.menuBtnText}>{title}</Text>
    <Text style={styles.arrow}>❯</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  scroll: { padding: 20 },
  header: { marginBottom: 25 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280' },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 2 },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  statLabel: { fontSize: 12, color: '#4B5563', marginTop: 5 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginTop: 15, marginBottom: 15 },
  menuBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 18, marginBottom: 12, elevation: 1 },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuBtnText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#374151' },
  arrow: { color: '#D1D5DB' }
});