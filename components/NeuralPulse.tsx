
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Zap, Brain, Users, Radio } from 'lucide-react';

export const NeuralPulse: React.FC = () => {
  const [pulseData, setPulseData] = useState({
    mentalLoad: 42,
    syncRate: 98.4,
    activeNodes: 1204,
    stability: 'Nominal'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseData(prev => ({
        ...prev,
        mentalLoad: Math.min(100, Math.max(0, prev.mentalLoad + (Math.random() * 4 - 2))),
        syncRate: Math.min(100, Math.max(90, prev.syncRate + (Math.random() * 1 - 0.5))),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Radio size={16} className="animate-pulse" />
          </div>
          <h4 className="micro-label">Neural Pulse</h4>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{pulseData.stability}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-500">
            <span>Mental Load</span>
            <span className="text-white font-mono">{pulseData.mentalLoad.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
               animate={{ width: `${pulseData.mentalLoad}%` }}
               className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-500">
            <span>Global Sync</span>
            <span className="text-white font-mono">{pulseData.syncRate.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
               animate={{ width: `${pulseData.syncRate}%` }}
               className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
             <Users size={12} className="text-slate-500" />
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Nodes</span>
          </div>
          <p className="text-xl font-black text-white italic">{pulseData.activeNodes.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
             <Zap size={12} className="text-slate-500" />
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Logic Flow</span>
          </div>
          <p className="text-xl font-black text-indigo-400 italic">2.4 TB/s</p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-[7px] font-black text-slate-700 uppercase tracking-[0.3em] leading-relaxed italic">
          "The individual is a node. The collective is the processor. Synchronize your pathways."
        </p>
      </div>
    </div>
  );
};
