import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useApplications, ApplicationSource, ApplicationStatus } from '@applaid/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { SelectField } from '../components/SelectField';

interface AddApplicationForm {
  company: string
  role_title: string
  role_url: string
  applied_at: string
  source: ApplicationSource
  resume_variant: string
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  status: ApplicationStatus
  notes: string
  rejected_at: null
  rejection_stage: null
  rejection_category: null
  rejection_reason: null
  offer_date: null
  offer_amount: null
  offer_notes: null
}

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'AddApplication'>;
};

export default function AddApplicationScreen({ navigation }: Props) {
  const { createApplication } = useApplications();
  const resumeVariantOptions = [
    'Staff Frontend Engineer',
    'Head of Front-End Engineering',
    'Engineering Manager',
    'VP Engineering',
    'Technical Fellow',
    'Staff Product Platform Engineer',
    'CTO',
    'Principal Engineer',
  ].map(v => ({ label: v, value: v }));

  const [form, setForm] = useState({
    company: '',
    role_title: '',
    role_url: '',
    applied_at: new Date().toISOString().split('T')[0],
    source: 'linkedin' as ApplicationSource,
    resume_variant: '',
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD',
    status: 'active' as ApplicationStatus,
    notes: '',
    rejected_at: '',
    rejection_stage: 'application',
    rejection_category: 'no_feedback',
    rejection_reason: '',
    offer_date: '',
    offer_amount: '',
    offer_notes: '',
  });

  const handleSave = async () => {
    if (!form.company || !form.role_title) {
      Alert.alert('Error', 'Company and Role are required');
      return;
    }

    const payload: AddApplicationForm = {
      ...form,
      source: form.source as ApplicationSource,
      status: form.status as ApplicationStatus,
      salary_min: form.salary_min ? parseInt(form.salary_min) : null,
      salary_max: form.salary_max ? parseInt(form.salary_max) : null,
      rejected_at: null,
      rejection_stage: null,
      rejection_category: null,
      rejection_reason: null,
      offer_date: null,
      offer_amount: null,
      offer_notes: null,
    };

    try {
      await createApplication(payload);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save application');
    }
  };

  const renderInput = (label: string, key: keyof typeof form, placeholder?: string, keyboardType: any = 'default', multiline = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder}
        placeholderTextColor="#6a6865"
        value={form[key]}
        onChangeText={(v) => setForm({ ...form, [key]: v })}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );

  const renderPicker = (label: string, key: keyof typeof form, options: { label: string, value: string }[]) => (
    <SelectField
      label={label}
      value={form[key]}
      options={options}
      onChange={(v) => setForm({ ...form, [key]: v })}
    />
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#0e0e0f' }}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.sectionHeader}>ROLE</Text>
        {renderInput('COMPANY *', 'company', 'e.g. Acme Corp')}
        {renderInput('ROLE TITLE *', 'role_title', 'e.g. Senior Frontend Engineer')}
        {renderInput('ROLE URL', 'role_url', 'Job description URL', 'url')}

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            {renderInput('SALARY MIN', 'salary_min', '0', 'numeric')}
          </View>
          <View style={{ flex: 1 }}>
            {renderInput('SALARY MAX', 'salary_max', '0', 'numeric')}
          </View>
        </View>
        {renderPicker('CURRENCY', 'salary_currency', [
          { label: 'USD', value: 'USD' },
          { label: 'EUR', value: 'EUR' },
          { label: 'GBP', value: 'GBP' },
          { label: 'CAD', value: 'CAD' },
        ])}

        <Text style={styles.sectionHeader}>APPLICATION</Text>
        {renderInput('APPLIED AT (YYYY-MM-DD)', 'applied_at', '2024-01-01')}
        {renderPicker('SOURCE', 'source', [
          { label: 'LinkedIn', value: 'linkedin' },
          { label: 'Company site', value: 'company_site' },
          { label: 'Referral', value: 'referral' },
          { label: 'Cold outreach', value: 'cold_outreach' },
          { label: 'Recruiter / agency', value: 'recruiter' },
          { label: 'Other', value: 'other' },
        ])}
        <SelectField
          label="RESUME VARIANT"
          value={form.resume_variant}
          options={resumeVariantOptions}
          onChange={v => setForm({ ...form, resume_variant: v })}
          placeholder="Select resume variant..."
        />

        <Text style={styles.sectionHeader}>STATUS</Text>
        {renderPicker('CURRENT STATUS', 'status', [
          { label: 'Active', value: 'active' },
          { label: 'Rejected', value: 'rejected' },
          { label: 'Withdrawn', value: 'withdrawn' },
          { label: 'Offer', value: 'offer' },
          { label: 'Accepted', value: 'accepted' },
        ])}

        {form.status === 'rejected' && (
          <>
            <Text style={styles.sectionHeader}>REJECTION</Text>
            {renderInput('REJECTED AT (YYYY-MM-DD)', 'rejected_at', '2024-01-01')}
            {renderPicker('STAGE', 'rejection_stage', [
              { label: 'Application', value: 'application' },
              { label: 'Phone Screen', value: 'phone_screen' },
              { label: 'Technical', value: 'technical' },
              { label: 'Interview', value: 'interview' },
              { label: 'Final', value: 'final' },
            ])}
            {renderPicker('CATEGORY', 'rejection_category', [
              { label: 'No Feedback', value: 'no_feedback' },
              { label: 'Overqualified', value: 'overqualified' },
              { label: 'Underqualified', value: 'underqualified' },
              { label: 'Timezone', value: 'timezone' },
              { label: 'Compensation', value: 'compensation' },
              { label: 'Other', value: 'other' },
            ])}
            {renderInput('REJECTION REASON', 'rejection_reason', 'Notes on rejection...', 'default', true)}
          </>
        )}

        {(form.status === 'offer' || form.status === 'accepted') && (
          <>
            <Text style={styles.sectionHeader}>OFFER</Text>
            {renderInput('OFFER DATE (YYYY-MM-DD)', 'offer_date', '2024-01-01')}
            {renderInput('OFFER AMOUNT', 'offer_amount', 'e.g. 120k')}
            {renderInput('OFFER NOTES', 'offer_notes', 'Notes on offer...', 'default', true)}
          </>
        )}

        <Text style={styles.sectionHeader}>NOTES</Text>
        {renderInput('ADDITIONAL NOTES', 'notes', 'Extra details...', 'default', true)}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE APPLICATION</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0f',
  },
  form: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  sectionHeader: {
    fontSize: 10,
    color: '#6a6865',
    letterSpacing: 2,
    marginTop: 30,
    marginBottom: 15,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
  },
  inputGroup: {
    marginBottom: 16,
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
    padding: 12,
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: '#c8a96e',
    padding: 18,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 40,
  },
  saveButtonText: {
    color: '#0e0e0f',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: 'SpaceMono',
  },
});
