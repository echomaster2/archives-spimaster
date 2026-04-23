
import React from 'react';
import { motion } from 'motion/react';
import { Target, Activity, Zap, Layers, Sparkles, Brain, Microwave, Wind, Database } from 'lucide-react';

interface MasteryRadarProps {
  data: Record<string, number>;
}

const CATEGORY_CONFIG: Record<string, { icon: any, color: string }> = {
  'Physics Principles': { icon: Activity, color: 'text-emerald-400' },
  'Waves': { icon: Activity, color: 'text-emerald-400' },
  'Transducers': { icon: Microwave, color: 'text-indigo-400' },
  'Doppler': { icon: Zap, color: 'text-amber-400' },
  'Artifacts': { icon: Sparkles, color: 'text-rose-400' },
  'Safety': { icon: Brain, color: 'text-indigo-500' },
  'Resolution': { icon: Target, color: 'text-emerald-500' },
  'Hemodynamics': { icon: Wind, color: 'text-blue-400' },
  'Instrumentation': { icon: Database, color: 'text-purple-400' },
  'Hardware': { icon: Layers, color: 'text-indigo-400' },
};

export const MasteryRadar: React.FC<MasteryRadarProps> = ({ data }) => {
  const categories = Object.keys(data);
  const averageProficiency = Math.round(categories.reduce((acc, cat) => acc + data[cat], 0) / (categories.length || 1));

  return (
    <div className="bg-slate-950 rounded-[3rem] p-8 md:p-14 text-white border border-white/5 shadow-2xl relative overflow-hidden w-full max-w-7xl mx-auto">
      <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
      
      <div className="relative z-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
             <div className="flex items-center gap-3">
                <Target className="text-indigo-400" size={24} />
                <h3 className="text-2xl font-black uppercase italic tracking-widest leading-none">Neural Mastery Heatmap</h3>
             </div>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] pt-1">Diagnostic Registry Alignment Matrix</p>
          </div>
          <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
             <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest italic">Total Alignment: {averageProficiency}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, idx) => {
            const score = data[cat];
            const config = CATEGORY_CONFIG[cat] || { icon: Activity, color: 'text-slate-400' };
            const Icon = config.icon;

            return (
              <motion.div 
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 md:p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6 group hover:border-white/20 transition-all hover:bg-white/[0.07] overflow-hidden relative"
              >
                <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                   <Icon size={120} />
                </div>

                <div className="flex items-center justify-between relative z-10">
                   <div className={`p-4 bg-white/5 rounded-2xl ${config.color} group-hover:scale-110 transition-transform shadow-2xl`}>
                      <Icon size={24} />
                   </div>
                   <div className="text-right">
                      <span className="text-2xl font-black italic">{Math.round(score)}%</span>
                      <span className="block text-[8px] font-black uppercase text-slate-500 tracking-widest">Mastery</span>
                   </div>
                </div>

                <div className="space-y-3 relative z-10">
                   <h4 className="text-xs font-black uppercase tracking-widest text-white truncate">{cat}</h4>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.05 }}
                        className={`h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]`}
                      />
                   </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/5 relative z-10">
                   <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${score < 50 ? 'bg-rose-500 animate-pulse' : score < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <p className="text-[8px] font-bold text-slate-500 uppercase italic">
                        {score < 50 ? "Priority Target" : score < 80 ? "Synaptic Stability" : "Logic Locked"}
                      </p>
                   </div>
                   <button className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Optimize
                   </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
