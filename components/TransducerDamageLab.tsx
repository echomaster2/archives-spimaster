
import React, { useState, useMemo } from 'react';
import { ShieldAlert, Zap, Target, Activity, Info, Sparkles, Radio, Cpu, Layers } from 'lucide-react';

type ArrayType = 'linear' | 'phased';

export const TransducerDamageLab: React.FC = () => {
  const [activeArray, setActiveArray] = useState<ArrayType>('linear');
  const [damagedElements, setDamagedElements] = useState<Set<number>>(new Set());

  const toggleDamage = (idx: number) => {
    const next = new Set(damagedElements);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setDamagedElements(next);
  };

  const impactData = useMemo(() => {
    const isDamaged = damagedElements.size > 0;
    if (activeArray === 'linear') {
      return {
        impact: isDamaged ? 'Vertical Line Dropout' : 'Normal Image',
        desc: "Damaged elements in linear arrays result in a vertical dropout directly below the failed crystal.",
        physics: "Sequential firing: each crystal group maps to a specific vertical scan line.",
        color: 'text-blue-400'
      };
    } else {
      return {
        impact: isDamaged ? 'Erratic Steering/Focus' : 'Normal Image',
        desc: "Damaged elements in phased arrays degrade image quality overall, causing blurred focusing or incorrect steering.",
        physics: "Phased firing: EVERY crystal contributes to EVERY scan line.",
        color: 'text-purple-400'
      };
    }
  }, [activeArray, damagedElements]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Cpu size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="text-rose-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Transducer Damage Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Array Failure & Dropout Simulator</p>
          </div>
          
          <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10 shadow-inner">
             <button 
               onClick={() => { setActiveArray('linear'); setDamagedElements(new Set()); }} 
               className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeArray === 'linear' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
             >
               Linear Seq
             </button>
             <button 
               onClick={() => { setActiveArray('phased'); setDamagedElements(new Set()); }} 
               className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeArray === 'phased' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
             >
               Linear Phased
             </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Interactive Transducer Head */}
            <div className="bg-slate-800 rounded-[2.5rem] p-8 border-4 border-slate-700 shadow-inner">
              <p className="text-[9px] font-black text-slate-500 uppercase mb-6 tracking-widest text-center">Click crystals to simulate damage</p>
              <div className="flex justify-center gap-1">
                 {[...Array(16)].map((_, i) => (
                   <button 
                    key={i}
                    onClick={() => toggleDamage(i)}
                    className={`w-4 h-12 rounded-sm border-2 transition-all duration-300 ${
                      damagedElements.has(i) 
                        ? 'bg-rose-900 border-rose-500 shadow-[0_0_10px_rose]' 
                        : 'bg-indigo-500 border-indigo-400 hover:bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    }`}
                   />
                 ))}
              </div>

              {/* Visualized Image Effect */}
              <div className="mt-8 bg-black rounded-2xl h-48 relative overflow-hidden border-2 border-white/5">
                 {activeArray === 'linear' ? (
                    <div className="flex h-full w-full">
                       {[...Array(16)].map((_, i) => (
                         <div 
                           key={i} 
                           className={`flex-1 h-full transition-opacity duration-300 ${
                             damagedElements.has(i) ? 'bg-black' : 'bg-gradient-to-b from-blue-900/40 via-blue-500/20 to-transparent'
                           }`}
                         >
                            {!damagedElements.has(i) && <div className="w-full h-px bg-blue-400/20 mt-4 animate-pulse"></div>}
                         </div>
                       ))}
                    </div>
                 ) : (
                    <div 
                      className={`w-full h-full bg-indigo-900/10 flex items-center justify-center transition-all duration-500 ${damagedElements.size > 0 ? 'blur-[8px] opacity-40' : ''}`}
                    >
                       <svg className="w-full h-full" viewBox="0 0 100 100">
                          <path 
                            d="M 50 0 L 10 100 L 90 100 Z" 
                            fill="rgba(99,102,241,0.2)" 
                            stroke="#6366f1" 
                            strokeWidth="0.5" 
                          />
                          <circle cx="50" cy="50" r="10" fill="#10b981" fillOpacity="0.6" />
                       </svg>
                       {damagedElements.size > 0 && (
                         <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-rose-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded shadow-xl">Degraded Focusing</span>
                         </div>
                       )}
                    </div>
                 )}
                 <div className="absolute top-2 left-4 text-[7px] font-black text-slate-700 uppercase tracking-widest">Simulated B-Mode Screen</div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-center justify-between">
               <div>
                  <span className="block text-[8px] font-black text-slate-500 uppercase">Impact Result</span>
                  <span className={`text-lg font-black ${impactData.color}`}>{impactData.impact}</span>
               </div>
               <button 
                onClick={() => setDamagedElements(new Set())}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
               >
                 Repair All
               </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg`}>
                    <Layers size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Registry Key</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 {impactData.desc}
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Physics Logic:</p>
                  <p className="text-xs italic text-slate-300">"{impactData.physics}"</p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Snapshot</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  <span className="text-white font-bold">Annular Phased Array:</span> Damage results in a <span className="text-white">horizontal</span> dropout line.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex gap-4 items-center">
               <Info className="text-indigo-300" size={16} />
               <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                 Transducers are fragile. The PZT is often only 1/2 wavelength thick—that's thinner than a human hair!
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
