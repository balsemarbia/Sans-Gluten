import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const INITIAL_CART = [
  { id: '1', nom: 'Pain Complet', prix: 4.500, quantite: 1, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300' },
  { id: '2', nom: 'Cookies Choco', prix: 3.200, quantite: 2, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=300' },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const router = useRouter();

  const total = cartItems.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

  const updateQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantite: Math.max(1, item.quantite + delta) } : item
    ));
  };

  const handleCheckout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert(
          "Identification requise",
          "Vous devez être connecté pour finaliser votre commande.",
          [
            { text: "Créer un compte", onPress: () => router.push('/register') },
            { text: "Se connecter", onPress: () => router.push('/login') },
            { text: "Annuler", style: "cancel" }
          ]
        );
        return;
      }

      const response = await fetch('http://192.168.1.17:5000/api/orders/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          items: cartItems,
          total: total
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succès ! 🎉", "Votre commande a été enregistrée.");
        setCartItems([]); 
        router.replace('/home');
      } else {
        Alert.alert("Erreur", data.message || "Impossible de valider la commande.");
      }
    } catch (error) {
      Alert.alert("Erreur réseau", "Le serveur est injoignable.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Panier 🛒</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartCard}>
            <Image source={{ uri: item.image }} style={styles.itemImg} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.nom}</Text>
              <Text style={styles.itemPrice}>{item.prix.toFixed(3)} DT</Text>
              <View style={styles.qtyContainer}>
                <TouchableOpacity onPress={() => updateQty(item.id, -1)} style={styles.qtyBtn}><Text>-</Text></TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantite}</Text>
                <TouchableOpacity onPress={() => updateQty(item.id, 1)} style={styles.qtyBtn}><Text>+</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total à payer :</Text>
          <Text style={styles.totalAmount}>{total.toFixed(3)} DT</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Confirmer la commande</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  header: { padding: 20, backgroundColor: '#FFF', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#064E3B' },
  cartCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginHorizontal: 20, marginBottom: 15, elevation: 3 },
  itemImg: { width: 80, height: 80, borderRadius: 15 },
  itemInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  itemPrice: { color: '#10B981', fontWeight: 'bold', marginTop: 4 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  qtyBtn: { width: 30, height: 30, backgroundColor: '#F1F5F9', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  qtyText: { marginHorizontal: 15, fontWeight: 'bold' },
  footer: { backgroundColor: '#FFF', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  totalLabel: { fontSize: 16, color: '#64748B' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#064E3B' },
  checkoutBtn: { backgroundColor: '#10B981', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  checkoutText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});