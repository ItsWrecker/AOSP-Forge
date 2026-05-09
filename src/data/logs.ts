import { LogEntry } from '../types';

export const SAMPLE_LOGS: LogEntry[] = [
  { id: '1', timestamp: '05-09 08:30:45.123', pid: 1200, tid: 1250, level: 'I', tag: 'ActivityManager', message: 'Start proc 5678:com.android.settings/u0a123 for activity com.android.settings/.Settings' },
  { id: '2', timestamp: '05-09 08:30:45.456', pid: 5678, tid: 5678, level: 'D', tag: 'Settings', message: 'Main screen initialized' },
  { id: '3', timestamp: '05-09 08:30:46.001', pid: 500, tid: 600, level: 'W', tag: 'Binder', message: 'Binder transaction took 150ms' },
  { id: '4', timestamp: '05-09 08:30:46.010', pid: 420, tid: 420, level: 'E', tag: 'SurfaceFlinger', message: 'Failed to acquire buffer from producer!' },
  { 
    id: 'crash-1', 
    timestamp: '05-09 08:31:00.000', 
    pid: 900, 
    tid: 900, 
    level: 'F', 
    tag: 'AndroidRuntime', 
    message: 'FATAL EXCEPTION: main\nProcess: com.android.systemui, PID: 900\njava.lang.NullPointerException: Attempt to invoke virtual method "void android.view.View.setVisibility(int)" on a null object reference\n\tat com.android.systemui.statusbar.phone.StatusBar.updateNotificationPanel(StatusBar.java:1542)\n\tat com.android.systemui.statusbar.phone.StatusBar.onNotificationEntryUpdated(StatusBar.java:2104)' 
  },
  { 
    id: 'anr-1', 
    timestamp: '05-09 08:32:15.555', 
    pid: 1200, 
    tid: 1210, 
    level: 'E', 
    tag: 'ActivityManager', 
    message: 'ANR in com.android.settings\nPID: 5678\nReason: Input dispatching timed out (Waiting to send non-key event because the touched window has not finished processing the relevant input events that were previously delivered to it for a total of 5000ms.)\nLoad: 2.5 / 1.8 / 1.4\nCPU usage from 0ms to 5000ms later (2026-05-09 08:31:10.000 to 2026-05-09 08:31:15.000):' 
  },
  { id: '5', timestamp: '05-09 08:33:02.112', pid: 5678, tid: 5690, level: 'I', tag: 'PowerManagerService', message: 'Going to sleep due to screen timeout...' },
  { id: '6', timestamp: '05-09 08:33:05.500', pid: 120, tid: 120, level: 'V', tag: 'WifiService', message: 'Scanning for networks...' }
];
