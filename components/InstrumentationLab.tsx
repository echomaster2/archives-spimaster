
import React, { useState, useMemo } from 'react';
import { Cpu, Zap, Activity, Filter, Layers, Maximize2, Settings2, Sliders } from 'lucide-react';

export const InstrumentationLab: React.FC = () => {
  const [gain, setGain] = useState(50);
  const [tgc, setTgc] = useState(30);
  const [dynamicRange, setDynamicRange] = useState(60);

  const signalPoints = useMemo(() => {
    const points = [];
    const steps = 100;
    const width = 800;
    const height = 200;
    
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      // Base signal + attenuation (decreasing amplitude with x)
      const baseAmp = 40 * Math.exp(-i * 0.02);
      // Processed signal: Gain boosts everything, TGC boosts far field (higher i)
      const boost = (gain / 50) + (i / steps * (tgc / 20));
      const processedAmp = baseAmp * boost;
      
      // Compression (Dynamic Range effect)
      const finalAmp = Math.min(processedAmp, dynamicRange * 1.5);
      
      const y = height / 2 + Math.sin(i * 0.5) * finalAmp;
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }, [gain, tgc, dynamicRange]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Cpu size={180} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Settings2 className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest">Receiver Master Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Signal Processing & Knobology Simulator</p>
          </div>
          
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                <span className="block text-[8px] font-black text-slate-500 uppercase">Signal/Noise</span>
                <span className="text-xs font-black text-emerald-400">OPTIMAL</span>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Oscilloscope View */}
            <div className="bg-slate-950 rounded-[2.5rem] h-64 relative overflow-hidden border-4 border-slate-800 shadow-inner group">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              
              <div className="absolute top-4 left-6 flex items-center gap-2">
                 <Activity size={14} className="text-indigo-500 animate-pulse"/>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processed Echo Amplitude</span>
              </div>

              <svg viewBox="0 0 800 200" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  points={signalPoints}
                />
              </svg>

              <div className="absolute bottom-4 right-6 flex items-center gap-4">
                 <span className="text-[8px] font-bold text-slate-600 uppercase italic">Time-Gain Compensation Curve Active</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Overall Gain</label>
                   <span className="text-[10px] font-black text-indigo-400">{gain}%</span>
                </div>
                <input 
                  type="range" min="0" max="100"
                  value={gain}
                  onChange={(e) => setGain(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">TGC (Far Gain)</label>
                   <span className="text-[10px] font-black text-emerald-400">{tgc}%</span>
                </div>
                <input 
                  type="range" min="0" max="100"
                  value={tgc}
                  onChange={(e) => setTgc(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dynamic Range</label>
                   <span className="text-[10px] font-black text-amber-400">{dynamicRange} dB</span>
                </div>
                <input 
                  type="range" min="10" max="100"
                  value={dynamicRange}
                  onChange={(e) => setDynamicRange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
               <h4 className="text-lg font-black mb-4 tracking-tight flex items-center gap-2">
                 <Sliders size={18} className="text-indigo-400"/> Receiver Functions
               </h4>
               <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-indigo-400 font-black text-[10px]">1</span>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase mb-0.5">Amplification</p>
                      <p className="text-[9px] text-slate-400 leading-relaxed">Gain boosts all signals equally. Does not improve signal-to-noise ratio.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-emerald-400 font-black text-[10px]">2</span>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase mb-0.5">Compensation</p>
                      <p className="text-[9px] text-slate-400 leading-relaxed">TGC offsets attenuation. Creates uniform brightness from top to bottom.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-amber-400 font-black text-[10px]">3</span>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase mb-0.5">Compression</p>
                      <p className="text-[9px] text-slate-400 leading-relaxed">Reduces the signal range (dB) so it's viewable. Controls contrast.</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/20">
               <div className="flex items-center gap-3 mb-2">
                  <Zap className="text-indigo-200" size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Registry Fact</h4>
               </div>
               <p className="text-xs font-medium text-indigo-100 leading-relaxed">
                 The receiver functions must follow a strict alphabetical order: <span className="font-black italic">Amplification, Compensation, Compression, Demodulation, Rejection.</span>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
