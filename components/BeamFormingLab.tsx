
import React, { useState, useMemo } from 'react';
import { Layers, Zap, Target, Activity, Info, Sparkles, Radio, MoveRight, Box } from 'lucide-react';

export const BeamFormingLab: React.FC = () => {
  const [steeringSlope, setSteeringSlope] = useState(0); // degrees
  const [focusCurve, setFocusCurve] = useState(20); // curvature %

  const beamData = useMemo(() => {
    // Basic logic for delays
    const isFocused = focusCurve > 5;
    const isSteered = Math.abs(steeringSlope) > 2;
    
    return {
      isFocused,
      isSteered,
      logic: !isSteered && !isFocused ? 'Neutral' : 
             isSteered && !isFocused ? 'Steering Only' :
             !isSteered && isFocused ? 'Focusing Only' : 'Hybrid Steering & Focusing'
    };
  }, [steeringSlope, focusCurve]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Layers size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Radio className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Acoustic Beam Former Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Electronic Phasing & Delay Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Beam Logic</span>
              <span className="text-xl font-black text-indigo-400 uppercase tracking-tighter text-xs">
                {beamData.logic}
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Aperture</span>
              <span className="text-xl font-black text-emerald-400">Electronic</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Delay Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex flex-col items-center justify-center p-8 group">
              
              {/* The "Delay Generator" */}
              <div className="flex gap-2 items-end h-40 mb-4 border-b border-white/10 pb-8 px-8 w-full">
                {[...Array(12)].map((_, i) => {
                  // Delay calculation
                  const center = 5.5;
                  const distFromCenter = Math.pow(i - center, 2);
                  const curveDelay = (focusCurve / 100) * distFromCenter * 5;
                  const slopeDelay = (steeringSlope / 20) * (i - center) * 10;
                  const totalDelay = curveDelay + slopeDelay;
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-indigo-500/40 rounded-t-sm transition-all duration-300"
                        style={{ height: `${20 + totalDelay}px` }}
                      >
                         <div className="w-full h-1 bg-indigo-400 shadow-[0_0_10px_indigo]"></div>
                      </div>
                      <div className="w-full h-4 bg-slate-600 rounded-sm"></div>
                    </div>
                  );
                })}
              </div>

              {/* Resulting Beam */}
              <div className="relative w-full flex justify-center">
                 <div 
                  className="h-24 w-1 bg-gradient-to-b from-indigo-500 to-transparent transition-all duration-300 origin-top shadow-[0_0_20px_indigo]"
                  style={{ 
                    transform: `rotate(${steeringSlope}deg) scaleY(${1 + focusCurve/100})`,
                    filter: `blur(${Math.max(0, 5 - focusCurve/5)}px)`
                  }}
                 ></div>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Firing Pattern: Electronic Phasing
              </div>
              <div className="absolute bottom-4 left-6 text-[7px] font-bold text-slate-600 uppercase tracking-tighter">
                 Vertical bars represent nanosecond time delays
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Electronic Slope</label>
                   <span className="text-xs font-black text-indigo-400">{steeringSlope}° Steer</span>
                </div>
                <input 
                  type="range" min="-30" max="30" step="5"
                  value={steeringSlope}
                  onChange={(e) => setSteeringSlope(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Electronic Curve</label>
                   <span className="text-xs font-black text-emerald-400">{focusCurve}% Focus</span>
                </div>
                <input 
                  type="range" min="0" max="60" step="5"
                  value={focusCurve}
                  onChange={(e) => setFocusCurve(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Beam Former</h4>
               </div>
               <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                     <div className="p-2 bg-indigo-500/20 rounded-lg"><MoveRight size={14} className="text-indigo-400" /></div>
                     <div>
                        <p className="text-[10px] font-black text-white uppercase mb-1">Steering Rule</p>
                        <p className="text-[9px] text-slate-400 leading-relaxed italic">"If the delay pattern is a <span className="text-white font-bold">SLOPE</span>, the beam is <span className="text-white font-bold">STEERED</span>."</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                     <div className="p-2 bg-emerald-500/20 rounded-lg"><Target size={14} className="text-emerald-400" /></div>
                     <div>
                        <p className="text-[10px] font-black text-white uppercase mb-1">Focusing Rule</p>
                        <p className="text-[9px] text-slate-400 leading-relaxed italic">"If the delay pattern is a <span className="text-white font-bold">CURVE</span>, the beam is <span className="text-white font-bold">FOCUSED</span>."</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note: Dynamic Receive</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Focusing happens during BOTH <span className="text-white">transmission</span> and <span className="text-white">reception</span>. Reception focusing is dynamic and not controlled by the sonographer.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
               <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider text-center">
                 PHASING = Microsecond delays applied to the ACTIVE ELEMENTS.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
