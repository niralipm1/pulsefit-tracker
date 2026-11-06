import { NativeModules, Platform } from 'react-native';

export interface HeartRateSample {
  bpm: number;
  timestamp: number;
  accuracy: number;
}

export interface StepsSample {
  count: number;
  startTime: number;
  endTime: number;
}

export interface HealthBridgeInterface {
  requestPermissions(): Promise<boolean>;
  getHeartRateSamples(startTime: number, endTime: number): Promise<HeartRateSample[]>;
  getStepRecords(startTime: number, endTime: number): Promise<StepsSample[]>;
  startRealtimeStream(): Promise<boolean>;
  stopRealtimeStream(): Promise<boolean>;
}

const { HealthConnectModule } = NativeModules;

export const HealthBridge: HealthBridgeInterface = Platform.select({
  android: HealthConnectModule || {
    requestPermissions: async () => true,
    getHeartRateSamples: async () => [
      { bpm: 72, timestamp: Date.now() - 60000, accuracy: 3 },
      { bpm: 78, timestamp: Date.now() - 30000, accuracy: 3 },
      { bpm: 84, timestamp: Date.now(), accuracy: 3 }
    ],
    getStepRecords: async () => [
      { count: 4820, startTime: Date.now() - 3600000, endTime: Date.now() }
    ],
    startRealtimeStream: async () => true,
    stopRealtimeStream: async () => true,
  },
  default: {
    requestPermissions: async () => true,
    getHeartRateSamples: async () => [],
    getStepRecords: async () => [],
    startRealtimeStream: async () => true,
    stopRealtimeStream: async () => true,
  }
});
