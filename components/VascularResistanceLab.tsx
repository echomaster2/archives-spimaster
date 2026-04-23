
import React, { useState, useMemo } from 'react';
import { Droplet, Zap, Target, Activity, Info, Sparkles, ArrowRight, Gauge } from 'lucide-react';

export const VascularResistanceLab: React.FC = () => {
  const [radius, setRadius] = useState(1.0); // mm
  const [length, setLength] = useState(5); // cm
  const [viscosity, setViscosity] = useState(3.5); // cP (Blood is ~3-4)

  const resistanceData = useMemo(() => {
    // Poiseuille's Law: R = (8 * viscosity * length) / (pi * radius^4)
    // We'll use relative units for visualization
    const r4 = Math.pow(radius, 4);
    const resistance = (8 * (viscosity / 10) * (length / 5)) / r4;
    
    // Q = Delta P / R. Assume Delta P = 100 mmHg
    const flowRate = 10 / resistance;

    return {
      resistance: resistance.toFixed(2),
      flowRate: flowRate.toFixed(1),
      radiusPower: r4.toFixed(2),
      status: resistance > 5 ? 'High Resistance' : resistance < 1 ? 'Low Resistance' : 'Normal'
    };
  }, [radius, length, viscosity]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-right duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Droplet size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="text-rose-500" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Vascular Resistance Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Poiseuille's Law & Hemodynamics</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Resistance</span>
              <span className={`text-xl font-black ${parseFloat(resistanceData.resistance) > 5 ? 'text-rose-500' : 'text-emerald-400'}`}>
                {resistanceData.resistance} Units
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Flow Rate (Q)</span>
              <span className="text-xl font-black text-indigo-400">{resistanceData.flowRate} ml/s</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Vessel Simulation */}
            <div className="bg-slate-800 rounded-[2.5rem] h-64 relative overflow-hidden border-4 border-slate-700 shadow-inner group flex items-center justify-center p-8">
               <div 
                 className="w-full h-12 bg-rose-500/10 border-y-2 border-rose-500/20 relative flex items-center transition-all duration-500"
                 style={{ height: `${radius * 40}px` }}
               >
                  <div className="absolute inset-0 flex items-center justify-around">
                     {[...Array(15)].map((_, i) => (
                       <div 
                         key={i} 
                         className="w-1 h-1 bg-rose-500 rounded-full animate-flow-move"
                         style={{ 
                           animationDuration: `${Math.max(0.2, parseFloat(resistanceData.resistance) / 5)}s`,
                           animationDelay: `${i * 0.1}s`
                         }}
                       />
                     ))}
                  </div>
               </div>
               
               <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-rose-400">
                 Flow State: {resistanceData.status}
               </div>
               
               <div className="absolute bottom-4 right-6 text-[8px] font-bold text-slate-500 uppercase">
                 r⁴ effect: {resistanceData.radiusPower}
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Vessel Radius (r)</label>
                   <span className="text-xs font-black text-rose-400">{radius} mm</span>
                </div>
                <input 
                  type="range" min="0.5" max="2.0" step="0.1"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
                   <span>Vasoconstriction</span>
                   <span>Vasodilation</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Length (L)</label>
                       <span className="text-xs font-black">{length} cm</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="1"
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Viscosity (η)</label>
                       <span className="text-xs font-black">{viscosity}</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="0.5"
                      value={viscosity}
                      onChange={(e) => setViscosity(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-rose-500/10 to-transparent rounded-[2.5rem] border border-rose-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-rose-600 rounded-xl text-white shadow-lg">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Radius Rule</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 In hemodynamics, <span className="text-white font-bold">Radius</span> is the single most important factor. Because it is raised to the <span className="text-rose-400 font-black">4th power</span>, a tiny change in radius causes a massive change in resistance.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Poiseuille's Equation</p>
                  <p className="text-lg font-black tracking-widest italic text-rose-400">R = 8ηL / πr⁴</p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "If the radius of a vessel is halved, the resistance increases by <span className="text-white font-bold">16 times</span>."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20">
               <p className="text-xs font-bold text-indigo-100/80 leading-relaxed">
                 Resistance is <span className="underline">directly proportional</span> to length and viscosity, but <span className="underline">inversely proportional</span> to radius⁴.
               </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes flow-move {
          from { transform: translateX(-100px); }
          to { transform: translateX(400px); }
        }
        .animate-flow-move {
          animation: flow-move linear infinite;
        }
      `}</style>
    </div>
  );
};
