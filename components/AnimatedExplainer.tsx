import React from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, Waves, Target, ArrowRight, ChevronRight, Cpu, Layers } from 'lucide-react';

interface ExplainerProps {
  topic: string;
  lessonId: string;
}

export const AnimatedExplainer: React.FC<ExplainerProps> = ({ topic, lessonId }) => {
  const id = lessonId.toLowerCase();

  const renderExplainer = () => {
    const grid = (
      <>
        <div className="absolute inset-0 neural-grid opacity-10" />
        <div className="absolute inset-0 neural-grid opacity-[0.02] scale-150 rotate-12" />
        <div className="scanline" />
      </>
    );

    if (id.includes('wave') || id.includes('physics')) {
      return (
        <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-indigo-950/20">
          {grid}
          <div className="absolute inset-0 flex items-center justify-center gap-0.5">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: [1, 2.5, 1],
                  opacity: [0.1, 0.8, 0.1],
                  backgroundColor: ['#6366f1', '#a855f7', '#6366f1']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.08,
                  ease: "easeInOut"
                }}
                className="w-1.5 h-16 rounded-full bg-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
              />
            ))}
          </div>
          
          {/* Measurement overlays */}
          <div className="absolute top-10 left-10 w-20 border-l border-t border-indigo-500/30 h-10 px-2 py-1">
            <span className="text-[6px] font-mono text-indigo-400 uppercase">Param_X</span>
          </div>
          <div className="absolute bottom-10 right-10 w-20 border-r border-b border-indigo-500/30 h-10 px-2 py-1 text-right">
             <span className="text-[6px] font-mono text-indigo-400 uppercase">Phase_Sync</span>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 bg-black/40 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
            Longitudinal Wave Propagation
          </div>
        </div>
      );
    }

    if (id.includes('refl') || id.includes('atten') || id.includes('media')) {
      return (
        <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-indigo-950/20">
          {grid}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 dashed-line" />
          
          {/* Incident Beam */}
          <div className="absolute left-[15%] top-1/2 -translate-y-1/2 space-y-2">
             <span className="text-[6px] font-black uppercase text-indigo-400">Incident</span>
             <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 100, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-40 h-2 bg-gradient-to-r from-transparent via-indigo-500 to-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] rounded-full"
             />
          </div>

          {/* Reflected Beam */}
          <div className="absolute left-[15%] top-[55%] space-y-2">
             <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: -50, opacity: [0, 0.5, 0.5, 0] }}
                transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "linear" }}
                className="w-20 h-1 bg-gradient-to-l from-indigo-400 via-indigo-500 to-transparent rounded-full"
             />
             <span className="text-[5px] font-black uppercase text-slate-500 block text-right">Reflected (30%)</span>
          </div>

          <div className="absolute top-1/2 left-[52%] -translate-y-1/2">
             <div className="glass-panel p-2 rounded-lg border border-white/10">
                <span className="text-[7px] font-black uppercase tracking-widest text-white">Interface Z1/Z2</span>
             </div>
          </div>
        </div>
      );
    }

    if (id.includes('harmonic')) {
      return (
        <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-purple-950/10">
          {grid}
          <div className="flex flex-col gap-12 w-full px-20">
             <div className="space-y-4">
                <div className="flex justify-between items-center text-[7px] font-black uppercase text-slate-400">
                   <span>Fundamental Frequency (f)</span>
                   <span>Linear Propagation</span>
                </div>
                <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                      animate={{ x: [-200, 400] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-20 h-full bg-indigo-500/50 shadow-[0_0_20px_#6366f1]"
                   />
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-[7px] font-black uppercase text-purple-400">
                   <span>Harmonic Frequency (2f)</span>
                   <span>Non-Linear Component</span>
                </div>
                <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                      animate={{ x: [-200, 400] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-10 h-full bg-purple-500 shadow-[0_0_20px_#a855f7]"
                   />
                </div>
             </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">
            Harmonic Signal Extraction
          </div>
        </div>
      );
    }

    if (id.includes('steer') || id.includes('focus')) {
      return (
        <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-emerald-950/10">
          {grid}
          <div className="absolute left-8 flex flex-col gap-1">
             {[...Array(10)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-white/5 border border-white/10 rounded-sm relative">
                   <motion.div
                      animate={{ 
                         opacity: [0, 1, 0],
                         scale: [1, 1.5, 1],
                         backgroundColor: ['#10b981', '#34d399', '#10b981']
                      }}
                      transition={{ 
                         duration: 1, 
                         repeat: Infinity, 
                         delay: i * 0.05 
                      }}
                      className="absolute inset-0 rounded-sm"
                   />
                </div>
             ))}
          </div>

          <motion.div
             animate={{ 
                rotate: [-20, 20, -20]
             }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute left-20 w-80 h-[2px] bg-gradient-to-r from-emerald-500 to-transparent origin-left opacity-30"
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">
            Phased Steering Simulation
          </div>
        </div>
      );
    }

    if (id.includes('range') || id.includes('compress')) {
      return (
        <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-indigo-900/10">
          {grid}
          <div className="flex items-center gap-12">
             <div className="flex flex-col items-center gap-4">
                <span className="text-[7px] font-black uppercase text-slate-500">Input Echoes</span>
                <div className="flex gap-1 h-32 items-center">
                   {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [20, 100, 20] }}
                        transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                        className="w-2 bg-white/20 rounded-full"
                      />
                   ))}
                </div>
             </div>

             <ArrowRight className="text-indigo-500 animate-pulse" />

             <div className="flex flex-col items-center gap-4">
                <span className="text-[7px] font-black uppercase text-indigo-400">Compressed Range</span>
                <div className="flex gap-1 h-32 items-center">
                   {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [20, 50, 20] }}
                        transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                        className="w-2 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"
                      />
                   ))}
                </div>
             </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
            Logarithmic Compression Dynamics
          </div>
        </div>
      );
    }

    if (id.includes('duty') || id.includes('prp') || id.includes('prf')) {
      return (
        <div className="relative h-72 w-full flex flex-col items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-indigo-950/20">
          {grid}
          <div className="w-full px-20 space-y-8">
            <div className="relative h-20 w-full border-b border-indigo-500/30">
               {[...Array(4)].map((_, i) => (
                 <motion.div 
                   key={i}
                   initial={{ x: -100 }}
                   animate={{ x: [0, 800], opacity: [0, 1, 1, 0] }}
                   transition={{ duration: 4, repeat: Infinity, delay: i * 1, ease: 'linear' }}
                   className="absolute top-1/2 -translate-y-1/2 w-4 md:w-8 h-10 bg-indigo-500 rounded-md shadow-[0_0_15px_#6366f1]"
                 />
               ))}
               <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                  <div className="w-full h-px dashed-line bg-white/20" />
               </div>
            </div>
            <div className="flex justify-between items-center">
               <div className="space-y-1">
                 <span className="text-[6px] font-black text-indigo-400 uppercase tracking-widest block">Transmit Time (PD)</span>
                 <div className="h-1 w-12 bg-indigo-500 rounded-full" />
               </div>
               <div className="space-y-1 text-right">
                 <span className="text-[6px] font-black text-slate-500 uppercase tracking-widest block">Receive Time (Listening)</span>
                 <div className="h-1 w-32 bg-white/10 rounded-full ml-auto" />
               </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
            Pulsed Wave Duty Factor Mapping
          </div>
        </div>
      );
    }

    if (id.includes('intensity') || id.includes('sptp') || id.includes('sata')) {
      return (
        <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-indigo-950/20">
          {grid}
          <div className="relative w-64 h-64 flex items-center justify-center">
             {[...Array(5)].map((_, i) => (
               <motion.div 
                 key={i}
                 initial={{ scale: 0.2 }}
                 animate={{ scale: [0.2, 1, 0.2], opacity: [0.1, 0.5, 0.1] }}
                 transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                 className="absolute border border-indigo-500/30 rounded-full"
                 style={{ width: `${(i+1)*20}%`, height: `${(i+1)*20}%` }}
               />
             ))}
             <motion.div 
               animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-[0_0_40px_#6366f1] flex items-center justify-center"
             >
               <Zap className="text-white" size={24} />
             </motion.div>
             
             <div className="absolute top-0 text-[6px] font-black uppercase text-indigo-500">Spatial Peak (SP)</div>
             <div className="absolute bottom-4 text-[6px] font-black uppercase text-slate-500">Spatial Average (SA)</div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
            Spatial/Temporal Intensity Profile
          </div>
        </div>
      );
    }

    if (id.includes('doppler')) {
      return (
        <div className="relative h-64 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem]">
          {grid}
          
          <motion.div
            animate={{ x: [-200, 200] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-12 h-12 bg-rose-500/20 rounded-full border-2 border-rose-500 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              <Activity className="text-rose-500" />
            </div>
            
            {/* Frequency Waves */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                className="absolute inset-0 border border-rose-500/30 rounded-full"
              />
            ))}
          </motion.div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-rose-400">
            Frequency Shift Dynamics
          </div>
        </div>
      );
    }

    if (id.includes('pulse') || id.includes('13us')) {
      return (
        <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-indigo-950/20">
          {grid}
          
          <div className="absolute left-20 w-16 h-28 bg-indigo-600/20 border border-indigo-500/40 rounded-xl flex items-center justify-center shadow-inner">
            <div className="flex flex-col items-center gap-2">
               <Zap className="text-indigo-400" size={24} />
               <span className="text-[6px] font-black text-indigo-400 uppercase">Emitter</span>
            </div>
          </div>

          <div className="relative w-96 flex items-center">
             <motion.div
                initial={{ x: -100, scale: 1 }}
                animate={{ 
                   x: [0, 180, 0],
                   backgroundColor: ['#6366f1', '#a855f7', '#6366f1'],
                   scale: [1, 0.8, 1]
                }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
                className="w-12 h-6 bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1] relative z-10"
             >
                <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white/20 blur-sm rounded-full" />
             </motion.div>
             <div className="absolute left-0 right-0 h-px bg-white/5 border-t border-dashed border-white/10" />
          </div>

          <div className="absolute right-20 w-8 h-40 bg-white/5 border border-white/10 rounded-lg flex flex-col items-center justify-center gap-2">
              <span className="text-[7px] font-black text-slate-500 uppercase rotate-90">REFLECTOR</span>
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">
            The 13μs Rule: Pulse-Echo Timing
          </div>
        </div>
      );
    }

    if (id.includes('res')) {
      return (
        <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-slate-900/40">
          {grid}
          <div className="flex gap-32">
            <div className="flex flex-col items-center gap-6">
              <div className="text-[7px] font-black uppercase tracking-[0.3em] text-indigo-400">Axial (LARRD)</div>
              <div className="relative h-40 w-1 bg-white/5 border border-white/10 rounded-full">
                <motion.div
                  animate={{ 
                    y: [0, 140, 0],
                    height: [20, 10, 20]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-4 bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1]"
                />
              </div>
              <span className="text-[5px] font-black uppercase text-slate-500 italic">SPL Dependence</span>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="text-[7px] font-black uppercase tracking-[0.3em] text-rose-400">Lateral (LATA)</div>
              <div className="relative w-40 h-1 bg-white/5 border border-white/10 rounded-full mt-20">
                <motion.div
                  animate={{ 
                    x: [0, 140, 0],
                    width: [20, 10, 20]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 -translate-y-1/2 left-0 h-4 bg-rose-500 rounded-full shadow-[0_0_20px_#f43f5e]"
                />
              </div>
              <span className="text-[5px] font-black uppercase text-slate-500 italic">Beam Width Dependence</span>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">
            Spatial Resolution Mapping
          </div>
        </div>
      );
    }

    if (id.includes('artifact')) {
      return (
        <div className="relative h-64 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem]">
          {grid}
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-full border border-white/40" />
            <motion.div
              animate={{ 
                opacity: [0, 0.5, 0],
                y: [0, 40],
                scale: [1, 0.9]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-0 left-0 w-16 h-16 bg-white/10 rounded-full border border-white/20 blur-sm"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">
            Acoustic Artifact Simulation
          </div>
        </div>
      );
    }

    if (id.includes('safety') || id.includes('alara') || id.includes('bio')) {
      return (
        <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-emerald-950/10">
          {grid}
          <div className="flex gap-16 items-end h-40">
            <div className="flex flex-col items-center gap-4">
              <span className="text-[7px] font-black uppercase text-amber-400">Thermal</span>
              <div className="relative h-24 w-6 bg-white/5 border border-white/10 rounded-lg p-1">
                 <motion.div 
                    animate={{ height: ['10%', '70%', '10%'] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-full bg-amber-500 rounded-md"
                 />
              </div>
            </div>
            
            <div className="relative flex items-center justify-center">
               <div className="text-[7px] font-black uppercase text-rose-500 absolute -top-8 w-max text-center">Mechanical</div>
               {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 2], opacity: [0, 0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="absolute w-12 h-12 border border-rose-500 rounded-full"
                  />
               ))}
               <Activity className="text-rose-500 opacity-40 shadow-[0_0_20px_rgba(244,63,94,0.3)]" />
            </div>

            <div className="flex flex-col items-center gap-4">
               <span className="text-[7px] font-black uppercase text-indigo-400">ALARA</span>
               <div className="relative h-24 w-6 bg-white/5 border border-white/10 rounded-lg p-1">
                  <motion.div 
                     animate={{ height: ['40%', '20%', '40%'] }}
                     transition={{ duration: 3, repeat: Infinity }}
                     className="w-full bg-indigo-500 rounded-md"
                  />
               </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">
            Bioeffect & Cavitation Safeguards
          </div>
        </div>
      );
    }

    if (id.includes('transducer') || id.includes('array')) {
      return (
        <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-indigo-950/20">
          {grid}
          <div className="flex gap-1.5 items-end h-40">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [30, 100, 30],
                  backgroundColor: ['#6366f1', '#a855f7', '#6366f1'],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.08
                }}
                className="w-3 bg-indigo-500 rounded-t-sm border-t border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              />
            ))}
          </div>
          
          <motion.div 
            animate={{ 
              scale: [0.8, 1.4, 0.8],
              opacity: [0.05, 0.15, 0.05],
              backgroundColor: ['#6366f1', '#a855f7', '#6366f1']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full blur-[100px]"
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">
            PZT Crystal Array Oscillation
          </div>
        </div>
      );
    }

    if (id.includes('receiver') || id.includes('instrument') || id.includes('accdp')) {
      return (
        <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-indigo-900/10">
          {grid}
          <div className="flex gap-6 relative">
            {[
              { l: 'A', d: 'Amplification', c: 'text-indigo-400' },
              { l: 'C', d: 'Compensation', c: 'text-emerald-400' },
              { l: 'C', d: 'Compression', c: 'text-amber-400' },
              { l: 'D', d: 'Demodulation', c: 'text-rose-400' },
              { l: 'P', d: 'Rejection/Filtering', c: 'text-slate-400' }
            ].map((node, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 20px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)']
                  }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative group/node overflow-hidden"
                >
                  <span className={`text-2xl font-black italic ${node.c}`}>{node.l}</span>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/node:opacity-100 transition-opacity" />
                </motion.div>
                <div className="text-center">
                  <p className="text-[6px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Process</p>
                  <p className={`text-[8px] font-bold uppercase tracking-tight ${node.c}`}>{node.d}</p>
                </div>
              </div>
            ))}
            
            {/* Arrows */}
            {[...Array(4)].map((_, i) => (
               <div key={i} className="absolute top-8" style={{ left: `${(i + 1) * 20 + 2.5}%` }}>
                  <ChevronRight size={16} className="text-white/10" />
               </div>
            ))}
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">
            Receiver Component Chain (ACCDP)
          </div>
        </div>
      );
    }


    // Default: Neural Network / Data Flow explainer
    return (
      <div className="relative h-72 w-full flex items-center justify-center overflow-hidden tech-card rounded-[2.5rem] bg-indigo-950/10">
        {grid}
        <div className="relative flex gap-12 md:gap-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="relative group/node">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  borderColor: ['rgba(255,255,255,0.1)', i % 2 === 0 ? 'rgba(99,102,241,0.6)' : 'rgba(168,85,247,0.6)', 'rgba(255,255,255,0.1)']
                }}
                transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                className="w-16 h-16 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover/node:opacity-100 transition-opacity" />
                <div className="relative z-10 text-indigo-400/40">
                   {i === 0 ? <Zap size={24} /> : i === 1 ? <Target size={24} /> : i === 2 ? <Cpu size={24} /> : <Layers size={24} />}
                </div>
              </motion.div>
              {i < 3 && (
                <div className="absolute top-1/2 -translate-y-1/2 left-16 md:left-20 w-12 md:w-16 h-px bg-white/10">
                   <motion.div
                      animate={{ left: [0, '100%'], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                      className="absolute top-[-2px] w-6 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.5)] rounded-full"
                   />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 bg-black/40 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
          Neural Concept Synchronization
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full space-y-6"
    >
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
            <Activity size={16} className="text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Animated Explainer</h4>
            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Visualizing: {topic}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60">Simulation Active</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-indigo-500/10 blur-xl rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <motion.div 
          animate={{ 
            boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 20px rgba(99,102,241,0.1)', '0 0 0px rgba(99,102,241,0)']
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative"
        >
          {renderExplainer()}
        </motion.div>
      </div>

      <div className="px-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
        <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-600">Cinematic Heuristic Reconstruction</p>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
      </div>
    </motion.div>
  );
};

