export type AgentStatus = 'active' | 'idle' | 'busy' | 'offline' | 'error';
export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'failed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';
export type ExecutionMode = 'simulated' | 'live';

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  roleKey: string;
  avatar: string;
  status: AgentStatus;
  capabilities: string[];
  currentTaskId: string | null;
  completedTasks: number;
  successRate: number;
  cpuUsage: number;
  memoryUsage: number;
  model: string;
  description: string;
  isReal: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedAgentId: string | null;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  progress: number;
  tags: string[];
  dependencies: string[];
  executionMode: ExecutionMode;
  result?: string;
  subtasks: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  agentId: string | null;
  agentName: string;
  level: LogLevel;
  action: string;
  details: string;
  taskId: string | null;
  isReal: boolean;
}

export interface ChatMessage {
  id: string;
  agentId: string;
  agentName: string;
  avatar: string;
  content: string;
  timestamp: string;
  isReal: boolean;
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: 'start' | 'task' | 'decision' | 'end' | 'agent';
  agentId?: string;
  status: 'pending' | 'active' | 'done' | 'error';
  x: number;
  y: number;
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  active: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
}

export interface AppSettings {
  executionMode: ExecutionMode;
  simulationSpeed: number;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  autoAssign: boolean;
  theme: 'dark' | 'midnight' | 'stealth';
  language: 'fa';
  apiEndpoint: string;
  apiKey: string;
  dataPersistence: 'local' | 'supabase';
}

export type PageId =
  | 'command'
  | 'agents'
  | 'tasks'
  | 'logs'
  | 'communication'
  | 'workflow'
  | 'settings';
