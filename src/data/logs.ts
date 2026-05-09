import { LogEntry } from '../types';

export const SAMPLE_LOGS: LogEntry[] = [
  { id: '1', timestamp: '05-09 08:30:45.123', pid: 1200, tid: 1250, level: 'I', tag: 'ActivityManager', message: 'Start proc 5678:com.android.settings/u0a123 for activity com.android.settings/.Settings' },
  { id: '2', timestamp: '05-09 08:30:45.456', pid: 5678, tid: 5678, level: 'D', tag: 'Settings', message: 'Main screen initialized' },
  { id: '3', timestamp: '05-09 08:30:46.001', pid: 500, tid: 600, level: 'W', tag: 'Binder', message: 'Binder transaction took 150ms' },
  { id: '4', timestamp: '05-09 08:30:46.010', pid: 420, tid: 420, level: 'E', tag: 'SurfaceFlinger', message: 'Failed to acquire buffer from producer!' },
  { id: '5', timestamp: '05-09 08:31:02.112', pid: 5678, tid: 5690, level: 'I', tag: 'PowerManagerService', message: 'Going to sleep due to screen timeout...' },
  { id: '6', timestamp: '05-09 08:31:05.500', pid: 120, tid: 120, level: 'V', tag: 'WifiService', message: 'Scanning for networks...' },
  { id: '7', timestamp: '05-09 08:31:10.005', pid: 2100, tid: 2105, level: 'F', tag: 'SystemServer', message: 'Fatal exception: NullPointerException at com.android.server.am.ActivityManagerService.updateSleepIfNeeded(ActivityManagerService.java:1234)' }
];
