import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeartRateSample } from '../native/HealthBridgeModule';

const STORAGE_KEY_PENDING_SYNC = '@pulsefit:pending_sync_samples';
const STORAGE_KEY_USER_PROFILE = '@pulsefit:user_profile';

export interface UserProfile {
  id: string;
  restingHeartRate: number;
  maxHeartRate: number;
  targetDailySteps: number;
}

export class OfflineStorageService {
  static async persistTelemetryBatch(samples: HeartRateSample[]): Promise<void> {
    try {
      const existingRaw = await AsyncStorage.getItem(STORAGE_KEY_PENDING_SYNC);
      const existing: HeartRateSample[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [...existing, ...samples];
      // Keep at most 10,000 recent samples in ring buffer
      const capped = updated.slice(-10000);
      await AsyncStorage.setItem(STORAGE_KEY_PENDING_SYNC, JSON.stringify(capped));
    } catch (error) {
      console.error('[OfflineStorageService] Failed to persist telemetry batch', error);
      throw error;
    }
  }

  static async getPendingTelemetry(): Promise<HeartRateSample[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_PENDING_SYNC);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('[OfflineStorageService] Failed to read pending telemetry', error);
      return [];
    }
  }

  static async flushSyncedTelemetry(count: number): Promise<void> {
    try {
      const existing = await this.getPendingTelemetry();
      const remaining = existing.slice(count);
      await AsyncStorage.setItem(STORAGE_KEY_PENDING_SYNC, JSON.stringify(remaining));
    } catch (error) {
      console.error('[OfflineStorageService] Failed to flush synced telemetry', error);
    }
  }
}
