import { HealthBridge, HeartRateSample, StepsSample } from '../native/HealthBridgeModule';
import { OfflineStorageService } from './OfflineStorageService';

export class HealthConnectService {
  private isTracking = false;

  async initialize(): Promise<boolean> {
    try {
      const permitted = await HealthBridge.requestPermissions();
      if (!permitted) {
        console.warn('[HealthConnectService] Biometrics permissions denied');
        return false;
      }
      return true;
    } catch (err) {
      console.error('[HealthConnectService] Initialization error', err);
      return false;
    }
  }

  async fetchRecentBiometrics(): Promise<{ heartRate: HeartRateSample[]; steps: StepsSample[] }> {
    const now = Date.now();
    const oneHourAgo = now - 3600 * 1000;

    const [heartRate, steps] = await Promise.all([
      HealthBridge.getHeartRateSamples(oneHourAgo, now),
      HealthBridge.getStepRecords(oneHourAgo, now),
    ]);

    // Store samples locally for offline-first reliability
    if (heartRate.length > 0) {
      await OfflineStorageService.persistTelemetryBatch(heartRate);
    }

    return { heartRate, steps };
  }

  async startContinuousMonitoring(): Promise<boolean> {
    if (this.isTracking) return true;
    const ok = await HealthBridge.startRealtimeStream();
    if (ok) this.isTracking = true;
    return ok;
  }

  async stopContinuousMonitoring(): Promise<boolean> {
    if (!this.isTracking) return true;
    const ok = await HealthBridge.stopRealtimeStream();
    if (ok) this.isTracking = false;
    return ok;
  }
}

export const healthService = new HealthConnectService();
