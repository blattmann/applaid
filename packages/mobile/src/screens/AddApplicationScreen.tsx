import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useApplications } from '@applaid/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'AddApplication'>;
};

export default function AddApplicationScreen({ navigation }: Props) {
  const { createApplication } = useApplications();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: '',
    role_title: '',
    role_url: '',
    status: 'active' as const,
    applied_at: new Date().toISOString().slice(0, 10),
    source: 'other' as const,
    resume_variant: '',
    notes: '',
    salary_min: null as number | null,
    salary_max: null as number | null,
    salary_currency: 'USD',
    rejected_at: null,
    rejection_stage: null,
    rejection_reason: null,
    rejection_category: null,
    offer_date: null,
    offer_amount: null,
    offer_notes: null,
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await createApplication(form);
      if (res?.error) {
        alert(res.error);
      } else {
        navigation.goBack();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Company Name</Text>
      <TextInput
        style={styles.input}
        value={form.company}
        onChangeText={(val) => setForm({ ...form, company: val })}
        placeholder="e.g. Google"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Role Title</Text>
      <TextInput
        style={styles.input}
        value={form.role_title}
        onChangeText={(val) => setForm({ ...form, role_title: val })}
        placeholder="e.g. Software Engineer"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={form.notes || ''}
        onChangeText={(val) => setForm({ ...form, notes: val })}
        multiline
        numberOfLines={4}
        placeholder="Additional info..."
        placeholderTextColor="#666"
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Application</Text>}
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
  label: {
    color: '#9ca3af',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1e1e1f',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
