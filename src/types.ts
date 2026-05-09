export type ModuleId = 
  | 'KNOWLEDGE' 
  | 'LABS' 
  | 'ARCHITECTURE' 
  | 'BINDER' 
  | 'AAOS' 
  | 'CTS' 
  | 'HAL' 
  | 'INTERVIEW'
  | 'SEARCH'
  | 'LOGCAT';

export type LogLevel = 'V' | 'D' | 'I' | 'W' | 'E' | 'F';

export interface LogEntry {
  id: string;
  timestamp: string;
  pid: number;
  tid: number;
  level: LogLevel;
  tag: string;
  message: string;
}

export interface Tab {
  id: string;
  title: string;
  type: 'article' | 'lab' | 'diagram' | 'ai';
  contentId?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
}

export interface Lab {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  timeEstimate: string;
  objective: string;
  steps: string[];
  validation: string;
}
