import React from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, Waves, Target, Shield, Microscope, Cpu, Layers } from 'lucide-react';

interface VisualizerProps {
  type: 'formula' | 'diagram' | 'artifact' | 'registry_alert';
  title: string;
  subtitle?: string;
  data?: any;
}

export const NeuralVisualizer: React.FC<VisualizerProps> = ({ type, title, subtitle, data }) => {
  const renderVisual = () => {
    switch (type) {
      case 'formula':
        return (
          <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-indigo-200">Neural Law Synthesis</span>
              <h4 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">{title}</h4>
              <div className="h-px w-20 bg-white/30" />
              <p className="text-lg md:text-2xl font-mono font-bold text-white/90">{subtitle}</p>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:rotate-12 transition-transform duration-700">
               <Cpu size={120} />
            </div>
          </div>
        );
      case 'artifact':
        return (
          <div className="p-8 bg-rose-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-rose-950/20" />
            <div className="relative z-10 flex gap-8 items-start">
               <div className="p-4 bg-white/20 rounded-2xl border border-white/20">
                 <Shield size={32} strokeWidth={3} />
               </div>
               <div className="space-y-2">
                 <span className="text-[8px] font-black uppercase tracking-[0.4em] text-rose-200">Registry Defensive Vector</span>
                 <h4 className="text-2xl font-black italic uppercase tracking-tighter">{title}</h4>
                 <p className="text-xs font-bold text-rose-100/70 leading-relaxed uppercase tracking-widest">{subtitle}</p>
               </div>
            </div>
          </div>
        );
      case 'registry_alert':
        return (
          <div className="p-8 bg-emerald-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 flex items-center justify-between">
               <div className="space-y-2 flex-1">
                 <span className="text-[8px] font-black uppercase tracking-[0.4em] text-emerald-200 mb-1 block">Heuristic Edge Case</span>
                 <h4 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">{title}</h4>
                 <p className="text-xs font-bold text-emerald-100/70">{subtitle}</p>
               </div>
               <div className="p-4 bg-white/10 rounded-full border border-white/20 rotate-12 group-hover:rotate-0 transition-transform">
                 <Target size={40} className="text-white" />
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="my-12 md:my-24"
    >
      {renderVisual()}
    </motion.div>
  );
};
