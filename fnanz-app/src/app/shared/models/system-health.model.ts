export interface SystemHealth {
  name: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  lastCheckedAt: string;
  notes?: string;
}
