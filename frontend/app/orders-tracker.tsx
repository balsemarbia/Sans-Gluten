import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Order {
  id: string;
  customer: string;
  items: string;
  total: string;
  status: 'En cours' | 'Livré' | 'Annulé';
  date: string;
}

export default function OrdersTracker() {
  const [orders, setOrders] = useState<Order[]>([
    { id: '101', customer: 'Ahmed Ben Ali', items: '2x Pain Riz, 1x Gâteau Coco', total: '24.500', status: 'En cours', date: '05/03/2026' },
    { id: '102', customer: 'Sarra Mansour', items: '1x Farine Mix', total: '12.800', status: 'Livré', date: '04/03/2026' },
    { id: '103', customer: 'Yassine Toumi', items: '3x Biscuits Amande', total: '18.000', status: 'Annulé', date: '03/03/2026' },
  ]);

  const updateStatus = (id: string, newStatus: 'Livré' | 'Annulé') => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    Alert.alert("Statut mis à jour", `La commande #${id} est désormais : ${newStatus}`);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Livré': return styles.statusDelivered;
      case 'Annulé': return styles.statusCancelled;
      default: return styles.statusPending;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suivi Commandes 📦</Text>
        <Text style={styles.subTitle}>{orders.length} commandes totales</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Commande #{item.id}</Text>
              <Text style={styles.orderDate}>{item.date}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Ionicons name="person-outline" size={16} color="#64748B" />
              <Text style={styles.customerName}>{item.customer}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="basket-outline" size={16} color="#64748B" />
              <Text style={styles.itemsList}>{item.items}</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.totalPrice}>{item.total} DT</Text>
              <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            {item.status === 'En cours' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.deliverBtn} 
                  onPress={() => updateStatus(item.id, 'Livré')}
                >
                  <Text style={styles.deliverBtnText}>Marquer Livré</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => updateStatus(item.id, 'Annulé')}
                >
                  <Text style={styles.cancelBtnText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  subTitle: { color: '#64748B', fontSize: 14, marginTop: 4 },

  orderCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 15, marginBottom: 15, elevation: 3 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontWeight: 'bold', color: '#0F172A', fontSize: 16 },
  orderDate: { color: '#94A3B8', fontSize: 13 },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  customerName: { marginLeft: 8, color: '#334155', fontWeight: '600' },
  itemsList: { marginLeft: 8, color: '#64748B', fontSize: 14, flex: 1 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: '#10B981' },
  
  statusBadge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#FFF' },
  statusPending: { backgroundColor: '#F59E0B' },
  statusDelivered: { backgroundColor: '#10B981' },
  statusCancelled: { backgroundColor: '#EF4444' },

  actionButtons: { flexDirection: 'row', marginTop: 15, gap: 10 },
  deliverBtn: { flex: 2, backgroundColor: '#D1FAE5', padding: 12, borderRadius: 10, alignItems: 'center' },
  deliverBtnText: { color: '#065F46', fontWeight: 'bold' },
  cancelBtn: { flex: 1, backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, alignItems: 'center' },
  cancelBtnText: { color: '#475569', fontWeight: 'bold' },
});