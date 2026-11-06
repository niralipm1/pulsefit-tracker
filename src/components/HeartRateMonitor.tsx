import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  currentBpm: number;
  isStreaming: boolean;
}

export const HeartRateMonitor: React.FC<Props> = ({ currentBpm, isStreaming }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!isStreaming) return;
    const intervalMs = Math.max(300, Math.floor(60000 / (currentBpm || 70)));
    const timer = setInterval(() => {
      setPulse(p => !p);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [currentBpm, isStreaming]);

  const getZone = (bpm: number) => {
    if (bpm < 60) return { label: 'Resting', color: '#38bdf8' };
    if (bpm < 100) return { label: 'Aerobic Warmup', color: '#10b981' };
    if (bpm < 140) return { label: 'Fat Burn', color: '#f59e0b' };
    if (bpm < 170) return { label: 'Cardio Target', color: '#f97316' };
    return { label: 'Peak Anaerobic', color: '#ef4444' };
  };

  const zone = getZone(currentBpm);

  return (
    <View style={styles.container}>
      <View style={styles.pulseWrapper}>
        <View style={[styles.pulseCircle, pulse && styles.pulseActive, { borderColor: zone.color }]}>
          <Text style={styles.heartIcon}>❤️</Text>
          <Text style={styles.bpmValue}>{currentBpm}</Text>
          <Text style={styles.bpmLabel}>BPM</Text>
        </View>
      </View>
      <View style={[styles.zoneBadge, { backgroundColor: `${zone.color}20`, borderColor: zone.color }]}>
        <Text style={[styles.zoneText, { color: zone.color }]}>{zone.label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 18,
  },
  pulseWrapper: {
    padding: 10,
  },
  pulseCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  pulseActive: {
    transform: [{ scale: 1.05 }],
  },
  heartIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  bpmValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
  },
  bpmLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.5,
  },
  zoneBadge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  zoneText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
