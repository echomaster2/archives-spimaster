
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Target, Zap, Activity, Brain, Heart, Activity as Vascular, Layers as OB } from 'lucide-react';

interface BodyRegion {
  id: string;
  name: string;
  icon: any;
  mastery: number;
  topics: string[];
  color: string;
}

const REGIONS: BodyRegion[] = [
  { id: 'abdomen', name: 'Abdominal', icon: Activity, mastery: 85, topics: ['Liver', 'Kidneys', 'Gallbladder'], color: 'indigo' },
  { id: 'cardiac', name: 'Cardiac', icon: Heart, mastery: 42, topics: ['Valves', 'Chambers', 'Flow'], color: 'rose' },
  { id: 'vascular', name: 'Vascular', icon: Vascular, mastery: 68, topics: ['Carotid', 'Venous', 'Stenosis'], color: 'emerald' },
  { id: 'obgyn', name: 'OB/GYN', icon: OB, mastery: 15, topics: ['Fetal', 'Uterine', 'Adnexa'], color: 'purple' },
  { id: 'physics', name: 'Physics', icon: Zap, mastery: 92, topics: ['Waves', 'Doppler', 'Safety'], color: 'amber' },
];

const colorMap: Record<string, { bg: string, text: string, bar: string, glow: string }> = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', bar: 'bg-indigo-500', glow: 'shadow-indigo-500/50' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', bar: 'bg-rose-500', glow: 'shadow-rose-500/50' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500', glow: 'shadow-emerald-500/50' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', bar: 'bg-purple-500', glow: 'shadow-purple-500/50' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', bar: 'bg-amber-500', glow: 'shadow-amber-500/50' },
};

export const NeuralAtlas: React.FC = () => {
  return (
    <div className="tech-card rounded-[3rem] p-10 md:p-16 border border-white/5 relative overflow-hidden group/atlas">
      <div className="absolute inset-0 neural-grid opacity-[0.05] pointer-events-none" />
      
      <div className="relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <Brain className="text-indigo-400" size={24} />
              </div>
              <h4 className="micro-label">Diagnostic Readiness</h4>
            </div>
            <h3 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none text-white">
              Neural <span className="text-gradient">Atlas</span>
            </h3>
          </div>
          
          <div className="flex gap-4">
             <div className="glass-panel px-6 py-4 rounded-2xl border border-white/5">
                <p className="text-2xl font-black text-white italic">74%</p>
                <p className="micro-label opacity-40">Global Sync</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {REGIONS.map((region, idx) => {
            const colors = colorMap[region.color];
            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-6 group hover:translate-y-[-8px] transition-all relative overflow-hidden"
              >
                <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative z-10 space-y-6">
                  <div className={`p-4 ${colors.bg} rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-xl`}>
                     <region.icon className={colors.text} size={24} />
                  </div>

                  <div className="space-y-1">
                     <h5 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">{region.name}</h5>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{region.topics.join(', ')}</p>
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-500">
                        <span>Sync Rate</span>
                        <span className={colors.text}>{region.mastery}%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                        <div 
                          className={`h-full rounded-full ${colors.bar} shadow-[0_0_10px_rgba(var(--${region.color}-rgb),0.5)]`}
                          style={{ width: `${region.mastery}%` }}
                        />
                     </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
