
import React, { useState, useMemo } from 'react';
import { Radio, Zap, Target, Activity, Info, Sparkles, Layers, Box, MoveRight } from 'lucide-react';

export const FrequencyLab: React.FC = () => {
  const [isCompounding, setIsCompounding] = useState(false);
  const [depth, setDepth] = useState(10); // cm

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Radio size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Radio className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Frequency Compounding Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Broadband Signal & Speckle Reduction Simulator</p>
          </div>
          
          <button 
            onClick={() => setIsCompounding(!isCompounding)}
            className={`px-10 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all shadow-xl border-2 ${
              isCompounding ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {isCompounding ? 'Frequency Compounding: ON' : 'Single Freq Pulse'}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Wave Interaction Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="relative w-full h-full flex flex-col justify-center gap-4">
                 {/* High Freq Band */}
                 <div className={`h-12 w-full flex items-center justify-center border-b border-white/5 transition-opacity duration-700 ${isCompounding ? 'opacity-40' : 'opacity-100'}`}>
                    <svg className="w-full h-full">
                       <path d={(() => {
                         let p = "M 0 24 ";
                         for(let x=0; x<400; x++) p += `L ${x} ${24 + Math.sin(x * 0.4) * 15} `;
                         return p;
                       })()} fill="none" stroke="#6366f1" strokeWidth="2" />
                    </svg>
                    <span className="absolute left-2 text-[6px] font-black uppercase text-indigo-400">High Band</span>
                 </div>

                 {/* Low Freq Band */}
                 {isCompounding && (
                    <div className="h-12 w-full flex items-center justify-center border-b border-white/5 opacity-40 animate-in slide-in-from-left duration-700">
                       <svg className="w-full h-full">
                          <path d={(() => {
                            let p = "M 0 24 ";
                            for(let x=0; x<400; x++) p += `L ${x} ${24 + Math.sin(x * 0.1) * 15} `;
                            return p;
                          })()} fill="none" stroke="#10b981" strokeWidth="2" />
                       </svg>
                       <span className="absolute left-2 text-[6px] font-black uppercase text-emerald-400">Low Band</span>
                    </div>
                 )}

                 {/* Compounded Result */}
                 <div className={`h-24 w-full bg-white/5 rounded-2xl relative overflow-hidden flex items-center transition-all duration-700 ${isCompounding ? 'scale-105 border border-white/10' : 'opacity-20'}`}>
                    <svg className="w-full h-full">
                       <path d={(() => {
                         let p = "M 0 48 ";
                         for(let x=0; x<400; x++) {
                           const s1 = Math.sin(x * 0.4) * 15;
                           const s2 = isCompounding ? Math.sin(x * 0.1) * 15 : 0;
                           p += `L ${x} ${48 + s1 + s2} `;
                         }
                         return p;
                       })()} fill="none" stroke={isCompounding ? "#fff" : "#6366f1"} strokeWidth="3" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-emerald-500/10"></div>
                 </div>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Acoustic Processing: {isCompounding ? 'Broadband Fusion' : 'Traditional Single Pulse'}
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 flex gap-6">
               <div className="flex-1 space-y-2">
                  <span className="block text-[8px] font-black text-slate-500 uppercase">Speckle Noise</span>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                     <div className={`h-full transition-all duration-1000 ${isCompounding ? 'bg-emerald-500 w-[20%]' : 'bg-rose-500 w-[80%]'}`} />
                  </div>
               </div>
               <div className="flex-1 space-y-2">
                  <span className="block text-[8px] font-black text-slate-500 uppercase">SNR Clarity</span>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                     <div className={`h-full transition-all duration-1000 ${isCompounding ? 'bg-emerald-500 w-[90%]' : 'bg-amber-500 w-[50%]'}`} />
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Layers size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Compounding Rule</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Frequency Compounding is a <span className="text-white font-bold">Pre-processing</span> technique. It splits the reflection into several "sub-bands." Images from different frequencies are averaged to reduce <span className="text-indigo-400 font-black">Speckle</span> and <span className="text-indigo-400 font-black">Noise</span>.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-emerald-400 uppercase">Pro:</span>
                    <span className="text-slate-300 italic">Clearer structural boundaries</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-emerald-400 uppercase">Pro:</span>
                    <span className="text-slate-300 italic">No drop in frame rate</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Unlike <span className="text-white">Spatial Compounding</span>, Frequency Compounding does NOT require multiple pulses from different angles. It works from a <span className="text-white">single pulse</span>.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex gap-4 items-center">
               <div className="p-2 bg-indigo-600 rounded-lg shrink-0">
                  <Info size={16} />
               </div>
               <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                 Frequency compounding improves SNR because speckle patterns vary with frequency, but real anatomy stays the same.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
