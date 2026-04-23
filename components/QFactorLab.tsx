
import React, { useState, useMemo } from 'react';
import { Target, Zap, Activity, Info, Sparkles, BarChart3, Radio, Box } from 'lucide-react';

export const QFactorLab: React.FC = () => {
  const [damping, setDamping] = useState(70); // % of damping
  const centerFreq = 5.0; // MHz

  const qData = useMemo(() => {
    // Simplified physics: More damping = higher bandwidth = lower Q-factor
    const bandwidth = (damping / 100) * centerFreq * 1.5;
    const qFactor = centerFreq / Math.max(0.1, bandwidth);
    
    return {
      bw: bandwidth.toFixed(1),
      q: qFactor.toFixed(2),
      isImaging: qFactor < 2.0
    };
  }, [damping]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Box size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-amber-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Bandwidth & Q-Factor Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Damping & Axial Resolution Trade-offs</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Quality Factor (Q)</span>
              <span className={`text-xl font-black ${qData.q < '2.00' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {qData.q}
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Bandwidth</span>
              <span className="text-xl font-black text-indigo-400">{qData.bw} MHz</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Pulse Duration & Bandwidth */}
            <div className="bg-slate-950 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex flex-col p-8 gap-8">
              
              {/* Pulse Visualization */}
              <div className="flex-1 border-b border-white/5 flex flex-col justify-center">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-4">Pulse Ringing Time</span>
                <svg viewBox="0 0 800 100" className="w-full h-16">
                  <path 
                    d={(() => {
                      let path = "M 400 50 ";
                      const decay = 100 - damping;
                      for (let x = 0; x < 200; x++) {
                        const env = 40 * Math.exp(-x * (damping/200));
                        const y1 = 50 + Math.sin(x * 0.5) * env;
                        path += `L ${400 + x} ${y1} `;
                      }
                      let pathBack = "M 400 50 ";
                      for (let x = 0; x < 200; x++) {
                        const env = 40 * Math.exp(-x * (damping/200));
                        const y1 = 50 + Math.sin(-x * 0.5) * env;
                        pathBack += `L ${400 - x} ${y1} `;
                      }
                      return pathBack + path;
                    })()}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              {/* Bandwidth Spectrum Visualization */}
              <div className="flex-1 flex flex-col justify-end">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Frequency Spectrum</span>
                <div className="w-full h-24 bg-white/5 rounded-xl border border-white/10 relative flex items-end justify-center px-4 overflow-hidden">
                   <div 
                     className="bg-indigo-500/40 border-x-4 border-indigo-400 rounded-t-3xl transition-all duration-500"
                     style={{ width: `${parseFloat(qData.bw) * 30}px`, height: '90%' }}
                   >
                     <div className="w-full h-full bg-gradient-to-t from-indigo-500/20 to-white/10 flex items-center justify-center">
                        <span className="text-[8px] font-black text-indigo-100 uppercase rotate-90 whitespace-nowrap">BW: {qData.bw} MHz</span>
                     </div>
                   </div>
                   <div className="absolute bottom-0 w-full h-px bg-white/20"></div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" /> Backing Material Effectiveness
                  </label>
                  <span className="text-xs font-black text-amber-400">{damping}%</span>
               </div>
               <input 
                  type="range" min="10" max="95" step="1"
                  value={damping}
                  onChange={(e) => setDamping(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Target size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Imaging Rule</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Damping material (Backing) reduces the "ringing" of the crystal. This creates <span className="text-indigo-400 font-bold">shorter pulses</span> and a <span className="text-indigo-400 font-bold">wider bandwidth</span>.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Registry Goal</span>
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest italic">Low Q-Factor</span>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Math</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "Q-Factor = Operating Frequency / Bandwidth. It is a unitless number."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-emerald-900/20 rounded-[2rem] border border-emerald-500/20">
               <p className="text-xs font-bold text-emerald-100/80 leading-relaxed">
                 High Q-Factor transducers (no damping) are used in <span className="underline">Therapeutic Ultrasound</span> or <span className="underline">CW Doppler</span> where long, pure tones are needed.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
