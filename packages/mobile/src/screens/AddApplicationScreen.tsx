import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useApplications } from '@applaid/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'AddApplication'>;
};

export default function AddApplicationScreen({ navigation }: Props) {
  const { addApplication } = useApplications();
  const [form, setForm] = useState({
    company: '',
    role_title: '',
    status: 'active',
    job_description_url: '',
  });

  const handleSave = async () => {
    if (!form.company || !form.role_title) {
      Alert.alert('Error', 'Company and Role are required');
      return;
    }
    await addApplication(form);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>COMPANY</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Acme Corp"
            placeholderTextColor="#6a6865"
            value={form.company}
            onChangeText={(v) => setForm({ ...form, company: v })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ROLE TITLE</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Senior Frontend Engineer"
            placeholderTextColor="#6a6865"
            value={form.role_title}
            onChangeText={(v) => setForm({ ...form, role_title: v })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>URL (OPTIONAL)</Text>
          <TextInput
            style={styles.input}
            placeholder="Job description URL"
            placeholderTextColor="#6a6865"
            value={form.job_description_url}
            onChangeText={(v) => setForm({ ...form, job_description_url: v })}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE APPLICATION</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0f',
  },
  form: {
    padding: 20,
    paddingTop: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    color: '#6a6865',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
    fontFamily: 'SpaceMono',
  },
  input: {
    backgroundColor: '#1e1e21',
    borderWidth: 1,
    borderColor: '#2a2a2e',
    color: '#e8e6e0',
    padding: 15,
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
  saveButton: {
    backgroundColor: '#c8a96e',
    padding: 18,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#0e0e0f',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: 'SpaceMono',
  },
});
