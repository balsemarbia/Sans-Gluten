import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ProductDetails() {
  const { id, name, price, description, image } = useLocalSearchParams();
  const router = useRouter();

  const handleAddToCart = () => {
    Alert.alert("Panier", `${name} a été ajouté au panier ! 🛒`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Bouton Retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#064E3B" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image du Produit */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: image as string || 'https://via.placeholder.com/300' }} 
            style={styles.productImage} 
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.productName}>{name || "Produit Sans Gluten"}</Text>
            <Text style={styles.productPrice}>{price || "0.000"} DT</Text>
          </View>

          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✅ Certifié Sans Gluten</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#DBEAFE' }]}>
              <Text style={[styles.badgeText, { color: '#1E40AF' }]}>🌿 100% Naturel</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {description || "Ce produit artisanal a été spécialement conçu pour les personnes intolérantes au gluten. Moelleux et savoureux, il conserve tout le goût authentique."}
          </Text>

          <Text style={styles.sectionTitle}>Ingrédients & Allergènes</Text>
          <View style={styles.ingredientsBox}>
            <Text style={styles.ingredientsText}>
              • Farine de riz complet{"\n"}
              • Fécule de pomme de terre{"\n"}
              • Gomme de guar{"\n"}
              • Traces possibles de : Fruits à coque.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Barre de pied de page avec bouton d'achat */}
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyText}>-</Text></TouchableOpacity>
          <Text style={styles.qtyNumber}>1</Text>
          <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyText}>+</Text></TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Text style={styles.cartButtonText}>Ajouter au panier</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: '#F1F5F9', padding: 10, borderRadius: 12 },
  
  imageContainer: { width: '100%', height: 300, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  productImage: { width: '80%', height: '80%' },

  detailsContainer: { padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#FFF', marginTop: -30 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  productName: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', flex: 1 },
  productPrice: { fontSize: 22, fontWeight: 'bold', color: '#10B981', marginLeft: 10 },

  badgeContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  badge: { backgroundColor: '#D1FAE5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  badgeText: { color: '#065F46', fontSize: 12, fontWeight: 'bold' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginTop: 20, marginBottom: 10 },
  descriptionText: { fontSize: 15, color: '#64748B', lineHeight: 22 },

  ingredientsBox: { backgroundColor: '#F8FAFC', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  ingredientsText: { color: '#475569', fontSize: 14, lineHeight: 20 },

  footer: { padding: 20, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F1F5F9', alignItems: 'center' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 5, marginRight: 15 },
  qtyBtn: { width: 35, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8 },
  qtyText: { fontSize: 20, fontWeight: 'bold' },
  qtyNumber: { marginHorizontal: 15, fontSize: 16, fontWeight: 'bold' },
  cartButton: { flex: 1, backgroundColor: '#10B981', padding: 18, borderRadius: 15, alignItems: 'center' },
  cartButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});