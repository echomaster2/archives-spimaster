
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Zap, Coins, Flame, Star, TrendingUp, 
  CheckCircle2, Target, Brain, Rocket, ShieldCheck,
  User, BarChart3, Trophy, Waves, ShoppingBag,
  Mail, Shield, Share2, ChevronRight, Lock, Activity, X, Clock
} from 'lucide-react';
import { UserStats, Badge, Quest } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import { AVATAR_OPTIONS } from '../data/avatars';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ProfileProps {
  stats: UserStats;
  badges: Badge[];
  quests: Quest[];
  user: FirebaseUser | null;
  onBuyBoost: (boostId: string, cost: number) => void;
  onUpdateAvatar: (avatarId: string) => void;
  hotMicEnabled: boolean;
  onToggleHotMic: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  stats, badges, quests, user, onBuyBoost, onUpdateAvatar, hotMicEnabled, onToggleHotMic 
}) => {
  const levelProgress = (stats.xp % 1000) / 10;
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === stats.avatarId) || AVATAR_OPTIONS[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SPI Master: Neural Achievement',
        text: `I just reached Level ${stats.level} in Sonography Principles! Check out my neural progress.`,
        url: window.location.href
      }).catch(console.error);
    } else {
      alert("Sharing not supported on this browser. Copy the URL to share your progress!");
    }
  };

  return (
    <div className="space-y-6 md:space-y-12 max-w-7xl mx-auto pb-40 px-2 md:px-0 animate-in fade-in duration-1000">
      {/* User Identity Section */}
      {user && (
        <div className="glass-panel p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-white/10 shadow-4xl relative overflow-hidden group hardware-border">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent opacity-50" />
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <currentAvatar.icon size={160} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="relative group/avatar cursor-pointer" onClick={() => setShowAvatarSelector(true)}>
              <div className={`w-32 h-32 md:w-56 md:h-56 rounded-2xl md:rounded-[4rem] border-4 border-indigo-500/30 p-1.5 md:p-3 bg-slate-900 shadow-2xl transition-all duration-500 overflow-hidden relative ${currentAvatar.color && `bg-gradient-to-br ${currentAvatar.color}`}`}>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">Change Avatar</span>
                </div>
                <div className="w-full h-full flex items-center justify-center text-white">
                  <currentAvatar.icon size={64} className="md:w-32 md:h-32" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-emerald-500 text-white p-2 md:p-4 rounded-xl md:rounded-3xl shadow-xl border-2 md:border-4 border-[#050608]">
                <Award size={16} className="md:w-8 md:h-8" />
              </div>
            </div>
            
            <div className="text-center md:text-left space-y-4 md:space-y-8 flex-1">
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row items-center md:items-baseline gap-4">
                  <h2 className="text-3xl md:text-8xl font-black tracking-tighter italic uppercase text-white leading-none">{user.displayName || 'Neural Specialist'}</h2>
                  <span className="px-4 py-1 bg-indigo-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em]">{currentAvatar.name}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 font-mono">
                  <span className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-3 md:px-4 py-1.5 rounded-xl border border-white/5">
                    <Mail size={10} className="md:w-3 md:h-3 text-indigo-400" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 md:px-4 py-1.5 rounded-xl border border-emerald-500/20">
                    <ShieldCheck size={10} className="md:w-3 md:h-3" /> Identity Verified
                  </span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl border-l-4 border-l-indigo-500 flex-1">
                  <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] italic leading-relaxed">
                    "{currentAvatar.description}" Current neural synchronization is holding at nominal levels. Archive access granted for all forged artifacts.
                  </p>
                </div>
                <button 
                  onClick={handleShare}
                  className="flex items-center justify-center gap-4 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                >
                  <Share2 size={16} /> Broadcast Achievement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Selector Modal */}
      <AnimatePresence>
        {showAvatarSelector && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAvatarSelector(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl glass-panel rounded-[3rem] border border-white/10 p-8 md:p-16 max-h-[80vh] overflow-y-auto hardware-border"
            >
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">Select Neural Persona</h3>
                <button onClick={() => setShowAvatarSelector(false)} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {AVATAR_OPTIONS.map((option) => {
                  const isLocked = stats.level < option.minLevel;
                  const isActive = stats.avatarId === option.id;
                  return (
                    <div 
                      key={option.id}
                      onClick={() => !isLocked && onUpdateAvatar(option.id)}
                      className={`p-8 rounded-[2rem] border-2 transition-all relative overflow-hidden group cursor-pointer
                        ${isActive ? 'bg-indigo-600/20 border-indigo-500 scale-[1.02] shadow-2xl' : 'bg-white/5 border-white/10 hover:border-white/30'}
                        ${isLocked ? 'opacity-40 grayscale cursor-not-allowed' : ''}
                      `}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 bg-gradient-to-br ${option.color} shadow-xl`}>
                        <option.icon size={32} />
                      </div>
                      <h4 className="text-xl font-black uppercase italic tracking-tighter text-white mb-2">{option.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-4">{option.description}</p>
                      
                      {isLocked ? (
                        <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                          <Lock size={12} /> Unlocks at Level {option.minLevel}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                          {isActive ? 'Current Identity' : 'Available for Sync'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
        <StatCard icon={<Star size={16} className="text-yellow-400 md:w-8 md:h-8" />} label="Level" value={stats.level} subValue={`${stats.xp % 1000}/1000 XP`} glitch />
        <StatCard icon={<Flame size={16} className="text-orange-400 md:w-8 md:h-8" />} label="Streak" value={`${stats.streak} Days`} subValue="Daily Goal Sync" glitch />
        <StatCard icon={<Coins size={16} className="text-amber-400 md:w-8 md:h-8" />} label="Neural Credits" value={stats.coins} subValue="Spend in Shop" />
        <StatCard icon={<TrendingUp size={16} className="text-indigo-400 md:w-8 md:h-8" />} label="Composite XP" value={stats.xp.toLocaleString()} subValue="All-Time Growth" />
      </div>

      {/* Performance Analytics & Neural Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-white flex items-center gap-4">
              <Activity className="text-indigo-400" /> Neural Growth Matrix
            </h3>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden md:block">Historical Efficiency: 94.2%</span>
               <div className="w-12 h-6 bg-white/5 rounded-full border border-white/10 p-1">
                  <div className="w-4 h-full bg-indigo-500 rounded-full" />
               </div>
            </div>
          </div>
          
          <div className="glass-panel p-8 md:p-12 rounded-[3rem] border border-white/10 bg-slate-900/50 backdrop-blur-3xl h-[450px] relative overflow-hidden group">
            <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.history.length > 0 ? stats.history : [{date: 'No Data', xpEarned: 0, lessonsCompleted: 0}]}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.split(' ').slice(1, 3).join(' ')}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="xpEarned" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorXp)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Quests */}
        <div className="lg:col-span-4">
          <div className="p-8 md:p-10 bg-slate-900/40 border border-white/10 rounded-[3rem] h-full flex flex-col space-y-10">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Daily Missions</h3>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Logic reset in 12h</p>
               </div>
               <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-2xl">
                  <Target size={24} />
               </div>
            </div>

            <div className="space-y-4 flex-1">
              {quests.map((quest) => (
                <div key={quest.id} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                   <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                         <div className={`p-2.5 rounded-xl ${quest.isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500 group-hover:text-white transition-colors'}`}>
                            {quest.type === 'daily' ? <Flame size={14}/> : <Trophy size={14}/>}
                         </div>
                         <div>
                            <h4 className="text-[11px] font-black uppercase italic text-white leading-none mb-1">{quest.title}</h4>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">{quest.description}</p>
                         </div>
                      </div>
                      {quest.isCompleted && <CheckCircle2 size={14} className="text-emerald-500" />}
                   </div>
                   <div className="space-y-2 relative z-10">
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                           className={`h-full ${quest.isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                         />
                      </div>
                      <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-slate-500 animate-pulse">
                         <span>Units: {quest.progress}/{quest.target}</span>
                         <span className={quest.isCompleted ? 'text-emerald-500' : 'text-indigo-400'}>+{quest.xpReward} XP</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-5 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-white transition-all">
               View Full Quest Log
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Badges & Mastery */}
        <div className="lg:col-span-12 space-y-8">
           <div className="flex items-center justify-between px-4">
              <h3 className="text-xl md:text-4xl font-black uppercase italic tracking-tighter text-white">Neural Credentials</h3>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stats.badges.length} Unlocked</span>
              </div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              {badges.map((badge) => {
                const isUnlocked = stats.badges.includes(badge.id);
                return (
                  <div 
                    key={badge.id}
                    className={`tech-card p-6 rounded-[2.5rem] border-2 flex flex-col items-center text-center gap-6 transition-all relative overflow-hidden group
                      ${isUnlocked ? 'bg-slate-900 border-indigo-500/30 shadow-2xl' : 'bg-white/5 border-white/5 opacity-10 grayscale hover:opacity-20'}`}
                  >
                    <div className={`p-4 rounded-[1.5rem] ${isUnlocked ? 'bg-indigo-600 text-white shadow-3xl' : 'bg-slate-800'}`}>
                      <BadgeIcon name={badge.icon} />
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase italic tracking-tighter ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>{badge.name}</p>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Level Progress */}
        <div className="lg:col-span-12">
          <div className="blueprint-card p-10 md:p-16 h-full shadow-2xl relative overflow-hidden flex flex-col justify-between border-b-8 border-indigo-500/30">
            <div className="space-y-12 relative z-10">
              <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-5 bg-indigo-600 rounded-3xl text-white shadow-3xl">
                      <Star size={40} />
                    </div>
                    <div>
                      <h3 className="text-4xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none">Level {stats.level}</h3>
                      <p className="text-indigo-400 font-bold uppercase text-[10px] md:text-sm tracking-[0.4em] font-mono">Neural Integrity Node</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl md:text-[12rem] font-black text-indigo-400/20 italic font-mono tracking-tighter leading-none absolute -bottom-10 right-0 pointer-events-none">{levelProgress.toFixed(0)}</p>
                  <p className="text-[10px] md:text-sm font-black text-slate-500 uppercase tracking-widest font-mono relative z-20">Diagnostic Rank: Elite specialist (Top 12%)</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="h-6 md:h-16 bg-black/60 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border border-white/5 p-1.5 md:p-3 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_40px_rgba(79,70,229,0.5)] rounded-[1rem] md:rounded-[2.5rem] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </motion.div>
                </div>
                <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                  <span>Current XP: {stats.xp}</span>
                  <span>Available Skills: Doppler, Vascular, Bioeffects</span>
                  <span>Target: {stats.level * 1000}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Shop / Reward Section */}
      <div className="space-y-12">
        <div className="flex items-center justify-between px-4">
          <div className="space-y-2">
            <h3 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Neural Marketplace</h3>
            <p className="text-slate-500 font-bold uppercase text-[9px] md:text-[11px] tracking-[0.5em]">Forge your strategic advantage</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4 px-6 md:px-10 py-4 md:py-6 glass-panel rounded-full border border-amber-500/30 shadow-2xl">
            <Coins size={24} className="text-amber-400 md:w-8 md:h-8" />
            <span className="text-2xl md:text-4xl font-black text-white italic tracking-tighter">{stats.coins}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          <ShopItem 
            id="xp_overclock"
            name="XP Overclock" 
            description="Double XP synchronization for next lesson" 
            cost={500} 
            icon={<Zap size={24} className="text-indigo-400 md:w-8 md:h-8" />}
            owned={stats.activeBoosts?.['xp_overclock'] || 0}
            onBuy={() => onBuyBoost('xp_overclock', 500)}
            canAfford={stats.coins >= 500}
          />
          <ShopItem 
            id="logic_shield"
            name="Neural Shield" 
            description="Protects against one incorrect quiz response" 
            cost={300} 
            icon={<ShieldCheck size={24} className="text-emerald-400 md:w-8 md:h-8" />}
            owned={stats.activeBoosts?.['logic_shield'] || 0}
            onBuy={() => onBuyBoost('logic_shield', 300)}
            canAfford={stats.coins >= 300}
          />
          <ShopItem 
            id="neural_surge"
            name="Cortex Surge" 
            description="Instantly reveals one masterclass neural block" 
            cost={200} 
            icon={<Rocket size={24} className="text-purple-400 md:w-8 md:h-8" />}
            owned={stats.activeBoosts?.['neural_surge'] || 0}
            onBuy={() => onBuyBoost('neural_surge', 200)}
            canAfford={stats.coins >= 200}
          />
        </div>
      </div>
      
      {/* Narrative Quest Section */}
      <div className="bg-gradient-to-r from-slate-950 to-indigo-950 rounded-[3rem] md:rounded-[6rem] p-12 md:p-24 shadow-4xl relative overflow-hidden border border-white/5">
         <div className="absolute inset-0 neural-grid opacity-10" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-32">
            <div className="w-48 h-48 md:w-96 md:h-96 flex items-center justify-center bg-indigo-600 rounded-full border-[12px] md:border-[24px] border-white/10 shadow-3xl animate-pulse shrink-0">
               <Trophy size={160} className="text-white md:w-[200px] md:h-[200px]" />
            </div>
            <div className="space-y-8 md:space-y-12 text-center md:text-left flex-1">
               <div className="space-y-4">
                  <h3 className="text-4xl md:text-9xl font-black italic uppercase tracking-tighter text-white leading-none">The Great <br/> Acoustic Quest</h3>
                  <p className="text-indigo-400 font-black uppercase text-xs md:text-xl tracking-[0.4em] italic">Current Mission: Rescue the Spectral Field</p>
               </div>
               <p className="text-slate-400 font-bold text-sm md:text-lg tracking-wide max-w-3xl leading-relaxed">
                 Master the laws of refraction and acoustic impedance to stabilize the kingdom's mapping grid. Every successful unit unlock brings us closer to neural stability.
               </p>
               <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-6 bg-white text-black font-black uppercase tracking-widest text-xs md:text-sm rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
                    Initialize Mission <ChevronRight size={20} />
                  </button>
                  <div className="px-12 py-6 border-2 border-white/10 rounded-full flex items-center justify-center gap-4">
                    <div className="flex -space-x-4">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-indigo-950 flex items-center justify-center text-[10px] font-black text-indigo-400 uppercase">A{i}</div>
                       ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Collaborative Sync Active</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const ShopItem: React.FC<{ 
  id: string, 
  name: string, 
  description: string, 
  cost: number, 
  icon: React.ReactNode,
  owned: number,
  onBuy: () => void,
  canAfford: boolean
}> = ({ name, description, cost, icon, owned, onBuy, canAfford }) => (
  <div className="glass-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[4.5rem] border border-white/10 shadow-lg hover:border-indigo-500/50 transition-all flex flex-col justify-between group relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div className="p-4 md:p-6 bg-white/5 rounded-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-xl">
          {icon}
        </div>
        {owned > 0 && (
          <span className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">
            {owned} In Core
          </span>
        )}
      </div>
      <h4 className="font-black uppercase italic tracking-tighter text-2xl md:text-4xl mb-2 text-white leading-none">{name}</h4>
      <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-wide mb-8 md:mb-12 italic leading-relaxed">{description}</p>
    </div>
    <button 
      onClick={onBuy}
      disabled={!canAfford}
      className={`w-full py-6 md:py-8 rounded-[2rem] md:rounded-[3rem] font-black uppercase text-[10px] md:text-xs tracking-widest transition-all flex items-center justify-center gap-4 shadow-4xl
        ${canAfford ? 'btn-primary border-b-[12px] border-indigo-800' : 'bg-white/5 text-slate-600 cursor-not-allowed grayscale'}`}
    >
      <Coins size={18} /> {cost} Credits
    </button>
  </div>
);

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, subValue: string, glitch?: boolean }> = ({ icon, label, value, subValue, glitch }) => (
  <div className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-white/10 shadow-lg hover:border-indigo-500/50 transition-all group hover:scale-[1.05] duration-500 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="p-3 md:p-5 bg-white/5 rounded-2xl md:rounded-3xl group-hover:scale-110 group-hover:rotate-12 transition-transform border border-white/5 shadow-xl">
          {icon}
        </div>
        <span className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-2xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-none mb-1 ${glitch ? 'glitch-text' : ''}`} data-text={value}>{value}</p>
      <p className="text-[9px] md:text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{subValue}</p>
    </div>
  </div>
);

const BadgeIcon: React.FC<{ name: string }> = ({ name }) => {
  switch (name) {
    case 'Rocket': return <Rocket size={40} className="md:w-16 md:h-16" />;
    case 'Trophy': return <Trophy size={40} className="md:w-16 md:h-16" />;
    case 'Zap': return <Zap size={40} className="md:w-16 md:h-16" />;
    case 'Waves': return <Waves size={40} className="md:w-16 md:h-16" />;
    case 'Brain': return <Brain size={40} className="md:w-16 md:h-16" />;
    case 'ShieldCheck': return <ShieldCheck size={40} className="md:w-16 md:h-16" />;
    default: return <Award size={40} className="md:w-16 md:h-16" />;
  }
};
