import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useApplications } from '@applaid/core';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/types';

type Props = {
  route: RouteProp<MainStackParamList, 'ApplicationDetail'>;
};

export default function ApplicationDetailScreen({ route }: Props) {
  const { applications, loading } = useApplications();
  const application = applications.find(a => a.id === route.params.id);

  if (loading) {
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

  const statusStyle = getStatusStyles(application.status);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.company}>{application.company}</Text>
        <Text style={styles.role}>{application.role_title}</Text>
        
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {application.status}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>DETAILS</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Applied on</Text>
              <Text style={styles.detailValue}>
                {new Date(application.created_at).toLocaleDateString()}
              </Text>
            </View>
            {application.job_description_url && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>URL</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {application.job_description_url}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Simplified Timeline */}
        <View style={styles.section}>
          <Text style={styles.label}>TIMELINE</Text>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Application Submitted</Text>
              <Text style={styles.timelineDate}>
                {new Date(application.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0f',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  company: {
    fontSize: 26,
    fontWeight: '300',
    color: '#e8e6e0',
    fontFamily: 'SpaceMono',
  },
  role: {
    fontSize: 16,
    color: '#a09e98',
    marginTop: 4,
    fontFamily: 'SpaceMono',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 16,
    marginBottom: 32,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'SpaceMono',
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 10,
    color: '#6a6865',
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: 'uppercase',
    fontFamily: 'SpaceMono',
  },
  detailCard: {
    backgroundColor: '#1e1e21',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2e',
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    color: '#6a6865',
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  detailValue: {
    color: '#a09e98',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingLeft: 4,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c8a96e',
    marginTop: 6,
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    color: '#e8e6e0',
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
  timelineDate: {
    color: '#6a6865',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'SpaceMono',
  },
  errorText: {
    color: '#e05a5a',
    fontFamily: 'SpaceMono',
  },
});
