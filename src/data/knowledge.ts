import { Article } from '../types';

export const KNOWLEDGE_BASE: Article[] = [
  {
    id: 'binder-internals',
    title: 'Binder IPC Internals',
    category: 'System Architecture',
    content: `
# Binder IPC Internals

Binder is the primary inter-process communication (IPC) mechanism in Android. It is a custom RPC system that allows a process (client) to call a method in another process (server).

## Key Components
- **Binder Driver**: A character device driver (\`/dev/binder\`) that manages communication.
- **Service Manager**: A special binder node that tracks registered services.
- **AIDL (Android Interface Definition Language)**: Used to define the interface between client and server.
- **Proxy and Stub**: Generated classes that handle marshalling and unmarshalling.

## The Transaction Flow
1. Client calls a method on the Proxy.
2. Proxy packages arguments into a \`Parcel\`.
3. Proxy calls \`transact()\` which enters the kernel via \`ioctl\`.
4. Kernel transfers data to the target process's shared memory.
5. Server thread is woken up and calls its Stub's \`onTransact()\`.
`,
    tags: ['IPC', 'Binder', 'Kernel']
  },
  {
    id: 'boot-sequence',
    title: 'Android Boot Sequence',
    category: 'Platform Core',
    content: `
# Android Boot Sequence

The journey from power-on to the launcher involves several distinct stages.

## Stage 1: Bootloader
The CPU starts at a fixed address and executes the Bootloader (e.g., Little Kernel - LK). It initializes hardware and loads the kernel into RAM.

## Stage 2: Linux Kernel
The kernel initializes hardware drivers, sets up memory management, and mounts the root RAM disk. Its final task is to launch the \`init\` process.

## Stage 3: Init Process
The \`init\` process (\`/system/bin/init\`) reads \`*.rc\` files and starts essential system daemons like \`ueventd\`, \`logd\`, and \`servicemanager\`.

## Stage 4: Zygote
The \`app_process\` launches the Zygote. Zygote preloads common classes and resources used by Android apps to improve startup performance.

## Stage 5: System Server
Zygote forks the System Server process, which starts all core Android services (\`ActivityManagerService\`, \`PackageManagerService\`, etc.).
`,
    tags: ['Boot', 'Kernel', 'Zygote', 'Init']
  },
  {
    id: 'aaos-evs',
    title: 'AAOS External View System (EVS)',
    category: 'Automotive',
    content: `
# AAOS External View System (EVS)

The External View System (EVS) service provides hardware-accelerated rendering of external cameras (like rearview) early in the boot cycle, often before the System Server is even fully initialized.

## Architecture
- **EVS Manager**: A system daemon (\`evs_manager\`) that brokering access to camera hardware.
- **EVS Display**: Manages the low-level rendering buffer directly to the display controller.
- **EVS HAL**: The hardware-specific driver layer.

## Key Performance Requirements
The EVS must be capable of showing the rearview camera within **2 seconds** of power-on to meet safety regulations (like FMVSS 111).
`,
    tags: ['AAOS', 'Automotive', 'EVS', 'Camera']
  }
];
