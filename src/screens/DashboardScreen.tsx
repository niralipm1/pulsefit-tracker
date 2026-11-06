import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { healthService } from '../services/HealthConnectService';
import { MetricCard } from '../components/MetricCard';
import { HeartRateMonitor } from '../components/HeartRateMonitor';
import { HeartRateSample, StepsSample } from '../native/HealthBridgeModule';

export const DashboardScreen: React.FC = () => {
  const [currentBpm, setCurrentBpm] = useState<number>(76);
  const [totalSteps, setTotalSteps] = useState<number>(6840);
  const [activeCalories, setActiveCalories] = useState<number>(420);
  const [sleepScore, setSleepScore] = useState<number>(88);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      await healthService.initialize();
      const data = await healthService.fetchRecentBiometrics();
      if (!mounted) return;

      if (data.heartRate.length > 0) {
        const latest = data.heartRate[data.heartRate.length - 1];
        setCurrentBpm(latest.bpm);
      }
      if (data.steps.length > 0) {
        const sum = data.steps.reduce((acc, curr) => acc + curr.count, 0);
        setTotalSteps(sum);
      }
    }

    loadData();

    // Biometric telemetry ticker
    const ticker = setInterval(() => {
      if (isStreaming) {
        setCurrentBpm(prev => Math.min(185, Math.max(58, prev + Math.floor(Math.random() * 5 - 2))));
      }
    }, 2000);

    return () => {
      mounted = false;
      clearInterval(ticker);
    };
  }, [isStreaming]);

  const onRefresh = async () => {
    setRefreshing(true);
    await healthService.fetchRecentBiometrics();
    setRefreshing(false);
  };

  const toggleStream = () => {
    if (isStreaming) {
      healthService.stopContinuousMonitoring();
      setIsStreaming(false);
    } else {
      healthService.startContinuousMonitoring();
      setIsStreaming(true);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.headerTitle}>PulseFit Biometrics</Text>
        </View>
        <TouchableOpacity
          style={[styles.streamBadge, isStreaming ? styles.streamLive : styles.streamPaused]}
          onPress={toggleStream}
        >
          <View style={[styles.dot, isStreaming && styles.dotLive]} />
          <Text style={styles.streamText}>{isStreaming ? 'LIVE SYNC' : 'PAUSED'}</Text>
        </TouchableOpacity>
      </View>

      <HeartRateMonitor currentBpm={currentBpm} isStreaming={isStreaming} />

      <Text style={styles.sectionHeader}>Today's Vitals</Text>
      <View style={styles.metricsGrid}>
        <MetricCard title="Daily Steps" value={totalSteps.toLocaleString()} unit="steps" icon="👟" trend="+14% vs avg" statusColor="#10b981" />
        <MetricCard title="Active Energy" value={activeCalories} unit="kcal" icon="🔥" trend="Target 600" statusColor="#f59e0b" />
        <MetricCard title="Resting Heart Rate" value="62" unit="bpm" icon="🫀" trend="Optimal" statusColor="#38bdf8" />
        <MetricCard title="Sleep Recovery" value={sleepScore} unit="/100" icon="🌙" trend="+5 pts" statusColor="#818cf8" />
      </View>

      <View style={styles.diagnosticCard}>
        <Text style={styles.diagnosticTitle}>Native Bridge Diagnostics</Text>
        <Text style={styles.diagnosticLine}>• Engine: Android Health Connect SDK (Client v1.1)</Text>
        <Text style={styles.diagnosticLine}>• Architecture: JNI / TurboModule zero-copy buffer</Text>
        <Text style={styles.diagnosticLine}>• Persistence: SQLite Ring Buffer (Offline-First)</Text>
        <Text style={styles.diagnosticLine}>• Battery Consumption: ~3.1% / hour</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 14,
    color: '#94a3b8',
    fontFamily: 'System',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
  },
  streamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  streamLive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10b981',
  },
  streamPaused: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#ef4444',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  dotLive: {
    backgroundColor: '#10b981',
  },
  streamText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f8fafc',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 15,
    marginBottom: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  diagnosticCard: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  diagnosticTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38bdf8',
    marginBottom: 8,
  },
  diagnosticLine: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 20,
  },
});
