import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApplications } from '@applaid/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'ApplicationDetail'>;

export default function ApplicationDetailScreen({ route, navigation }: Props) {
  const { applications } = useApplications();
  const app = applications.find(a => a.id === route.params.id);

  if (!app) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Application not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.company}>{app.company}</Text>
      <Text style={styles.role}>{app.role_title}</Text>
      <View style={styles.statusRow}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.status}>{app.status}</Text>
      </View>
      
      {app.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.description}>{app.notes}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0f',
  },
  content: {
    padding: 20,
  },
  company: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  role: {
    fontSize: 20,
    color: '#9ca3af',
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    color: '#6b7280',
    marginRight: 10,
  },
  status: {
    color: '#3b82f6',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#d1d5db',
    lineHeight: 22,
  },
  text: {
    color: '#fff',
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#3b82f6',
    fontSize: 16,
  }
});
