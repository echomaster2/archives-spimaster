
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Sparkles, Filter, Target, Brain, ArrowUpRight, Zap } from 'lucide-react';
import { getRegistryPulse } from '../services/geminiService';

interface Trend {
  topic: string;
  weight: number;
  reason: string;
}

export const RegistryHotTopics: React.FC = () => {
  const [pulseData, setPulseData] = useState<{ text: string, sources: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await getRegistryPulse("SPI Ultrasound Physics 2026");
        setPulseData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="bg-slate-950 rounded-[3rem] p-10 md:p-14 text-white border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 atmosphere opacity-10 pointer-events-none" />
      
      <div className="relative z-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
             <div className="flex items-center gap-3">
                <TrendingUp className="text-emerald-400" size={24} />
                <h3 className="text-2xl font-black uppercase italic tracking-widest leading-none">Registry Trend Pulse</h3>
             </div>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] pt-1">Live Tracking: AI-Augmented High-Yield Analysis</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">Neural Link Enabled</span>
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-6">
             <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
             <p className="micro-label animate-pulse">Syncing with ARDMS archives...</p>
          </div>
        ) : (
          <div className="space-y-8">
             <div className="p-8 md:p-12 bg-white/5 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 neural-grid opacity-10" />
                <div className="relative z-10 space-y-8">
                   <div className="flex items-center gap-4 text-emerald-400">
                      <Sparkles size={24} />
                      <h4 className="text-xl font-black uppercase italic tracking-tight">Current Hot Zones</h4>
                   </div>
                   <div className="lecture-content !text-base md:!text-lg opacity-90 leading-relaxed italic border-l-4 border-emerald-500/30 pl-8">
                      {pulseData?.text || "Synchronizing data..."}
                   </div>
                </div>
             </div>

             {pulseData?.sources && pulseData.sources.length > 0 && (
               <div className="space-y-4">
                  <h5 className="micro-label opacity-40 px-4">Grounding Sources</h5>
                  <div className="grid sm:grid-cols-2 gap-4">
                     {pulseData.sources.map((s, idx) => (
                       <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all">
                          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 font-mono text-xs">
                             {idx + 1}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Source Fragment</span>
                             <span className="text-[10px] font-bold text-white truncate max-w-[200px]">Registry Documentation Link</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             )}
          </div>
        )}

        <div className="p-8 bg-indigo-600 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl hardware-border relative overflow-hidden group">
           <div className="absolute inset-0 neural-grid opacity-20" />
           <div className="relative z-10 flex items-center gap-6">
              <div className="p-4 bg-white/20 rounded-2xl text-white">
                 <Zap size={24} />
              </div>
              <div className="space-y-1">
                 <h5 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Diagnostic Deep-Dive</h5>
                 <p className="text-[9px] font-bold text-indigo-100 uppercase tracking-widest opacity-80">Generate a custom roadmap based on these trends</p>
              </div>
           </div>
           <button className="relative z-10 px-8 py-4 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
              Initialize Plan
           </button>
        </div>
      </div>
    </div>
  );
};
