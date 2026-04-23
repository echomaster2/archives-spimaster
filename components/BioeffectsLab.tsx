
import React, { useState, useMemo } from 'react';
import { Shield, Zap, Target, Activity, Info, Sparkles, Thermometer, Box, AlertTriangle, Droplet } from 'lucide-react';

export const BioeffectsLab: React.FC = () => {
  const [mi, setMi] = useState(0.4); // Mechanical Index
  const [frequency, setFrequency] = useState(5); // MHz

  const cavitationData = useMemo(() => {
    // Registry Logic: MI = Peak Rarefactional Pressure / sqrt(Frequency)
    // High pressure + Low Frequency = High MI
    const isStable = mi > 0.3 && mi <= 0.7;
    const isTransient = mi > 0.7;
    
    return {
      isStable,
      isTransient,
      status: isTransient ? 'Transient (Bursting)' : isStable ? 'Stable (Oscillating)' : 'Negligible',
      risk: isTransient ? 'Cellular Death Risk' : 'Standard Exam',
      description: isTransient 
        ? "Microbubbles burst, creating shockwaves and localized high temps."
        : isStable 
          ? "Microbubbles oscillate but don't burst. Fluid streaming occurs."
          : "Bubbles remain relatively unchanged."
    };
  }, [mi]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <AlertTriangle size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-cyan-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Cavitation Physics Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Mechanical Index & Acoustic Pressure</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Mechanical Index</span>
              <span className={`text-xl font-black ${cavitationData.isTransient ? 'text-rose-500' : 'text-cyan-400'}`}>
                {mi.toFixed(2)}
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">State</span>
              <span className="text-xl font-black text-indigo-400 uppercase tracking-tighter text-xs">{cavitationData.status}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Cell/Bubble Simulation */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              
              {/* The "Bubble" */}
              <div className="relative">
                {cavitationData.isTransient ? (
                   <div className="flex items-center justify-center">
                      <div className="absolute w-40 h-40 bg-rose-500/20 rounded-full animate-ping"></div>
                      <Zap size={64} className="text-rose-500 animate-pulse" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-4 gap-2">
                         {[...Array(8)].map((_, i) => (
                           <div key={i} className="w-2 h-2 bg-rose-400 rounded-full animate-out fade-out slide-out-to-top-8 duration-500 infinite"></div>
                         ))}
                      </div>
                   </div>
                ) : (
                  <div 
                    className={`w-32 h-32 rounded-full border-4 border-cyan-400/50 bg-cyan-500/10 transition-all duration-100 flex items-center justify-center`}
                    style={{ 
                      transform: `scale(${1 + (mi * 0.5 * Math.sin(Date.now() / 100))})` 
                    }}
                  >
                     <div className="w-16 h-16 bg-white/5 rounded-full blur-sm"></div>
                     {cavitationData.isStable && (
                        <div className="absolute inset-0 border-2 border-dashed border-cyan-300/30 rounded-full animate-spin-slow"></div>
                     )}
                  </div>
                )}
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-cyan-400">
                Acoustic Rarefaction Effect
              </div>
              
              <div className="absolute bottom-4 right-6 text-[8px] font-black text-slate-500 uppercase">
                {cavitationData.risk}
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Peak Rarefactional Pressure</label>
                    <span className="text-xs font-black">{mi.toFixed(1)} MPa</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="1.9" step="0.1"
                    value={mi}
                    onChange={(e) => setMi(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Frequency</label>
                    <span className="text-xs font-black text-amber-400">{frequency} MHz</span>
                  </div>
                  <input 
                    type="range" min="2" max="15" step="1"
                    value={frequency}
                    onChange={(e) => setFrequency(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-[2.5rem] border border-cyan-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-cyan-600 rounded-xl text-white shadow-lg">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">{cavitationData.status}</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 {cavitationData.description}
               </p>
               <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] font-black text-cyan-400 uppercase">Stable Cavitation</span>
                    <span className="text-[10px] font-bold text-white uppercase italic">Lower MI</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase">Transient Cavitation</span>
                    <span className="text-[10px] font-bold text-white uppercase italic">Higher MI</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">The Inverse Rule</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Higher frequency sound results in a <span className="text-white font-bold underline">LOWER</span> Mechanical Index. Registry shortcut: <span className="text-white italic">MI = Pressure / √f</span>.
                </p>
              </div>
            </div>

            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20">
               <p className="text-[10px] font-bold text-indigo-200 leading-relaxed">
                 Transient cavitation is also known as <span className="italic">Normal</span> or <span className="italic">Inertial</span> cavitation. Remember these synonyms!
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
