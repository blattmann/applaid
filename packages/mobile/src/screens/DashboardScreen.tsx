import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useApplications, useAuth } from '@applaid/core';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Dashboard'>;
};

export default function DashboardScreen({ navigation }: Props) {
  const { applications, loading } = useApplications();
  const { signOut } = useAuth();

  const stats = {
    total: applications.length,
    active: applications.filter(a => a.status === 'active').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    offer: applications.filter(a => a.status === 'offer').length,
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active': return { color: '#4caf82', backgroundColor: '#0d2318' };
      case 'rejected': return { color: '#e05a5a', backgroundColor: '#220f0f' };
      case 'offer': return { color: '#d4883a', backgroundColor: '#231508' };
      case 'accepted': return { color: '#5a9fd4', backgroundColor: '#0a1929' };
      case 'withdrawn': return { color: '#6a6865', backgroundColor: '#1e1e21' };
      default: return { color: '#a09e98', backgroundColor: '#1e1e21' };
    }
  };

  const renderItem = ({ item }: any) => {
    const statusStyle = getStatusStyles(item.status);
    return (
      <TouchableOpacity 
        style={styles.item}
        onPress={() => navigation.navigate('ApplicationDetail', { id: item.id })}
      >
        <View style={styles.itemMain}>
          <Text style={styles.company}>{item.company}</Text>
          <Text style={styles.role}>{item.role_title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ApplAId</Text>
        <TouchableOpacity onPress={signOut}>
          <Ionicons name="log-out-outline" size={24} color="#c8a96e" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>TOTAL</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>ACTIVE</Text>
            <Text style={styles.statValue}>{stats.active}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>REJECTED</Text>
            <Text style={styles.statValue}>{stats.rejected}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>OFFERS</Text>
            <Text style={styles.statValue}>{stats.offer}</Text>
          </View>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#c8a96e" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={applications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddApplication')}
      >
        <Ionicons name="add" size={30} color="#0e0e0f" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#c8a96e',
    fontStyle: 'italic',
    fontFamily: 'SpaceMono',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsScroll: {
    paddingHorizontal: 20,
  },
  statItem: {
    marginRight: 30,
  },
  statLabel: {
    fontSize: 10,
    color: '#6a6865',
    letterSpacing: 1,
    fontFamily: 'SpaceMono',
  },
  statValue: {
    fontSize: 24,
    color: '#e8e6e0',
    fontFamily: 'SpaceMono',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  item: {
    backgroundColor: '#1e1e21',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2e',
  },
  itemMain: {
    flex: 1,
    marginRight: 10,
  },
  company: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e8e6e0',
    fontFamily: 'SpaceMono',
  },
  role: {
    fontSize: 13,
    color: '#a09e98',
    fontFamily: 'SpaceMono',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'SpaceMono',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#c8a96e',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
