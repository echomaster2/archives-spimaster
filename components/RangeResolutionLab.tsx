
import React, { useState, useMemo } from 'react';
import { Target, Zap, Activity, Info, Sparkles, Layers, ArrowRight, Maximize2 } from 'lucide-react';

export const RangeResolutionLab: React.FC = () => {
  const [mode, setMode] = useState<'pw' | 'cw'>('pw');
  const [gateDepth, setGateDepth] = useState(50); // %

  const resolutionData = useMemo(() => {
    return {
      pw: {
        benefit: "Range Resolution",
        drawback: "Aliasing Risk",
        desc: "Uses a specific gate to select the EXACT depth of sampling.",
        physics: "Pulse-Echo timing allows precise location (13us rule)."
      },
      cw: {
        benefit: "Unlimited Max Velocity",
        drawback: "Range Ambiguity",
        desc: "Samplings occur everywhere the 2 crystals overlap.",
        physics: "Constant sound waves mean no timing info for location."
      }
    };
  }, []);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-right duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Maximize2 size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Layers className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Doppler Modality Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Range Resolution vs Ambiguity Simulator</p>
          </div>
          
          <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10 shadow-inner">
             <button 
               onClick={() => setMode('pw')} 
               className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'pw' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
             >
               Pulsed (PW)
             </button>
             <button 
               onClick={() => setMode('cw')} 
               className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'cw' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
             >
               Cont. (CW)
             </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Scan Lab */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex flex-col items-center justify-center p-8">
              
              {/* Target Vessels */}
              <div className="w-full h-full relative">
                 {/* Superficial Vessel */}
                 <div className="absolute top-1/4 left-0 w-full h-8 bg-rose-500/10 border-y border-rose-500/20 flex items-center justify-center">
                    <span className="text-[7px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Low Flow (V1)</span>
                 </div>
                 {/* Deep Vessel */}
                 <div className="absolute top-3/4 left-0 w-full h-10 bg-rose-500/10 border-y border-rose-500/20 flex items-center justify-center">
                    <span className="text-[7px] font-black text-rose-500 uppercase tracking-widest animate-pulse">High Flow (V2)</span>
                 </div>

                 {/* The Doppler Beam */}
                 <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-indigo-500 to-transparent pointer-events-none opacity-40"></div>

                 {/* The Gate (PW only) */}
                 {mode === 'pw' ? (
                   <div 
                     className="absolute left-1/2 -translate-x-1/2 w-6 border-x-2 border-indigo-400 transition-all duration-300 z-30"
                     style={{ top: `${gateDepth}%`, height: '20px', marginTop: '-10px' }}
                   >
                     <div className="absolute -top-px left-0 right-0 h-px bg-indigo-400"></div>
                     <div className="absolute -bottom-px left-0 right-0 h-px bg-indigo-400"></div>
                     <div className="absolute inset-0 bg-indigo-400/20 animate-pulse"></div>
                     <div className="absolute -right-12 top-1 text-[8px] font-black text-indigo-400 uppercase whitespace-nowrap">Sampling</div>
                   </div>
                 ) : (
                   <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-indigo-500/10 z-20">
                     <div className="absolute inset-0 flex flex-col justify-around py-4">
                        {[...Array(8)].map((_, i) => (
                           <div key={i} className="w-full h-px bg-indigo-400/20 animate-pulse"></div>
                        ))}
                     </div>
                     <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-[8px] font-black text-indigo-400 uppercase whitespace-nowrap">Ambiguous Sample Zone</div>
                   </div>
                 )}
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Mode: {mode.toUpperCase()} Doppler
              </div>
            </div>

            {mode === 'pw' && (
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gate Position (Depth)</label>
                   <span className="text-xs font-black text-indigo-400">{gateDepth}%</span>
                </div>
                <input 
                  type="range" min="10" max="90" step="1"
                  value={gateDepth}
                  onChange={(e) => setGateDepth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">{mode === 'pw' ? 'PW Doppler' : 'CW Doppler'}</h4>
               </div>
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <span className="block text-[8px] font-black text-emerald-400 uppercase mb-1">Primary Benefit</span>
                        <p className="text-xs font-black text-white">{resolutionData[mode].benefit}</p>
                     </div>
                     <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                        <span className="block text-[8px] font-black text-rose-400 uppercase mb-1">Limitation</span>
                        <p className="text-xs font-black text-white">{resolutionData[mode].drawback}</p>
                     </div>
                  </div>
                  <p className="text-sm font-medium text-slate-400 leading-relaxed">
                    {resolutionData[mode].desc}
                  </p>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
                     <Zap size={18} className="text-amber-500 shrink-0 mt-1"/>
                     <p className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase tracking-tight">
                        {resolutionData[mode].physics}
                     </p>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-indigo-600/20 rounded-2xl">
                <Sparkles size={24} className="text-indigo-400" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Registry Pro Tip</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  {mode === 'pw' 
                    ? "Aliasing occurs when velocities exceed the Nyquist limit (PRF/2)." 
                    : "CW Doppler has TWO crystals: one constantly sending, one constantly receiving."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
