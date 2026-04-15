import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CheckoutScreen() {
  const router = useRouter();
  const [method, setMethod] = useState('card'); // 'card' ou 'cash'

  const handlePayment = () => {
    Alert.alert("Succès", "Commande validée ! Vous allez recevoir un email de confirmation.", [
      { text: "OK", onPress: () => router.replace('/home') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 25 }}>
        <Text style={styles.label}>Adresse de livraison 📍</Text>
        <TextInput style={styles.input} placeholder="Ex: 123 Rue de la Liberté, Tunis" multiline />

        <Text style={styles.label}>Mode de paiement 💳</Text>
        <TouchableOpacity 
          style={[styles.methodBtn, method === 'card' && styles.activeMethod]} 
          onPress={() => setMethod('card')}
        >
          <Text>💳 Carte Bancaire / E-Dinar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.methodBtn, method === 'cash' && styles.activeMethod]} 
          onPress={() => setMethod('cash')}
        >
          <Text>💵 Paiement à la livraison</Text>
        </TouchableOpacity>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Résumé</Text>
          <View style={styles.row}><Text>Sous-total</Text><Text>10.900 DT</Text></View>
          <View style={styles.row}><Text>Livraison</Text><Text>5.000 DT</Text></View>
          <View style={[styles.row, {marginTop: 10}]}><Text style={{fontWeight:'bold'}}>Total</Text><Text style={styles.totalText}>15.900 DT</Text></View>
        </View>

        <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
          <Text style={styles.payBtnText}>Payer & Confirmer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#064E3B', marginTop: 20, marginBottom: 10 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 15, height: 80, textAlignVertical: 'top' },
  methodBtn: { padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
  activeMethod: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  summaryCard: { backgroundColor: '#F8FAF8', borderRadius: 20, padding: 20, marginTop: 30 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#10B981' },
  payBtn: { backgroundColor: '#10B981', height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  payBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});