
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, User, Bell, Palette, 
  ShieldCheck, Moon, Sun, Monitor, Save, 
  Volume2, Mic, Brain, Info, Database,
  Archive, Trash2, AlertCircle, CheckCircle2, Loader2
} from 'lucide-react';
import { UserStats } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

interface SettingsProps {
  user: FirebaseUser | null;
  stats: UserStats;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  notifPreferences: {
    neuralPulse: boolean;
    weeklyBrief: boolean;
    streakAlerts: boolean;
  };
  setNotifPreferences: (prefs: any) => void;
  hotMicEnabled: boolean;
  onToggleHotMic: () => void;
  onClearVault: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  user, 
  stats, 
  theme, 
  setTheme, 
  notifPreferences,
  setNotifPreferences,
  hotMicEnabled, 
  onToggleHotMic,
  onClearVault 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'system'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const saveSettings = () => {
    setIsSaving(true);
    // Explicitly update parent if needed, but App.tsx has auto-sync useEffect
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Identity', icon: User },
    { id: 'notifications', label: 'Neural Alerts', icon: Bell },
    { id: 'appearance', label: 'Optics', icon: Palette },
    { id: 'system', label: 'Engine', icon: SettingsIcon },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        
        {/* Navigation Sidebar (Desktop Only for now) */}
        <div className="w-full md:w-80 space-y-4">
          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 shadow-xl hardware-border relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50" />
             <div className="relative z-10 flex flex-col gap-2">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4 flex items-center gap-3">
                  <SettingsIcon className="text-indigo-400" size={24} /> System Config
                </h2>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:border-white/10'}`}
                  >
                    <tab.icon size={18} /> {tab.label}
                  </button>
                ))}
             </div>
          </div>

          <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5 space-y-4">
             <div className="flex items-center gap-3">
                <Info size={16} className="text-slate-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Registry Version</span>
             </div>
             <p className="text-xs font-mono text-slate-400">SPI-CORE-v2.5.42-ARCHIVE</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="glass-panel p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden hardware-border">
                <div className="absolute inset-0 scanline opacity-5" />
                <div className="space-y-8 relative z-10">
                  <div className="flex items-start justify-between">
                     <div className="space-y-2">
                        <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Biological Identity</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Manage your neural signature</p>
                     </div>
                     <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400">
                        <ShieldCheck size={24} />
                     </div>
                  </div>

                  {user ? (
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Neural Sync Tag</label>
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black italic tracking-tighter text-lg">
                          {user.displayName}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Communication</label>
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-400 font-mono text-sm lowercase">
                          {user.email}
                        </div>
                      </div>
                      <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                        <CheckCircle2 size={24} className="text-emerald-500" />
                        <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                          Your identity is cryptographicly verified through the Registry. Changes must be handled through the main Neural Link portal.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-rose-500/5 rounded-3xl border border-rose-500/20">
                       <AlertCircle size={48} className="mx-auto text-rose-500 mb-6" />
                       <p className="text-lg font-black text-rose-500 uppercase tracking-tighter italic">Unauthorized Access</p>
                       <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Establish a Neural Link to manage identity profiles.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="glass-panel p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="space-y-10 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Priority Pulse</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Configure alert vectors</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'neuralPulse', label: 'Neural Pulse Alerts', desc: 'Real-time updates on registry changes', icon: Brain },
                      { id: 'weeklyBrief', label: 'Weekly Briefings', desc: 'Summary of your cognitive advancement', icon: Archive },
                      { id: 'streakAlerts', label: 'Streak Preservation', desc: 'Alerts when your neural link is fading', icon: FlameIcon }
                    ].map((item) => (
                      <div key={item.id} className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between hover:bg-white/[0.07] transition-all group">
                        <div className="flex items-center gap-6">
                           <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                              <item.icon size={20} />
                           </div>
                           <div>
                              <h4 className="font-black text-white italic tracking-tighter uppercase">{item.label}</h4>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.desc}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => setNotifPreferences(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof prev] }))}
                          className={`w-14 h-7 rounded-full transition-all relative border-2 ${notifPreferences[item.id as keyof typeof notifPreferences] ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-slate-700'}`}
                        >
                          <motion.div 
                            animate={{ x: notifPreferences[item.id as keyof typeof notifPreferences] ? 28 : 2 }}
                            className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={saveSettings}
                    disabled={isSaving}
                    className="btn-primary w-full py-6 flex items-center justify-center gap-4"
                  >
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    <span className="text-xs font-black uppercase tracking-widest">Persist Logic Matrix</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="glass-panel p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="space-y-10 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Optical Filters</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Customize the visual interface</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 group ${theme === 'dark' ? 'bg-indigo-600/20 border-indigo-500 shadow-xl' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                       <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-500'}`}>
                          <Moon size={32} />
                       </div>
                       <div className="text-center">
                          <p className="font-black text-white italic tracking-tighter uppercase">Obsidian Mode</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">High contrast / Low fatigue</p>
                       </div>
                    </button>

                    <button 
                      onClick={() => setTheme('light')}
                      className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 group ${theme === 'light' ? 'bg-indigo-600/20 border-indigo-500 shadow-xl' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                       <div className={`p-4 rounded-2xl ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-500'}`}>
                          <Sun size={32} />
                       </div>
                       <div className="text-center">
                          <p className="font-black text-white italic tracking-tighter uppercase">Celestial Mode</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">High clarity / Daylight sync</p>
                       </div>
                    </button>
                  </div>

                  <div className="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 flex items-center gap-4">
                    <Monitor size={24} className="text-indigo-400" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed italic">
                      Experimental 'System Sync' coming soon. Optical filters adjust dynamically based on Registry time-slice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="glass-panel p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="space-y-10 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Engine Core</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Configure deep logic systems</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6 group">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform border border-indigo-500/20">
                                <Mic size={24} />
                             </div>
                             <div>
                                <h4 className="font-black text-white italic tracking-tighter uppercase">Harvey Hot-Mic</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time simulator heuristics</p>
                             </div>
                          </div>
                          <button 
                            onClick={onToggleHotMic}
                            className={`w-14 h-7 rounded-full transition-all relative border-2 ${hotMicEnabled ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-slate-700'}`}
                          >
                            <motion.div 
                              animate={{ x: hotMicEnabled ? 28 : 2 }}
                              className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                            />
                          </button>
                       </div>
                       <p className="text-xs text-slate-400 font-bold leading-relaxed italic border-t border-white/5 pt-4">
                         Enabling the Hot-Mic allows the Harvey cognitive model to provide vocal insights during neural simulations and Masterclass sessions.
                       </p>
                    </div>

                    <div className="p-8 bg-rose-500/5 rounded-[2.5rem] border border-rose-500/10 space-y-6 group">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500 group-hover:scale-110 transition-transform border border-rose-500/20">
                                <Database size={24} />
                             </div>
                             <div>
                                <h4 className="font-black text-white italic tracking-tighter uppercase">Registry Cache</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manage localized neural data</p>
                             </div>
                          </div>
                          <button 
                            onClick={onClearVault}
                            className="px-6 py-2 bg-rose-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg active:scale-95"
                          >
                            Purge
                          </button>
                       </div>
                       <p className="text-xs text-rose-500/60 font-bold leading-relaxed italic border-t border-rose-500/10 pt-4">
                         CAUTION: Purging the Registry Cache will delete all localized Masterclass transmissions and visual heuristics.
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper for Bell/Flame which might not be imported or have different names
const FlameIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
