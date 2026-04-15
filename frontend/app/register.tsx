import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() { 
  const router = useRouter();
  
  // États pour tous les champs
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [genre, setGenre] = useState('mâle');
  const [region, setRegion] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // 1. Vérification que tous les champs sont remplis
    if (!nom || !prenom || !age || !region || !telephone || !email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // 2. Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      console.log("Tentative d'inscription en cours...");

      // On utilise localhost pour les tests sur navigateur PC
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nom, prenom, age, genre, region, telephone, email, password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Inscription réussie ! Redirection vers Login.");
        
        // --- MODIFICATION ICI : Alerte avec action de redirection ---
        Alert.alert(
          "Félicitations ! 🎉", 
          "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.", 
          [
            { 
              text: "Se connecter", 
              onPress: () => {
                router.replace('/login'); // Remplace la page actuelle par le login
              } 
            }
          ]
        );
      } else {
        Alert.alert("Échec de l'inscription", data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur réseau Inscription:", error);
      Alert.alert(
        "Erreur de connexion", 
        "Impossible de joindre le serveur. Assurez-vous que le backend est lancé."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Inscription 🌾</Text>
        
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 5}}>
              <Text style={styles.label}>Nom</Text>
              <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} />
            </View>
            <View style={{flex: 1, marginLeft: 5}}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput style={styles.input} placeholder="Prénom" value={prenom} onChangeText={setPrenom} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 5}}>
              <Text style={styles.label}>Âge</Text>
              <TextInput style={styles.input} placeholder="Ex: 25" value={age} onChangeText={setAge} keyboardType="numeric" />
            </View>
            <View style={{flex: 1, marginLeft: 5}}>
              <Text style={styles.label}>Genre</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={genre} onValueChange={(itemValue) => setGenre(itemValue)}>
                  <Picker.Item label="Mâle" value="mâle" />
                  <Picker.Item label="Femme" value="femme" />
                </Picker>
              </View>
            </View>
          </View>

          <Text style={styles.label}>Région (Ville)</Text>
          <TextInput style={styles.input} placeholder="Ex: Tunis, Nabeul..." value={region} onChangeText={setRegion} />

          <Text style={styles.label}>Téléphone</Text>
          <TextInput style={styles.input} placeholder="N° Téléphone" value={telephone} onChangeText={setTelephone} keyboardType="phone-pad" />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="votre@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput style={styles.input} placeholder="********" value={password} onChangeText={setPassword} secureTextEntry />

          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput style={styles.input} placeholder="********" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

          <TouchableOpacity 
            style={styles.registerBtn} 
            activeOpacity={0.7}
            onPress={handleRegister}
          >
            <Text style={styles.registerBtnText}>Créer mon compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  scrollContent: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#064E3B', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 13, fontWeight: '600', marginTop: 12, color: '#374151' },
  input: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 5 },
  pickerContainer: { backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 5, overflow: 'hidden' },
  registerBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 25 },
  registerBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});