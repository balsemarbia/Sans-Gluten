import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // 1. Vérification des champs
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      console.log("Tentative de connexion vers le serveur... testtttttt");

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Connexion réussie ! Stockage des données...");

        // 2. STOCKAGE DU TOKEN ET DU NOM (Indispensable pour ton scénario)
        // data.token et data.user.nom doivent correspondre à ce que renvoie ton BACKEND
        await AsyncStorage.setItem('userToken', data.token);
        if (data.user && data.user.nom) {
          await AsyncStorage.setItem('userName', data.user.nom);
        }

        // 3. REDIRECTION VERS HOME
        Alert.alert("Succès", "Connexion réussie ! 🎉");
        router.replace('/home'); 
      } else {
        // Le serveur a répondu mais avec une erreur (ex: 400 ou 401)
        Alert.alert("Erreur", data.message || "Email ou mot de passe incorrect.");
      }
    } catch (error) {
      // Le téléphone n'a même pas pu toucher le serveur
      console.error("Erreur Fetch détaillée:", error);
      Alert.alert(
        "Serveur injoignable", 
        "Vérifie que ton PC et ton téléphone sont sur le même Wi-Fi et que l'IP 192.168.1.17 est correcte."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <View style={styles.header}>
            <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>🌾</Text>
            </View>
            <Text style={styles.title}>Naturel & Sans Gluten</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adresse Email</Text>
              <TextInput 
                style={styles.input}
                placeholder="exemple@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput 
                style={styles.input}
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              activeOpacity={0.8} 
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Se Connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.signUpLink}>Inscrivez-vous</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 25, justifyContent: 'center', paddingVertical: 40, maxWidth: 500, alignSelf: 'center', width: '100%' },
  header: { alignItems: 'center', marginBottom: 45 },
  logoCircle: { width: 90, height: 90, backgroundColor: '#ECFDF5', borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#D1FAE5' },
  logoEmoji: { fontSize: 45 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#065F46', textAlign: 'center' },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#065F46', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F1F5F9', height: 55, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: '#1E293B' },
  loginButton: { backgroundColor: '#10B981', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  forgotBtn: { marginTop: 15, alignItems: 'center' },
  forgotText: { color: '#059669', fontSize: 14, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 35 },
  footerText: { color: '#64748B', fontSize: 15 },
  signUpLink: { color: '#10B981', fontSize: 15, fontWeight: 'bold' },
});