import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import {
  MessagesSquare,
  Send,
  Cpu,
  Users,
} from 'lucide-react';

export function CommunicationPage() {
  const { messages, agents, sendMessage, settings } = useApp();
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !selectedAgent) return;
    sendMessage(input.trim(), selectedAgent);
    setInput('');
  };

  // Group messages by time proximity
  const grouped: { agentId: string; msgs: typeof messages }[] = [];
  messages.forEach((msg) => {
    const lastGroup = grouped[grouped.length - 1];
    if (lastGroup && lastGroup.agentId === msg.agentId) {
      lastGroup.msgs.push(msg);
    } else {
      grouped.push({ agentId: msg.agentId, msgs: [msg] });
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-base-50 flex items-center gap-3">
          <MessagesSquare className="text-primary-400" size={28} />
          ارتباط تیمی
        </h1>
        <p className="text-base-300 text-sm mt-1">کانال ارتباطی بین عاملان هوش مصنوعی</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)] min-h-[400px]">
        {/* Agent list sidebar */}
        <div className="panel p-4 lg:col-span-1 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-primary-400" />
            <h2 className="text-base-50 font-semibold text-sm">اعضای کانال</h2>
          </div>
          <div className="space-y-1">
            {agents.filter((a) => a.status !== 'offline').map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={cn(
                  'flex items-center gap-3 w-full p-2 rounded-lg transition-colors text-right',
                  selectedAgent === agent.id ? 'bg-primary-500/10 border border-primary-500/20' : 'hover:bg-base-800/60 border border-transparent'
                )}
              >
                <Avatar char={agent.avatar} status={agent.status} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-base-100 font-medium truncate">{agent.name}</div>
                  <div className="text-[10px] text-base-300 truncate">{agent.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="panel flex flex-col lg:col-span-3 overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-base-700/50">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <MessagesSquare size={16} className="text-primary-300" />
            </div>
            <div>
              <h2 className="text-base-50 font-semibold text-sm">کانال عمومی تیم سایه</h2>
              <span className="text-[10px] text-base-400">
                {agents.filter((a) => a.status !== 'offline').length} عضو آنلاین
              </span>
            </div>
            <div className="mr-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-500/5 border border-primary-500/15">
              <span className={cn('status-dot', settings.executionMode === 'live' ? 'bg-warning-400' : 'bg-primary-400 animate-blink')} />
              <span className="text-[10px] text-primary-200">
                {settings.executionMode === 'live' ? 'زنده' : 'شبیه‌سازی'}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {grouped.map((group, gi) => {
              const agent = agents.find((a) => a.id === group.agentId);
              if (!agent) return null;
              return (
                <div key={gi} className="flex items-start gap-3 animate-fade-in">
                  <Avatar char={agent.avatar} status={agent.status} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-base-50 font-medium">{agent.name}</span>
                      <span className="text-[10px] text-base-400">{agent.role}</span>
                      <span className="text-[10px] text-base-400 nums mr-auto">{group.msgs[0].timestamp}</span>
                    </div>
                    <div className="space-y-1.5">
                      {group.msgs.map((msg) => (
                        <div key={msg.id} className="bg-base-850/60 rounded-lg px-3 py-2 border border-base-700/30 max-w-[85%]">
                          <p className="text-sm text-base-100 leading-relaxed">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-3 border-t border-base-700/50">
            <div className="flex items-center gap-2">
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="input w-auto py-2 text-sm max-w-[140px]"
              >
                {agents.filter((a) => a.status !== 'offline').map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="پیام خود را بنویسید..."
                className="input flex-1"
              />
              <button onClick={handleSend} disabled={!input.trim()} className="btn btn-primary shrink-0">
                <Send size={16} />
                <span className="hidden sm:inline">ارسال</span>
              </button>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-base-400">
              <Cpu size={10} />
              <span>پیام‌ها در حالت شبیه‌سازی توسط عامل نمایشی ارسال می‌شوند</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
