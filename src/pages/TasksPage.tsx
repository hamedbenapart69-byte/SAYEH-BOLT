import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { cn, taskStatusConfig, priorityConfig, getNowTime } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/Progress';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badges';
import { Modal } from '@/components/ui/Modal';
import type { Task, TaskStatus, TaskPriority } from '@/types';
import {
  ListTodo,
  Search,
  Plus,
  UserPlus,
  UserMinus,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  PlayCircle,
  AlertCircle,
  ChevronLeft,
  ChevronDown,
} from 'lucide-react';

export function TasksPage() {
  const { tasks, agents, assignTask, unassignTask, createTask, updateTaskStatus, deleteTask, toggleSubtask } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [assignMenuFor, setAssignMenuFor] = useState<string | null>(null);

  const filtered = tasks.filter((t) => {
    const matchesSearch = t.title.includes(search) || t.description.includes(search);
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusOptions = [
    { id: 'all', label: 'همه' },
    { id: 'pending', label: 'در انتظار' },
    { id: 'in_progress', label: 'در حال اجرا' },
    { id: 'review', label: 'بازبینی' },
    { id: 'completed', label: 'تکمیل‌شده' },
  ];

  const priorityOptions = [
    { id: 'all', label: 'همه' },
    { id: 'critical', label: 'بحرانی' },
    { id: 'high', label: 'زیاد' },
    { id: 'medium', label: 'متوسط' },
    { id: 'low', label: 'کم' },
  ];

  const availableAgents = (taskId: string) => agents.filter((a) => a.status !== 'offline' && a.currentTaskId !== taskId);

  const currentTask = selectedTask ? tasks.find((t) => t.id === selectedTask.id) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-50 flex items-center gap-3">
            <ListTodo className="text-primary-400" size={28} />
            مدیریت وظایف
          </h1>
          <p className="text-base-300 text-sm mt-1">تخصیص، پیگیری و مدیریت وظایف عاملان</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn btn-primary">
          <Plus size={18} />
          وظیفه جدید
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی وظیفه..."
            className="input pr-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setStatusFilter(opt.id)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                statusFilter === opt.id
                  ? 'bg-primary-500/15 text-primary-200 border border-primary-500/30'
                  : 'bg-base-850 text-base-200 border border-base-700/40 hover:border-base-600/60'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="input w-auto py-2"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filtered.map((task) => {
          const agent = agents.find((a) => a.id === task.assignedAgentId);
          return (
            <div key={task.id} className="panel panel-hover p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-base-50 font-semibold text-sm">{task.title}</h3>
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <p className="text-base-300 text-xs leading-relaxed mb-3 line-clamp-2">{task.description}</p>

                  <div className="flex items-center gap-4 text-xs text-base-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      مهلت: {task.dueDate}
                    </span>
                    {task.tags.map((tag) => (
                      <span key={tag} className="badge bg-base-700/40 text-base-200 text-[10px] px-2 py-0">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {(task.status === 'in_progress' || task.status === 'review') && (
                    <div className="mt-3">
                      <ProgressBar value={task.progress} showLabel color={task.status === 'review' ? 'bg-accent-500' : 'bg-warning-500'} />
                    </div>
                  )}
                </div>

                {/* Agent assignment */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                  {agent ? (
                    <div className="flex items-center gap-2">
                      <Avatar char={agent.avatar} status={agent.status} size="sm" />
                      <div className="text-right">
                        <div className="text-xs text-base-100 font-medium">{agent.name}</div>
                        <div className="text-[10px] text-base-300">{agent.role}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-base-400 flex items-center gap-1">
                      <AlertCircle size={12} className="text-warning-400" />
                      بدون عامل
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="p-1.5 rounded-lg hover:bg-base-800/60 text-base-300 hover:text-base-100 transition-colors"
                      title="جزئیات"
                    >
                      <Eye size={16} />
                    </button>

                    {task.assignedAgentId ? (
                      <button
                        onClick={() => unassignTask(task.id)}
                        className="p-1.5 rounded-lg hover:bg-danger-500/10 text-base-300 hover:text-danger-300 transition-colors"
                        title="لغو تخصیص"
                      >
                        <UserMinus size={16} />
                      </button>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() => setAssignMenuFor(assignMenuFor === task.id ? null : task.id)}
                          className="p-1.5 rounded-lg hover:bg-primary-500/10 text-base-300 hover:text-primary-300 transition-colors"
                          title="تخصیص عامل"
                        >
                          <UserPlus size={16} />
                        </button>
                        {assignMenuFor === task.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setAssignMenuFor(null)} />
                            <div className="absolute left-0 mt-2 w-56 panel z-50 animate-slide-up overflow-hidden">
                              <div className="px-3 py-2 border-b border-base-700/50 text-xs text-base-300">
                                انتخاب عامل
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                {availableAgents(task.id).map((a) => (
                                  <button
                                    key={a.id}
                                    onClick={() => {
                                      assignTask(task.id, a.id);
                                      setAssignMenuFor(null);
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-base-800/60 transition-colors text-right"
                                  >
                                    <Avatar char={a.avatar} status={a.status} size="sm" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm text-base-100 truncate">{a.name}</div>
                                      <div className="text-[10px] text-base-300 truncate">{a.role}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {task.status === 'pending' && task.assignedAgentId && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                        className="p-1.5 rounded-lg hover:bg-warning-500/10 text-base-300 hover:text-warning-300 transition-colors"
                        title="شروع اجرا"
                      >
                        <PlayCircle size={16} />
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'review')}
                        className="p-1.5 rounded-lg hover:bg-accent-500/10 text-base-300 hover:text-accent-300 transition-colors"
                        title="ارسال به بازبینی"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                    {task.status === 'review' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="p-1.5 rounded-lg hover:bg-success-500/10 text-base-300 hover:text-success-300 transition-colors"
                        title="تایید و تکمیل"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg hover:bg-danger-500/10 text-base-300 hover:text-danger-300 transition-colors"
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="panel p-12 text-center">
          <ListTodo size={40} className="text-base-500 mx-auto mb-3" />
          <p className="text-base-300">هیچ وظیفه‌ای یافت نشد</p>
        </div>
      )}

      {/* Task detail modal */}
      <Modal
        open={!!currentTask}
        onClose={() => setSelectedTask(null)}
        title={currentTask?.title || ''}
        size="lg"
        footer={
          currentTask && (
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs text-base-400 nums">به‌روزرسانی: {currentTask.updatedAt}</span>
              <div className="flex items-center gap-2">
                {currentTask.status !== 'completed' && currentTask.status !== 'cancelled' && (
                  <button onClick={() => { updateTaskStatus(currentTask.id, 'cancelled'); setSelectedTask(null); }} className="btn btn-ghost text-xs">
                    <XCircle size={14} /> لغو
                  </button>
                )}
                {currentTask.status === 'in_progress' && (
                  <button onClick={() => { updateTaskStatus(currentTask.id, 'review'); setSelectedTask(null); }} className="btn btn-ghost text-xs">
                    <CheckCircle2 size={14} /> ارسال به بازبینی
                  </button>
                )}
                {currentTask.status === 'review' && (
                  <button onClick={() => { updateTaskStatus(currentTask.id, 'completed'); setSelectedTask(null); }} className="btn btn-success text-xs bg-success-500 hover:bg-success-400 text-white">
                    <CheckCircle2 size={14} /> تایید نهایی
                  </button>
                )}
              </div>
            </div>
          )
        }
      >
        {currentTask && (
          <TaskDetail
            task={currentTask}
            onToggleSubtask={toggleSubtask}
          />
        )}
      </Modal>

      {/* Create task modal */}
      <CreateTaskModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={(data) => {
          createTask(data);
          setShowCreate(false);
        }}
        agents={agents}
      />
    </div>
  );
}

function TaskDetail({ task, onToggleSubtask }: { task: Task; onToggleSubtask: (taskId: string, subtaskId: string) => void }) {
  const { agents, getAgent } = useApp();
  const agent = getAgent(task.assignedAgentId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        {task.tags.map((tag) => (
          <span key={tag} className="badge bg-base-700/40 text-base-200 text-[10px]">{tag}</span>
        ))}
      </div>

      <p className="text-sm text-base-200 leading-relaxed">{task.description}</p>

      {agent && (
        <div className="flex items-center gap-3 bg-base-850/60 rounded-lg p-3 border border-base-700/40">
          <Avatar char={agent.avatar} status={agent.status} size="sm" />
          <div>
            <div className="text-sm text-base-100 font-medium">{agent.name}</div>
            <div className="text-xs text-base-300">{agent.role}</div>
          </div>
        </div>
      )}

      {(task.status === 'in_progress' || task.status === 'review') && (
        <div>
          <ProgressBar value={task.progress} showLabel color={task.status === 'review' ? 'bg-accent-500' : 'bg-warning-500'} />
        </div>
      )}

      {task.subtasks.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-base-100 mb-2">زیروظایف</h4>
          <div className="space-y-2">
            {task.subtasks.map((st) => (
              <button
                key={st.id}
                onClick={() => onToggleSubtask(task.id, st.id)}
                className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-base-800/60 transition-colors text-right"
              >
                <div className={cn(
                  'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all',
                  st.done ? 'bg-success-500 border-success-500' : 'border-base-500'
                )}>
                  {st.done && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className={cn('text-sm', st.done ? 'text-base-400 line-through' : 'text-base-100')}>
                  {st.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {task.result && (
        <div className="bg-success-500/10 border border-success-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} className="text-success-300" />
            <span className="text-sm font-medium text-success-200">نتیجه</span>
          </div>
          <p className="text-sm text-base-200">{task.result}</p>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-base-400">
        <span>ایجاد: {task.createdAt}</span>
        <span>مهلت: {task.dueDate}</span>
        <span className={cn(
          'badge text-[10px]',
          task.executionMode === 'live' ? 'bg-warning-500/10 text-warning-300' : 'bg-base-700/30 text-base-300'
        )}>
          {task.executionMode === 'live' ? 'اجرا زنده' : 'شبیه‌سازی'}
        </span>
      </div>
    </div>
  );
}

function CreateTaskModal({ open, onClose, onCreate, agents }: {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Partial<Task>) => void;
  agents: { id: string; name: string; avatar: string; status: string; role: string }[];
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [agentId, setAgentId] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({
      title,
      description,
      priority,
      dueDate: dueDate || 'نامشخص',
      tags: tags.split('،').map((t) => t.trim()).filter(Boolean),
      assignedAgentId: agentId || null,
      subtasks: [],
    });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTags('');
    setAgentId('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="ایجاد وظیفه جدید"
      size="md"
      footer={
        <>
          <button onClick={onClose} className="btn btn-ghost">انصراف</button>
          <button onClick={handleSubmit} className="btn btn-primary" disabled={!title.trim()}>
            <Plus size={16} /> ایجاد
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm text-base-200 block mb-1.5">عنوان وظیفه</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان..." className="input" />
        </div>
        <div>
          <label className="text-sm text-base-200 block mb-1.5">توضیحات</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="توضیحات وظیفه..." className="input min-h-[80px] resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-base-200 block mb-1.5">اولویت</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="input">
              <option value="low">کم</option>
              <option value="medium">متوسط</option>
              <option value="high">زیاد</option>
              <option value="critical">بحرانی</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-base-200 block mb-1.5">مهلت انجام</label>
            <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="مثلا: 1403/07/25" className="input" />
          </div>
        </div>
        <div>
          <label className="text-sm text-base-200 block mb-1.5">برچسب‌ها (با «،» جدا کنید)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="مثلا: امنیت، کد" className="input" />
        </div>
        <div>
          <label className="text-sm text-base-200 block mb-1.5">تخصیص به عامل (اختیاری)</label>
          <select value={agentId} onChange={(e) => setAgentId(e.target.value)} className="input">
            <option value="">بدون تخصیص</option>
            {agents.filter((a) => a.status !== 'offline').map((a) => (
              <option key={a.id} value={a.id}>{a.name} - {a.role}</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
