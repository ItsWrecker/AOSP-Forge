import { Lab } from '../types';

export const LABS: Lab[] = [
  {
    id: 'lab-custom-service',
    title: 'Create a System Service',
    difficulty: 'Intermediate',
    timeEstimate: '45 mins',
    objective: 'Learn how to add a custom system-wide service and expose it via AIDL.',
    steps: [
      'Define your AIDL interface in `frameworks/base/core/java/android/os/`.',
      'Implement the service logic by extending the generated Stub class.',
      'Register the service in `SystemServer.java`.',
      'Add permissions to `ServiceManager` for internal access.',
      'Build and flash a custom system image.'
    ],
    validation: 'Run `service list | grep my_custom_service` to verify registration.'
  }
];

export const ARCHITECTURE_DIAGRAMS = [
  {
    id: 'graphics-stack',
    title: 'Android Graphics Stack',
    content: `
graph TD
    App[App Process] -->|BufferQueue| SF[SurfaceFlinger]
    App -->|Canvas/OpenGL| HWUI[HWUI]
    SF -->|HWC API| HWC[Hardware Composer HAL]
    SF -->|BufferQueue| Gralloc[Gralloc HAL]
    HWC -->|Display Driver| Panel[Display Panel]
    Gralloc -->|DMA-BUF| GPU[GPU]
    GPU --> Panel
`
  },
  {
    id: 'binder-flow',
    title: 'Binder Transaction Flow',
    content: `
sequenceDiagram
    participant Client
    participant Proxy
    participant Kernel as Binder Driver
    participant Stub
    participant Server

    Client->>Proxy: callMethod(args)
    Proxy->>Proxy: Parcel.marshall(args)
    Proxy->>Kernel: ioctl(BINDER_WRITE_READ)
    Kernel->>Kernel: Copy to target task context
    Kernel->>Stub: Wake up server thread
    Stub->>Stub: onTransact()
    Stub->>Server: callMethod(args)
    Server-->>Stub: return result
    Stub-->>Kernel: ioctl(BINDER_WRITE_READ)
    Kernel-->>Proxy: Transaction complete
    Proxy-->>Client: Result
`
  }
];
