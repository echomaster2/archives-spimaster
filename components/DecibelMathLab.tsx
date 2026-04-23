
import React, { useState, useMemo } from 'react';
import { Calculator, Zap, Target, Activity, Info, Sparkles, Layers, TrendingUp, ArrowRight } from 'lucide-react';

export const DecibelMathLab: React.FC = () => {
  const [initialIntensity, setInitialIntensity] = useState(10); // mW/cm2
  const [dbChange, setDbChange] = useState(3); // dB

  const calculations = useMemo(() => {
    // Intensity Ratio = 10^(dB/10)
    const ratio = Math.pow(10, dbChange / 10);
    const finalIntensity = initialIntensity * ratio;
    
    return {
      ratio: ratio.toFixed(2),
      final: finalIntensity.toFixed(2),
      status: dbChange > 0 ? 'Amplification (Signal Gain)' : 'Attenuation (Energy Loss)',
      color: dbChange > 0 ? 'text-emerald-400' : 'text-rose-400'
    };
  }, [initialIntensity, dbChange]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Calculator size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Logarithmic Decibel Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Intensity Ratios & Comparison Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Ratio Multiplier</span>
              <span className={`text-xl font-black ${calculations.color}`}>
                x{calculations.ratio}
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Final Intensity</span>
              <span className="text-xl font-black text-white">{calculations.final} mW/cm²</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Intensity Map */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              <div className="flex items-end gap-12 h-full w-full px-8 pb-12">
                 <div className="flex-1 flex flex-col items-center gap-4">
                    <div className="w-full bg-slate-700 rounded-t-xl transition-all duration-500" style={{ height: '30%' }}></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase">Input</span>
                 </div>
                 <div className="flex flex-col items-center justify-center pt-20">
                    <ArrowRight className={`transition-all duration-500 ${calculations.color}`} size={40} />
                    <span className={`text-[10px] font-black uppercase mt-2 ${calculations.color}`}>{dbChange} dB</span>
                 </div>
                 <div className="flex-1 flex flex-col items-center gap-4">
                    <div 
                      className={`w-full rounded-t-xl transition-all duration-700 ${dbChange > 0 ? 'bg-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-rose-500/40'}`} 
                      style={{ height: `${Math.min(100, Math.max(5, 30 * parseFloat(calculations.ratio)))}%` }}
                    ></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase">Output</span>
                 </div>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Logarithmic Scale (Comparison)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Intensity</label>
                   <span className="text-xs font-black">{initialIntensity}</span>
                </div>
                <input 
                  type="range" min="1" max="100" step="1"
                  value={initialIntensity}
                  onChange={(e) => setInitialIntensity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">dB Change</label>
                   <span className={`text-xs font-black ${calculations.color}`}>{dbChange} dB</span>
                </div>
                <input 
                  type="range" min="-30" max="30" step="3"
                  value={dbChange}
                  onChange={(e) => setDbChange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[7px] font-black text-slate-600 uppercase">
                   <span>Attenuation</span>
                   <span>Neutral</span>
                   <span>Amplified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The "Rule of Thumbs"</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">
                 Decibels are <span className="text-white">logarithmic comparison</span> units. They don't represent absolute values, but ratios.
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                     <span className="block text-[8px] font-black text-emerald-400 uppercase mb-1">+3 dB</span>
                     <span className="text-xs font-black text-white">Double (x2)</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                     <span className="block text-[8px] font-black text-emerald-400 uppercase mb-1">+10 dB</span>
                     <span className="text-xs font-black text-white">Tenfold (x10)</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                     <span className="block text-[8px] font-black text-rose-400 uppercase mb-1">-3 dB</span>
                     <span className="text-xs font-black text-white">Halved (½)</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                     <span className="block text-[8px] font-black text-rose-400 uppercase mb-1">-10 dB</span>
                     <span className="text-xs font-black text-white">One-tenth (1/10)</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "Negative dB means intensity is decreasing (attenuation). Positive dB means intensity is increasing (amplification)."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex gap-4 items-center">
               <Info size={16} className="text-indigo-300 shrink-0" />
               <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                 Attenuation coefficient in soft tissue is exactly ½ frequency (dB/cm).
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
