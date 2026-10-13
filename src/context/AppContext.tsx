import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  AIAgent,
  Task,
  ActivityLog,
  ChatMessage,
  AppSettings,
  ExecutionMode,
  TaskStatus,
} from '@/types';
import {
  mockAgents,
  mockTasks,
  mockLogs,
  mockMessages,
  defaultSettings,
} from '@/data/mockData';
import { generateId, getNowTime } from '@/lib/utils';

interface AppContextValue {
  agents: AIAgent[];
  tasks: Task[];
  logs: ActivityLog[];
  messages: ChatMessage[];
  settings: AppSettings;
  isSimulating: boolean;
  assignTask: (taskId: string, agentId: string) => void;
  unassignTask: (taskId: string) => void;
  createTask: (task: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  sendMessage: (content: string, agentId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setExecutionMode: (mode: ExecutionMode) => void;
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  getAgent: (id: string | null) => AIAgent | undefined;
  getTask: (id: string | null) => Task | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

const simulationActions = [
  'بررسی وضعیت سیستم',
  'پایش منابع',
  'به‌روزرسانی شاخص‌ها',
  'همگام‌سازی داده‌ها',
  'تحلیل وضعیت جاری',
  'بررسی صف وظایف',
  'گزارش‌گیری دوره‌ای',
  'اسکن امنیتی',
  'بهینه‌سازی کارایی',
  'بازبینی خروجی‌ها',
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<AIAgent[]>(mockAgents);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [logs, setLogs] = useState<ActivityLog[]>(mockLogs);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isSimulating, setIsSimulating] = useState(true);
  const tickRef = useRef(0);

  const addLog = useCallback((log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    setLogs((prev) => [
      {
        ...log,
        id: generateId('log'),
        timestamp: `${getNowTime()}`,
      },
      ...prev,
    ].slice(0, 100));
  }, []);

  const getAgent = useCallback(
    (id: string | null) => agents.find((a) => a.id === id),
    [agents]
  );

  const getTask = useCallback(
    (id: string | null) => tasks.find((t) => t.id === id),
    [tasks]
  );

  const assignTask = useCallback(
    (taskId: string, agentId: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, assignedAgentId: agentId, status: 'assigned', updatedAt: getNowTime() }
            : t
        )
      );
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentId
            ? { ...a, currentTaskId: taskId, status: 'busy' }
            : a
        )
      );
      const agent = agents.find((a) => a.id === agentId);
      const task = tasks.find((t) => t.id === taskId);
      addLog({
        agentId,
        agentName: agent?.name || 'نامشخص',
        level: 'info',
        action: 'محول کردن وظیفه',
        details: `وظیفه «${task?.title || ''}» به عامل ${agent?.name} محول شد`,
        taskId,
        isReal: settings.executionMode === 'live',
      });
    },
    [agents, tasks, addLog, settings.executionMode]
  );

  const unassignTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, assignedAgentId: null, status: 'pending', updatedAt: getNowTime() }
            : t
        )
      );
      if (task?.assignedAgentId) {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === task.assignedAgentId
              ? { ...a, currentTaskId: null, status: 'idle' }
              : a
          )
        );
      }
    },
    [tasks]
  );

  const createTask = useCallback(
    (task: Partial<Task>) => {
      const newTask: Task = {
        id: generateId('task'),
        title: task.title || 'وظیفه بدون عنوان',
        description: task.description || '',
        status: 'pending',
        priority: task.priority || 'medium',
        assignedAgentId: task.assignedAgentId || null,
        createdAt: getNowTime(),
        updatedAt: getNowTime(),
        dueDate: task.dueDate || 'نامشخص',
        progress: 0,
        tags: task.tags || [],
        dependencies: [],
        executionMode: settings.executionMode,
        result: undefined,
        subtasks: task.subtasks || [],
      };
      setTasks((prev) => [newTask, ...prev]);
      addLog({
        agentId: null,
        agentName: 'سیستم',
        level: 'info',
        action: 'ایجاد وظیفه جدید',
        details: `وظیفه «${newTask.title}» در سیستم ثبت شد`,
        taskId: newTask.id,
        isReal: false,
      });
    },
    [addLog, settings.executionMode]
  );

  const updateTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      const task = tasks.find((t) => t.id === taskId);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status,
                progress: status === 'completed' ? 100 : t.progress,
                updatedAt: getNowTime(),
                result:
                  status === 'completed'
                    ? t.result || 'وظیفه با موفقیت تکمیل شد (شبیه‌سازی)'
                    : t.result,
              }
            : t
        )
      );
      if (task?.assignedAgentId) {
        setAgents((prev) =>
          prev.map((a) => {
            if (a.id === task.assignedAgentId) {
              if (status === 'completed' || status === 'cancelled' || status === 'failed') {
                return { ...a, currentTaskId: null, status: 'idle', completedTasks: status === 'completed' ? a.completedTasks + 1 : a.completedTasks };
              }
              if (status === 'in_progress') {
                return { ...a, status: 'busy' };
              }
            }
            return a;
          })
        );
      }
      const agent = agents.find((a) => a.id === task?.assignedAgentId);
      const statusLabels: Record<TaskStatus, string> = {
        pending: 'در انتظار',
        assigned: 'محول‌شده',
        in_progress: 'در حال اجرا',
        review: 'در حال بازبینی',
        completed: 'تکمیل‌شده',
        failed: 'ناموفق',
        cancelled: 'لغوشده',
      };
      addLog({
        agentId: task?.assignedAgentId || null,
        agentName: agent?.name || 'سیستم',
        level: status === 'completed' ? 'success' : status === 'failed' ? 'error' : 'info',
        action: 'تغییر وضعیت وظیفه',
        details: `وضعیت وظیفه «${task?.title}» به «${statusLabels[status]}» تغییر یافت`,
        taskId,
        isReal: settings.executionMode === 'live',
      });
    },
    [tasks, agents, addLog, settings.executionMode]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (task?.assignedAgentId) {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === task.assignedAgentId
              ? { ...a, currentTaskId: null, status: 'idle' }
              : a
          )
        );
      }
    },
    [tasks]
  );

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const subtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, done: !st.done } : st
        );
        const doneCount = subtasks.filter((s) => s.done).length;
        const progress = Math.round((doneCount / subtasks.length) * 100);
        return { ...t, subtasks, progress, updatedAt: getNowTime() };
      })
    );
  }, []);

  const sendMessage = useCallback(
    (content: string, agentId: string) => {
      const agent = agents.find((a) => a.id === agentId);
      if (!agent) return;
      const msg: ChatMessage = {
        id: generateId('msg'),
        agentId,
        agentName: agent.name,
        avatar: agent.avatar,
        content,
        timestamp: getNowTime().slice(0, 5),
        isReal: settings.executionMode === 'live',
      };
      setMessages((prev) => [...prev, msg]);
    },
    [agents, settings.executionMode]
  );

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const setExecutionMode = useCallback(
    (mode: ExecutionMode) => {
      setSettings((prev) => ({ ...prev, executionMode: mode }));
      setIsSimulating(mode === 'simulated');
      addLog({
        agentId: null,
        agentName: 'سیستم',
        level: 'info',
        action: 'تغییر حالت اجرا',
        details:
          mode === 'simulated'
            ? 'حالت اجرا به «شبیه‌سازی» تغییر یافت. فعالیت‌ها شبیه‌سازی شده هستند'
            : 'حالت اجرا به «زنده» تغییر یافت. توجه: اتصال واقعی هنوز پیکربندی نشده است',
        taskId: null,
        isReal: mode === 'live',
      });
    },
    [addLog]
  );

  // Simulation engine
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      tickRef.current++;

      // Fluctuate CPU/memory for active agents
      setAgents((prev) =>
        prev.map((a) => {
          if (a.status === 'offline') return a;
          if (a.status === 'idle' || a.status === 'error') {
            return {
              ...a,
              cpuUsage: Math.max(2, Math.min(15, a.cpuUsage + (Math.random() - 0.5) * 4)),
              memoryUsage: Math.max(5, Math.min(25, a.memoryUsage + (Math.random() - 0.5) * 3)),
            };
          }
          return {
            ...a,
            cpuUsage: Math.max(10, Math.min(90, a.cpuUsage + (Math.random() - 0.5) * 8)),
            memoryUsage: Math.max(20, Math.min(95, a.memoryUsage + (Math.random() - 0.5) * 6)),
          };
        })
      );

      // Advance in_progress task progress
      if (tickRef.current % 3 === 0) {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.status === 'in_progress' && t.progress < 95) {
              const inc = Math.random() * 5 + 1;
              const newProgress = Math.min(95, t.progress + inc);
              return { ...t, progress: Math.round(newProgress) };
            }
            return t;
          })
        );
      }

      // Generate periodic logs
      if (tickRef.current % 5 === 0) {
        const activeAgents = agents.filter((a) => a.status === 'active' || a.status === 'busy');
        if (activeAgents.length > 0) {
          const agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
          const action = simulationActions[Math.floor(Math.random() * simulationActions.length)];
          addLog({
            agentId: agent.id,
            agentName: agent.name,
            level: Math.random() > 0.8 ? 'warning' : 'info',
            action,
            details: `فعالیت دوره‌ای شبیه‌سازی شده توسط ${agent.name}`,
            taskId: agent.currentTaskId,
            isReal: false,
          });
        }
      }
    }, 3000 / settings.simulationSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, settings.simulationSpeed, agents, addLog]);

  return (
    <AppContext.Provider
      value={{
        agents,
        tasks,
        logs,
        messages,
        settings,
        isSimulating,
        assignTask,
        unassignTask,
        createTask,
        updateTaskStatus,
        deleteTask,
        toggleSubtask,
        sendMessage,
        updateSettings,
        setExecutionMode,
        addLog,
        getAgent,
        getTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
