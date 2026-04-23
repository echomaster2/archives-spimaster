import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Map, Flag, CheckCircle2, Circle, TrendingUp, Calendar, MapPin, ExternalLink, ShieldAlert, ChevronRight, Download, Loader2, Database, Music, Sparkles } from 'lucide-react';
import { modules } from '../data/modules';

interface StudyRoadmapProps {
  completedLessons: Set<string>;
  onModuleClick: (idx: number) => void;
  onCacheModule?: (idx: number) => Promise<void>;
  cachedStatus?: Record<string, boolean>;
  onOpenRadio?: () => void;
}

export const StudyRoadmap: React.FC<StudyRoadmapProps> = ({ completedLessons, onModuleClick, onCacheModule, cachedStatus = {}, onOpenRadio }) => {
  const [cachingIdx, setCachingIdx] = useState<number | null>(null);
  
  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedCount = completedLessons.size;
  const percentage = Math.round((completedCount / totalLessons) * 100);

  const handleCache = async (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (onCacheModule) {
      setCachingIdx(idx);
      await onCacheModule(idx);
      setCachingIdx(null);
    }
  };

  return (
    <div className="space-y-6 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-1 md:px-0 max-w-7xl mx-auto">
      <div className="tech-card rounded-[1.5rem] md:rounded-[4rem] p-6 md:p-12 lg:p-20 text-white relative overflow-hidden border-b-[8px] md:border-b-[32px] border-black/60 group/header">
        <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none rotate-12 hidden md:block group-hover/header:scale-110 transition-transform duration-[2000ms]">
           <Map size={300} />
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-6">
              <div className="px-2 py-0.5 md:px-2.5 md:py-1 bg-indigo-600 rounded-full text-[6px] md:text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg shadow-indigo-500/20">Flight Path</div>
              <div className="px-2 py-0.5 md:px-2.5 md:py-1 bg-white/10 rounded-full text-[6px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5">Registry Ready: {percentage}%</div>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-7xl font-black tracking-tighter leading-none mb-3 md:mb-8 uppercase italic text-gradient-vibrant glitch-text" data-text="Registry Roadmap">Registry <br className="hidden md:block"/>Roadmap</h2>
            <p className="text-[9px] md:text-lg text-slate-400 font-medium leading-relaxed max-w-md uppercase tracking-[0.2em] opacity-50">
              The ARDMS SPI exam tests your application of physics to clinical knobology. This is your curated path to a passing score.
            </p>
          </div>
            <div className="bg-slate-950/40 backdrop-blur-3xl rounded-3xl md:rounded-[3rem] p-6 md:p-10 border border-white/5 relative overflow-hidden group/momentum">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover/momentum:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-3 md:mb-8 relative z-10">
               <h4 className="text-[8px] md:text-sm font-black uppercase tracking-widest text-indigo-400 italic">Momentum</h4>
               <TrendingUp size={16} className="text-indigo-400 group-hover/momentum:scale-125 transition-transform md:w-5 md:h-5" />
            </div>
            <div className="space-y-3 md:space-y-6 relative z-10">
               <div className="h-2.5 md:h-4 w-full bg-white/5 rounded-full overflow-hidden p-0.5 md:p-1 border border-white/5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)]" 
                  />
               </div>
               <div className="grid grid-cols-2 gap-2 md:gap-4">
                  <div className="p-2.5 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                     <span className="block text-[6px] md:text-[8px] font-black text-slate-500 uppercase mb-0.5 md:mb-1 tracking-widest">Modules Done</span>
                     <span className="text-base md:text-xl font-black glitch-text" data-text={`${modules.filter((m, i) => m.lessons.every(l => completedLessons.has(`${i}-${m.lessons.indexOf(l)}`))).length}/${modules.length}`}>{modules.filter((m, i) => m.lessons.every(l => completedLessons.has(`${i}-${m.lessons.indexOf(l)}`))).length}/{modules.length}</span>
                  </div>
                  <div className="p-2.5 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                     <span className="block text-[6px] md:text-[8px] font-black text-slate-500 uppercase mb-0.5 md:mb-1 tracking-widest">Total Lessons</span>
                     <span className="text-base md:text-xl font-black glitch-text" data-text={`${completedCount}/${totalLessons}`}>{completedCount}/{totalLessons}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
      >
        {modules.map((mod, idx) => {
          const modCompletedCount = mod.lessons.filter((_, lIdx) => completedLessons.has(`${idx}-${lIdx}`)).length;
          const isFull = modCompletedCount === mod.lessons.length;
          const isStarted = modCompletedCount > 0;
          const isCached = cachedStatus[idx];
          
          return (
            <motion.button 
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              onClick={() => onModuleClick(idx)}
              className={`text-left p-5 md:p-8 rounded-[1.5rem] md:rounded-[3rem] border transition-all group relative overflow-hidden flex flex-col justify-between h-[240px] md:h-[350px] module-card hover:scale-[1.02] duration-500 ${
                isFull ? 'border-emerald-500/30' : 
                isStarted ? 'border-indigo-500/30' : 
                'border-white/5 shadow-xl'
              }`}
            >
              <div className="card-glow" />
              <div className={`card-accent ${isFull ? 'from-emerald-500' : 'from-indigo-500'}`} />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 md:mb-8">
                  <div className={`p-2.5 md:p-4 rounded-xl md:rounded-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6 ${isFull ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white/10 text-white border border-white/10'}`}>
                    <mod.icon size={18} className="md:w-6 md:h-6" />
                  </div>
                  <div className="flex gap-2">
                    {onCacheModule && (
                      <button 
                        onClick={(e) => handleCache(e, idx)}
                        className={`p-1.5 md:p-2 rounded-lg transition-all ${isCached ? 'text-emerald-500' : 'text-slate-500 hover:text-indigo-400'}`}
                      >
                        {cachingIdx === idx ? <Loader2 size={12} className="animate-spin md:w-4 md:h-4" /> : isCached ? <Database size={12} className="md:w-4 md:h-4" /> : <Download size={12} className="md:w-4 md:h-4" />}
                      </button>
                    )}
                    {isFull ? <CheckCircle2 size={18} className="md:w-6 md:h-6 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> : <div className="w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-indigo-500/40 transition-colors"><Circle size={6} className="text-white/10 md:w-2.5 md:h-2.5" /></div>}
                  </div>
                </div>
                <h3 className="text-base md:text-2xl font-black text-white tracking-tight leading-tight uppercase italic mb-1.5 md:mb-4 group-hover:text-indigo-400 transition-colors glitch-text" data-text={mod.title}>{mod.title}</h3>
                <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">{mod.weight}</p>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1 italic">Completion</p>
                      <p className="text-lg md:text-2xl font-black text-white glitch-text" data-text={`${Math.round((modCompletedCount / mod.lessons.length) * 100)}%`}>{Math.round((modCompletedCount / mod.lessons.length) * 100)}%</p>
                   </div>
                   <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-xl border border-white/10 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                      <ChevronRight size={14} className="md:w-5 md:h-5" />
                   </div>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full mt-2.5 md:mt-4 overflow-hidden border border-white/5 p-[1px]">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${(modCompletedCount / mod.lessons.length) * 100}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className={`h-full rounded-full transition-all duration-700 ${isFull ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]'}`} 
                   />
                </div>
              </div>

              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl -mr-16 -mt-16`} />
            </motion.button>
          );
        })}

        {/* Neural Radio Featured Card */}
        <motion.button 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          onClick={onOpenRadio}
          className="text-left p-5 md:p-8 rounded-[1.5rem] md:rounded-[3rem] border border-purple-500/30 transition-all group relative overflow-hidden flex flex-col justify-between h-[240px] md:h-[350px] module-card hover:scale-[1.02] duration-500 bg-gradient-to-br from-purple-900/20 to-transparent shadow-2xl shadow-purple-500/10"
        >
          <div className="card-glow bg-purple-500/10" />
          <div className="card-accent from-purple-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 md:mb-8">
              <div className="p-2.5 md:p-4 rounded-xl md:rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-110 group-hover:rotate-6">
                <Music size={18} className="md:w-6 md:h-6" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/60">Live Stream</span>
              </div>
            </div>
            <h3 className="text-base md:text-2xl font-black text-white tracking-tight leading-tight uppercase italic mb-1.5 md:mb-4 group-hover:text-purple-400 transition-colors glitch-text" data-text="Neural Radio">Neural Radio</h3>
            <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">Atmospheric Sync</p>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-end">
               <div>
                  <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1 italic">Status</p>
                  <p className="text-lg md:text-2xl font-black text-white glitch-text" data-text="SYNCHRONIZED">SYNCHRONIZED</p>
               </div>
               <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-xl border border-white/10 group-hover:bg-purple-600 group-hover:border-purple-500 transition-all">
                  <Sparkles size={14} className="md:w-5 md:h-5" />
               </div>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full mt-2.5 md:mt-4 overflow-hidden border border-white/5 p-[1px]">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '100%' }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className="h-full rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
               />
            </div>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};