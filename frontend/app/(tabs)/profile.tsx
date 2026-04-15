import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ nom: '', email: '' });
  const router = useRouter();

  // On vérifie le statut à chaque fois que l'écran s'affiche
  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const name = await AsyncStorage.getItem('userName');
      if (token) {
        setIsLoggedIn(true);
        setUserData({ nom: name || 'Utilisateur', email: '' });
      }
    };
    checkUser();
  }, []);

  // --- VUE VISITEUR (Basée sur ton image WhatsApp) ---
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.containerGuest}>
        <ScrollView contentContainerStyle={{padding: 25}}>
          <View style={styles.headerText}>
            <Text style={styles.mainTitle}>Authentification</Text>
            <Text style={styles.subTitle}>Connectez-vous pour accéder à votre profil</Text>
          </View>

          <View style={styles.illustrationCard}>
             <Text style={styles.emoji}>🌾</Text>
             <Text style={styles.infoText}>Gérez vos favoris, vos commandes et vos adresses en un seul endroit.</Text>
          </View>

          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => router.push('/login')} // ON REDIRIGE VERS TA PAGE LOGIN UNIQUE
          >
            <Text style={styles.btnText}>→ Aller à la page de connexion</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryBtn} 
            onPress={() => router.push('/register')}
          >
            <Text style={styles.secondaryBtnText}>Créer un compte maintenant</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- VUE UTILISATEUR CONNECTÉ ---
  return (
    <SafeAreaView style={styles.containerUser}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}><Text style={styles.avatarLetter}>{userData.nom[0]}</Text></View>
        <Text style={styles.userName}>{userData.nom}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutBtn} 
        onPress={async () => {
          await AsyncStorage.clear();
          setIsLoggedIn(false);
          router.replace('/home');
        }}
      >
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerGuest: { flex: 1, backgroundColor: '#F8FAF8' },
  headerText: { marginTop: 40, marginBottom: 30 },
  mainTitle: { fontSize: 32, fontWeight: 'bold', color: '#1E293B' },
  subTitle: { fontSize: 16, color: '#64748B', marginTop: 8 },
  illustrationCard: { backgroundColor: '#FFF', padding: 30, borderRadius: 24, alignItems: 'center', elevation: 2, marginBottom: 40 },
  emoji: { fontSize: 60, marginBottom: 15 },
  infoText: { textAlign: 'center', color: '#475569', lineHeight: 22 },
  actionBtn: { backgroundColor: '#FFB800', padding: 20, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  secondaryBtn: { marginTop: 20, alignItems: 'center' },
  secondaryBtnText: { color: '#059669', fontWeight: '600' },
  // Styles Connecté
  containerUser: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  profileHeader: { alignItems: 'center', marginBottom: 50 },
  avatarCircle: { width: 100, height: 100, backgroundColor: '#10B981', borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { fontSize: 40, color: '#FFF', fontWeight: 'bold' },
  userName: { fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  logoutBtn: { backgroundColor: '#FEE2E2', padding: 15, borderRadius: 12, width: '100%', alignItems: 'center' },
  logoutText: { color: '#EF4444', fontWeight: 'bold' }
});