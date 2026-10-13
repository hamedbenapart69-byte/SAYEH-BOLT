import { useApp } from '@/context/AppContext';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/utils';
import {
  Settings as SettingsIcon,
  Cpu,
  Bell,
  Volume2,
  Zap,
  Database,
  Globe,
  Key,
  Save,
  Info,
  Server,
  HardDrive,
  Activity,
} from 'lucide-react';

export function SettingsPage() {
  const { settings, updateSettings, setExecutionMode } = useApp();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-base-50 flex items-center gap-3">
          <SettingsIcon className="text-primary-400" size={28} />
          تنظیمات
        </h1>
        <p className="text-base-300 text-sm mt-1">پیکربندی سیستم و تنظیمات اجرا</p>
      </div>

      {/* Execution mode */}
      <SettingSection icon={Cpu} title="حالت اجرا" description="نوع اجرای عاملان هوش مصنوعی">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setExecutionMode('simulated')}
            className={cn(
              'p-4 rounded-lg border-2 text-right transition-all',
              settings.executionMode === 'simulated'
                ? 'border-primary-500/40 bg-primary-500/10'
                : 'border-base-700/40 bg-base-850/60 hover:border-base-600/60'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className={settings.executionMode === 'simulated' ? 'text-primary-300' : 'text-base-300'} />
              <span className={cn('font-medium', settings.executionMode === 'simulated' ? 'text-primary-200' : 'text-base-200')}>
                حالت شبیه‌سازی
              </span>
            </div>
            <p className="text-xs text-base-300">
              فعالیت‌ها به صورت نمایشی شبیه‌سازی می‌شوند. مناسب برای نمایش و آزمایش
            </p>
          </button>

          <button
            onClick={() => setExecutionMode('live')}
            className={cn(
              'p-4 rounded-lg border-2 text-right transition-all',
              settings.executionMode === 'live'
                ? 'border-warning-500/40 bg-warning-500/10'
                : 'border-base-700/40 bg-base-850/60 hover:border-base-600/60'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className={settings.executionMode === 'live' ? 'text-warning-300' : 'text-base-300'} />
              <span className={cn('font-medium', settings.executionMode === 'live' ? 'text-warning-200' : 'text-base-200')}>
                حالت زنده
              </span>
            </div>
            <p className="text-xs text-base-300">
              اتصال به API واقعی هوش مصنوعی. نیاز به پیکربندی کلید API دارد
            </p>
          </button>
        </div>

        {settings.executionMode === 'live' && !settings.apiKey && (
          <div className="mt-3 flex items-start gap-2 bg-warning-500/10 border border-warning-500/20 rounded-lg p-3">
            <Info size={14} className="text-warning-300 shrink-0 mt-0.5" />
            <p className="text-xs text-warning-200">
              حالت زنده فعال است اما کلید API تنظیم نشده. فعالیتی واقعی اجرا نخواهد شد. لطفاً کلید API را در بخش اتصال وارد کنید.
            </p>
          </div>
        )}
      </SettingSection>

      {/* Simulation settings */}
      <SettingSection icon={Activity} title="تنظیمات شبیه‌سازی" description="کنترل سرعت و رفتار موتور شبیه‌سازی">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-base-200">سرعت شبیه‌سازی</span>
              <span className="text-sm text-primary-300 nums font-medium">{settings.simulationSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={settings.simulationSpeed}
              onChange={(e) => updateSettings({ simulationSpeed: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-[10px] text-base-400 mt-1">
              <span>کند</span>
              <span>تند</span>
            </div>
          </div>

          <Toggle
            label="تخصیص خودکار وظایف به عاملان بیکار"
            checked={settings.autoAssign}
            onChange={(v) => updateSettings({ autoAssign: v })}
          />
        </div>
      </SettingSection>

      {/* Notifications */}
      <SettingSection icon={Bell} title="اعلان‌ها" description="مدیریت اعلان‌های سیستم">
        <div className="space-y-4">
          <Toggle
            label="فعال‌سازی اعلان‌ها"
            checked={settings.notificationsEnabled}
            onChange={(v) => updateSettings({ notificationsEnabled: v })}
          />
          <Toggle
            label="پخش صدا برای اعلان‌ها"
            checked={settings.soundEnabled}
            onChange={(v) => updateSettings({ soundEnabled: v })}
          />
        </div>
      </SettingSection>

      {/* API Connection */}
      <SettingSection icon={Key} title="اتصال به API هوش مصنوعی" description="پیکربندی اتصال واقعی به سرویس‌های هوش مصنوعی">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-base-200 block mb-1.5 flex items-center gap-1">
              <Globe size={14} className="text-base-300" />
              آدرس API
            </label>
            <input
              value={settings.apiEndpoint}
              onChange={(e) => updateSettings({ apiEndpoint: e.target.value })}
              placeholder="https://api.example.com/v1"
              className="input"
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-sm text-base-200 block mb-1.5 flex items-center gap-1">
              <Key size={14} className="text-base-300" />
              کلید API
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
              placeholder="sk-..."
              className="input"
              dir="ltr"
            />
            <p className="text-[10px] text-base-400 mt-1.5 flex items-center gap-1">
              <Info size={10} />
              کلید API به صورت امن ذخیره می‌شود و در محیط اجرا استفاده می‌گردد
            </p>
          </div>
        </div>
      </SettingSection>

      {/* Data persistence */}
      <SettingSection icon={Database} title="ذخیره‌سازی داده" description="نحوه نگهداری داده‌های سیستم">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateSettings({ dataPersistence: 'local' })}
            className={cn(
              'p-4 rounded-lg border-2 text-right transition-all',
              settings.dataPersistence === 'local'
                ? 'border-primary-500/40 bg-primary-500/10'
                : 'border-base-700/40 bg-base-850/60 hover:border-base-600/60'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <HardDrive size={18} className={settings.dataPersistence === 'local' ? 'text-primary-300' : 'text-base-300'} />
              <span className={cn('font-medium text-sm', settings.dataPersistence === 'local' ? 'text-primary-200' : 'text-base-200')}>
                حافظه محلی
              </span>
            </div>
            <p className="text-xs text-base-300">داده‌ها در مرورگر نگهداری می‌شوند</p>
          </button>

          <button
            onClick={() => updateSettings({ dataPersistence: 'supabase' })}
            className={cn(
              'p-4 rounded-lg border-2 text-right transition-all',
              settings.dataPersistence === 'supabase'
                ? 'border-accent-500/40 bg-accent-500/10'
                : 'border-base-700/40 bg-base-850/60 hover:border-base-600/60'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Server size={18} className={settings.dataPersistence === 'supabase' ? 'text-accent-300' : 'text-base-300'} />
              <span className={cn('font-medium text-sm', settings.dataPersistence === 'supabase' ? 'text-accent-200' : 'text-base-200')}>
                پایگاه داده Supabase
              </span>
            </div>
            <p className="text-xs text-base-300">داده‌ها در پایگاه داده ابری ذخیره می‌شوند</p>
          </button>
        </div>

        {settings.dataPersistence === 'supabase' && (
          <div className="mt-3 flex items-start gap-2 bg-accent-500/10 border border-accent-500/20 rounded-lg p-3">
            <Info size={14} className="text-accent-300 shrink-0 mt-0.5" />
            <p className="text-xs text-accent-200">
              ذخیره‌سازی ابری انتخاب شد. برای فعال‌سازی، باید جداول پایگاه داده ایجاد شوند. این قابلیت در نسخه‌های آینده فعال می‌شود.
            </p>
          </div>
        )}
      </SettingSection>

      {/* About */}
      <SettingSection icon={Info} title="درباره سایه" description="اطلاعات سیستم">
        <div className="space-y-2 text-sm">
          <InfoRow label="نام سیستم" value="سایه (SAYEH)" />
          <InfoRow label="نسخه" value="1.0.0" />
          <InfoRow label="تعداد عاملان" value="8 عامل هوش مصنوعی" />
          <InfoRow label="حالت فعلی" value={settings.executionMode === 'live' ? 'زنده (بدون اتصال واقعی)' : 'شبیه‌سازی'} />
        </div>
      </SettingSection>
    </div>
  );
}

function SettingSection({ icon: Icon, title, description, children }: {
  icon: typeof Cpu;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-primary-300" />
        </div>
        <div>
          <h2 className="text-base-50 font-semibold">{title}</h2>
          <p className="text-base-300 text-xs mt-0.5">{description}</p>
        </div>
      </div>
      <div className="mr-13">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-base-800/40 last:border-0">
      <span className="text-base-300">{label}</span>
      <span className="text-base-100 font-medium">{value}</span>
    </div>
  );
}
