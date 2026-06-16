import React, { useState, useLayoutEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useApplications, APP_CONFIG } from '@applaid/core';
import type { TimelineStage, Application } from '@applaid/core';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { SelectField } from '../components/SelectField';

type Props = {
  route: RouteProp<MainStackParamList, 'ApplicationDetail'>;
  navigation: NativeStackNavigationProp<MainStackParamList, 'ApplicationDetail'>;
};

export default function ApplicationDetailScreen({ route, navigation }: Props) {
  const { applications, loading, updateApplication, deleteApplication, addTimelineEvent, deleteTimelineEvent } = useApplications();
  const application = applications.find(a => a.id === route.params.id);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Application> | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    stage: 'phone_screen',
    event_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => {
          if (isEditing) {
            setIsEditing(false);
          } else {
            setEditForm({ ...application });
            setIsEditing(true);
          }
        }}>
          <Text style={styles.headerButton}>{isEditing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing, application]);

  const handleUpdate = async () => {
    if (!editForm) return;
    const { error } = await updateApplication(application!.id, editForm);
    if (error) {
      Alert.alert('Error', error);
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Application',
      'Are you sure you want to delete this application and all its events?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteApplication(application!.id);
            if (error) {
              Alert.alert('Error', error);
            } else {
              navigation.navigate('Dashboard');
            }
          }
        },
      ]
    );
  };

  const handleAddEvent = async () => {
    const { error } = await addTimelineEvent(application!.id, {
      application_id: application!.id,
      stage: newEvent.stage as TimelineStage,
      event_date: newEvent.event_date,
      notes: newEvent.notes || null,
    });
    if (error) {
      Alert.alert('Error', error);
    } else {
      setShowAddEvent(false);
      setNewEvent({
        stage: 'phone_screen',
        event_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
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

  if (loading && !application) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#c8a96e" />
      </View>
    );
  }

  if (!application) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Application not found</Text>
      </View>
    );
  }

  const statusStyle = getStatusStyles(application.status);

  if (isEditing) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.sectionHeader}>ROLE</Text>
          <TextInput
            style={styles.input}
            value={editForm?.company}
            onChangeText={v => setEditForm({ ...editForm, company: v })}
            placeholder="Company"
            placeholderTextColor="#6a6865"
          />
          <TextInput
            style={styles.input}
            value={editForm?.role_title}
            onChangeText={v => setEditForm({ ...editForm, role_title: v })}
            placeholder="Role Title"
            placeholderTextColor="#6a6865"
          />
          <TextInput
            style={styles.input}
            value={editForm?.role_url}
            onChangeText={v => setEditForm({ ...editForm, role_url: v })}
            placeholder="Role URL"
            placeholderTextColor="#6a6865"
          />

          <Text style={styles.sectionHeader}>APPLICATION</Text>
          <TextInput
            style={styles.input}
            value={editForm?.applied_at}
            onChangeText={v => setEditForm({ ...editForm, applied_at: v })}
            placeholder="Applied Date (YYYY-MM-DD)"
            placeholderTextColor="#6a6865"
          />
          <SelectField
            label="SOURCE"
            value={editForm?.source || ''}
            options={Object.entries(APP_CONFIG.labels.source).map(([k, v]) => ({ label: v, value: k }))}
            onChange={v => setEditForm({ ...editForm, source: v })}
          />
          <TextInput
            style={styles.input}
            value={editForm?.resume_variant}
            onChangeText={v => setEditForm({ ...editForm, resume_variant: v })}
            placeholder="Resume Variant"
            placeholderTextColor="#6a6865"
          />

          <SelectField
            label="STATUS"
            value={editForm?.status || ''}
            options={Object.entries(APP_CONFIG.labels.status).map(([k, v]) => ({ label: v, value: k }))}
            onChange={v => setEditForm({ ...editForm, status: v })}
          />

          {editForm?.status === 'rejected' && (
            <>
              <Text style={styles.sectionHeader}>REJECTION</Text>
              <TextInput
                style={styles.input}
                value={editForm?.rejected_at}
                onChangeText={v => setEditForm({ ...editForm, rejected_at: v })}
                placeholder="Rejected Date (YYYY-MM-DD)"
                placeholderTextColor="#6a6865"
              />
              <SelectField
                label="REJECTION STAGE"
                value={editForm?.rejection_stage || ''}
                options={Object.entries(APP_CONFIG.labels.rejectionStage).map(([k, v]) => ({ label: v, value: k }))}
                onChange={v => setEditForm({ ...editForm, rejection_stage: v })}
              />
            </>
          )}

          <Text style={styles.sectionHeader}>NOTES</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={editForm?.notes}
            onChangeText={v => setEditForm({ ...editForm, notes: v })}
            placeholder="General Notes"
            placeholderTextColor="#6a6865"
            multiline
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>DELETE APPLICATION</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.company}>{application.company}</Text>
        <Text style={styles.role}>{application.role_title}</Text>

        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {APP_CONFIG.labels.status[application.status]}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>DETAILS</Text>
          <View style={styles.detailCard}>
            <DetailRow label="Applied" value={application.applied_at || '—'} />
            <DetailRow label="Source" value={application.source ? APP_CONFIG.labels.source[application.source] : '—'} />
            <DetailRow label="Resume" value={application.resume_variant || '—'} />
            <DetailRow label="Salary" value={application.salary_min ? `${application.salary_min}-${application.salary_max} ${application.salary_currency}` : '—'} />
            <DetailRow label="Updated" value={new Date(application.updated_at).toLocaleDateString()} />
          </View>
        </View>

        {application.status === 'rejected' && (
          <View style={styles.section}>
            <Text style={styles.label}>REJECTION</Text>
            <View style={[styles.detailCard, { borderColor: '#e05a5a' }]}>
              <DetailRow label="Date" value={application.rejected_at || '—'} />
              <DetailRow label="Stage" value={application.rejection_stage ? APP_CONFIG.labels.rejectionStage[application.rejection_stage] : '—'} />
              <DetailRow label="Category" value={application.rejection_category ? APP_CONFIG.labels.rejectionCategory[application.rejection_category] : '—'} />
              {application.rejection_reason && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{application.rejection_reason}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {(application.status === 'offer' || application.status === 'accepted') && (
          <View style={styles.section}>
            <Text style={styles.label}>OFFER</Text>
            <View style={[styles.detailCard, { borderColor: '#d4883a' }]}>
              <DetailRow label="Date" value={application.offer_date || '—'} />
              <DetailRow label="Amount" value={application.offer_amount || '—'} />
              {application.offer_notes && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{application.offer_notes}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {application.notes && (
          <View style={styles.section}>
            <Text style={styles.label}>NOTES</Text>
            <View style={styles.detailCard}>
              <Text style={styles.notesText}>{application.notes}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.label}>TIMELINE</Text>
            <TouchableOpacity onPress={() => setShowAddEvent(!showAddEvent)}>
              <Ionicons name={showAddEvent ? "remove-circle-outline" : "add-circle-outline"} size={20} color="#c8a96e" />
            </TouchableOpacity>
          </View>

          {showAddEvent && (
            <View style={styles.addEventForm}>
              <SelectField
                label="STAGE"
                value={newEvent.stage}
                options={APP_CONFIG.order.timelineStage.map((k) => ({
                  label: APP_CONFIG.labels.timelineStage[k],
                  value: k,
                }))}
                onChange={v => setNewEvent({ ...newEvent, stage: v })}
              />
              <TextInput
                style={styles.input}
                value={newEvent.event_date}
                onChangeText={v => setNewEvent({ ...newEvent, event_date: v })}
                placeholder="Date (YYYY-MM-DD)"
                placeholderTextColor="#6a6865"
              />
              <TextInput
                style={[styles.input, { height: 60 }]}
                value={newEvent.notes}
                onChangeText={v => setNewEvent({ ...newEvent, notes: v })}
                placeholder="Notes (optional)"
                placeholderTextColor="#6a6865"
                multiline
              />
              <TouchableOpacity style={styles.addEventButton} onPress={handleAddEvent}>
                <Text style={styles.addEventButtonText}>ADD EVENT</Text>
              </TouchableOpacity>
            </View>
          )}

          {application.timeline_events?.sort((a,b) => new Date(b.event_date || 0).getTime() - new Date(a.event_date || 0).getTime()).map((event) => (
            <View key={event.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineLine} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>{APP_CONFIG.labels.timelineStage[event.stage]}</Text>
                  <TouchableOpacity onPress={() => deleteTimelineEvent(event.id)}>
                    <Ionicons name="trash-outline" size={14} color="#6a6865" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.timelineDate}>{event.event_date}</Text>
                {event.notes && <Text style={styles.timelineNotes}>{event.notes}</Text>}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0f' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  content: { padding: 24, paddingTop: 40 },
  headerButton: { color: '#c8a96e', fontSize: 16, fontFamily: 'SpaceMono' },
  company: { fontSize: 26, fontWeight: '300', color: '#e8e6e0', fontFamily: 'SpaceMono' },
  role: { fontSize: 16, color: '#a09e98', marginTop: 4, fontFamily: 'SpaceMono' },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginTop: 16, marginBottom: 32 },
  statusText: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'SpaceMono' },
  section: { marginBottom: 32 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  label: { fontSize: 10, color: '#6a6865', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'SpaceMono' },
  detailCard: { backgroundColor: '#1e1e21', borderRadius: 8, borderWidth: 1, borderColor: '#2a2a2e', padding: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { color: '#6a6865', fontSize: 12, fontFamily: 'SpaceMono' },
  detailValue: { color: '#a09e98', fontSize: 14, fontFamily: 'SpaceMono', textAlign: 'right', flex: 1, marginLeft: 10 },
  notesBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#2a2a2e' },
  notesText: { color: '#a09e98', fontSize: 14, fontFamily: 'SpaceMono', lineHeight: 20 },
  timelineItem: { flexDirection: 'row' },
  timelineLeft: { alignItems: 'center', marginRight: 16 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#c8a96e', zIndex: 1 },
  timelineLine: { flex: 1, width: 1, backgroundColor: '#2a2a2e', marginTop: -4 },
  timelineContent: { flex: 1, marginBottom: 24 },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timelineTitle: { color: '#e8e6e0', fontSize: 14, fontFamily: 'SpaceMono' },
  timelineDate: { color: '#6a6865', fontSize: 12, marginTop: 2, fontFamily: 'SpaceMono' },
  timelineNotes: { color: '#a09e98', fontSize: 12, marginTop: 4, fontFamily: 'SpaceMono', fontStyle: 'italic' },
  form: { padding: 24 },
  sectionHeader: { fontSize: 10, color: '#6a6865', letterSpacing: 2, marginTop: 24, marginBottom: 12, fontWeight: '700', fontFamily: 'SpaceMono' },
  input: { backgroundColor: '#1e1e21', borderWidth: 1, borderColor: '#2a2a2e', color: '#e8e6e0', padding: 12, borderRadius: 6, fontSize: 14, fontFamily: 'SpaceMono', marginBottom: 12 },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#c8a96e', padding: 16, borderRadius: 6, alignItems: 'center', marginTop: 32 },
  saveButtonText: { color: '#0e0e0f', fontSize: 14, fontWeight: '600', fontFamily: 'SpaceMono' },
  deleteButton: { padding: 16, marginTop: 16, alignItems: 'center' },
  deleteButtonText: { color: '#e05a5a', fontSize: 14, fontFamily: 'SpaceMono' },
  addEventForm: { backgroundColor: '#161618', padding: 16, borderRadius: 8, marginBottom: 24, borderWidth: 1, borderColor: '#2a2a2e' },
  addEventButton: { backgroundColor: '#c8a96e', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  addEventButtonText: { color: '#0e0e0f', fontSize: 12, fontWeight: '700', fontFamily: 'SpaceMono' },
  errorText: { color: '#e05a5a', fontFamily: 'SpaceMono' },
});
