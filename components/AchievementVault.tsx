
import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, Award, Star, Zap, 
  CheckCircle2, Flame, Target, 
  ShieldCheck, Brain, Sparkles,
  ArrowRight, HeartPulse, Microscope,
  Search, Lock, Database
} from 'lucide-react';
import { Badge, UserStats } from '../types';

interface AchievementVaultProps {
  stats: UserStats;
  badges: Badge[];
}

const MILESTONES = [
  { id: 'physics_master', title: 'Acoustic Field Master', requirement: '10 Physics Labs Complete', icon: <Microscope /> },
  { id: 'clinical_diagnostic', title: 'Chief Clinician', requirement: '5 Patient Sims Success', icon: <HeartPulse /> },
  { id: 'registry_ready', title: 'Registry Vanguard', requirement: '100% Core Physics Score', icon: <Target /> },
];

export const AchievementVault: React.FC<AchievementVaultProps> = ({ stats, badges }) => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 space-y-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
           <div className="p-3 bg-amber-600 rounded-2xl text-white shadow-2xl animate-pulse">
              <Trophy size={32} />
           </div>
           <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
              Neural <span className="text-white/20 font-light">Vault</span>
           </h1>
        </div>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.4em] max-w-2xl mx-auto leading-relaxed">
          The central repository for all verified diagnostic successes, cognitive milestones, and neural synchronizations.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
        {/* Left: Stats & Streak Map */}
        <div className="lg:col-span-4 space-y-8">
           <div className="tech-card p-10 rounded-[3rem] border border-white/5 bg-slate-900/50 backdrop-blur-xl space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 neural-grid opacity-10" />
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Biometric Summary</h3>
                    <ShieldCheck className="text-indigo-400" size={18} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Current XP</p>
                       <p className="text-2xl font-black text-white italic">{stats.xp.toLocaleString()}</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Streak</p>
                       <div className="flex items-center justify-center gap-2">
                          <Flame className="text-orange-500" size={16} />
                          <p className="text-2xl font-black text-orange-500 italic">{stats.streak}</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-indigo-600 rounded-[2rem] text-white space-y-4">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black uppercase tracking-widest">Mastery Rank</p>
                       <Star size={16} fill="white" />
                    </div>
                    <h4 className="text-3xl font-black italic uppercase italic tracking-tighter">Diagnostic Elite</h4>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                       <div className="h-full bg-white w-3/4 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="tech-card p-8 rounded-[3rem] border border-white/5 bg-slate-950 space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Clinical Successes</h3>
              <div className="space-y-3">
                 {[
                   { label: 'Abdominal Aorta', date: '2h ago', status: 'Verified' },
                   { label: 'Gallbladder Stone', date: '1d ago', status: 'Verified' },
                   { label: 'Fetal Heart Axis', date: '3d ago', status: 'Relational' }
                 ].map((log, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                            <CheckCircle2 size={14} />
                         </div>
                         <span className="text-xs font-black text-white uppercase tracking-tight italic">{log.label}</span>
                      </div>
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{log.date}</span>
                   </div>
                 ))}
                 <button className="w-full py-4 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-white/5 transition-all">
                    View Complete Lab Logs
                 </button>
              </div>
           </div>
        </div>

        {/* Right: Badge Gallery & Milestones */}
        <div className="lg:col-span-8 space-y-12">
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-lg font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                    <Award className="text-amber-500" /> Neural Credentials
                 </h3>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stats.badges.length} / {badges.length} Unlocked</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {badges.map((badge) => {
                    const isUnlocked = stats.badges.includes(badge.id);
                    return (
                      <div 
                        key={badge.id}
                        className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center text-center gap-6 group relative overflow-hidden ${
                          isUnlocked 
                          ? 'bg-slate-900 border-indigo-500 shadow-2xl scale-100 hover:scale-[1.02]' 
                          : 'bg-white/5 border-white/5 opacity-20 grayscale'
                        }`}
                      >
                         <div className={`p-6 rounded-[2rem] transition-all duration-700 ${
                           isUnlocked ? 'bg-indigo-600 text-white shadow-3xl shadow-indigo-500/40 group-hover:rotate-12 group-hover:scale-110' : 'bg-slate-800 text-slate-600'
                         }`}>
                            {isUnlocked ? <Sparkles className="absolute top-4 right-4 text-white/40" size={16} /> : null}
                            <BadgeIcon name={badge.icon} />
                         </div>
                         <div className="space-y-2 relative z-10">
                            <h4 className={`text-base font-black uppercase italic tracking-tighter ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>{badge.name}</h4>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide leading-tight">{badge.description}</p>
                         </div>
                         {isUnlocked && (
                           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         )}
                      </div>
                    )
                 })}
              </div>
           </div>

           <div className="space-y-8">
              <h3 className="text-lg font-black text-white uppercase italic tracking-tighter flex items-center gap-3 px-2">
                 <Zap className="text-amber-400" /> Cognitive Milestones
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                 {MILESTONES.map((milestone) => (
                   <div key={milestone.id} className="tech-card p-10 rounded-[3rem] border border-white/5 bg-slate-900/50 backdrop-blur-xl relative overflow-hidden group">
                      <div className="flex flex-col items-center text-center gap-6">
                         <div className="p-5 bg-white/5 rounded-2.5xl text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                            {milestone.icon}
                         </div>
                         <div className="space-y-2">
                            <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{milestone.title}</h4>
                            <div className="flex items-center justify-center gap-2">
                               <Lock size={12} className="text-slate-600" />
                               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{milestone.requirement}</p>
                            </div>
                         </div>
                         <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="w-1/2 h-full bg-indigo-500/30" />
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden shadow-4xl group cursor-pointer">
              <div className="absolute inset-0 neural-grid opacity-20" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                 <div className="p-8 bg-white/10 rounded-full border-4 border-white/20 shadow-2xl group-hover:scale-110 transition-transform">
                    <Database size={64} />
                 </div>
                 <div className="flex-1 space-y-4 text-center md:text-left">
                    <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">Initialize Certification</h3>
                    <p className="text-indigo-200 font-bold uppercase text-[10px] md:text-sm tracking-widest max-w-xl">
                       Ready to verify your neural architecture? Generate a custom mastery certificate based on your current diagnostic credentials.
                    </p>
                    <button className="flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                       Verify Credentials <ArrowRight size={18} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const BadgeIcon: React.FC<{ name: string }> = ({ name }) => {
  switch (name) {
    case 'Rocket': return <Rocket size={40} />;
    case 'Trophy': return <Trophy size={40} />;
    case 'Zap': return <Zap size={40} />;
    case 'Waves': return <Waves size={40} />;
    case 'Brain': return <Brain size={40} />;
    case 'ShieldCheck': return <ShieldCheck size={40} />;
    default: return <Award size={40} />;
  }
};

const Rocket = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/>
    <path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/>
  </svg>
);

const Waves = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
  </svg>
);
