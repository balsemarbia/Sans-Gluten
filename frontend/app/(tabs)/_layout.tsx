import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function TabLayout() {
  // Plus tard, ce chiffre (3) pourra provenir de votre base de données ou d'un State global
  const cartCount = 3; 

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#10B981',
      tabBarInactiveTintColor: '#94A3B8',
      tabBarStyle: styles.tabBar,
      headerShown: false,
    }}>
      
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />

      {/* ONGLET PANIER AVEC BADGE */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🛒</Text>,
          tabBarBadge: cartCount > 0 ? cartCount : undefined, // Affiche le badge seulement s'il y a des articles
          tabBarBadgeStyle: { backgroundColor: '#EF4444', color: 'white', fontSize: 10 }, // Rouge pour attirer l'attention
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
      <Tabs.Screen
         name="favorites"
         options={{
           title: 'Favoris',
           tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>❤️</Text>,
        }}
      />
      <Tabs.Screen
  name="products"
  options={{
    title: 'Boutique',
    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🛍️</Text>,
  }}
/>

<Tabs.Screen
  name="recipes"
  options={{
    title: 'Recettes',
    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📖</Text>,
  }}
/>






    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    height: 65,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingBottom: 10,
    paddingTop: 10,
  }
});