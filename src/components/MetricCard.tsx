import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  trend?: string;
  statusColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  statusColor = '#38bdf8'
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.icon}>{icon}</Text>
        {trend && <Text style={[styles.trend, { color: statusColor }]}>{trend}</Text>}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flex: 1,
    minWidth: 140,
    margin: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 22,
  },
  trend: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
  },
  unit: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
    fontWeight: '600',
  },
});
