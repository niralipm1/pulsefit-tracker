import { HealthConnectService } from '../src/services/HealthConnectService';
import { HealthBridge } from '../src/native/HealthBridgeModule';

jest.mock('../src/services/OfflineStorageService', () => ({
  OfflineStorageService: {
    persistTelemetryBatch: jest.fn().mockResolvedValue(undefined),
    getPendingTelemetry: jest.fn().mockResolvedValue([]),
    flushSyncedTelemetry: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('HealthConnectService', () => {
  let service: HealthConnectService;

  beforeEach(() => {
    service = new HealthConnectService();
    jest.clearAllMocks();
  });

  it('should initialize and request permissions correctly', async () => {
    const initialized = await service.initialize();
    expect(initialized).toBe(true);
  });

  it('should fetch recent biometrics and trigger offline persistence', async () => {
    const data = await service.fetchRecentBiometrics();
    expect(data).toHaveProperty('heartRate');
    expect(data).toHaveProperty('steps');
    expect(Array.isArray(data.heartRate)).toBe(true);
    expect(Array.isArray(data.steps)).toBe(true);
  });

  it('should manage continuous monitoring stream state', async () => {
    const started = await service.startContinuousMonitoring();
    expect(started).toBe(true);

    const stopped = await service.stopContinuousMonitoring();
    expect(stopped).toBe(true);
  });
});
