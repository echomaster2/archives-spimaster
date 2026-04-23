
import React, { useState, useMemo } from 'react';
import { Gauge, Zap, Activity, Info, Sparkles, Wind, Database, Layers } from 'lucide-react';

const MEDIA_DATA = [
  { name: "Air", speed: 330, color: "bg-slate-300", info: "Extremely low speed due to compressibility." },
  { name: "Lung", speed: 500, color: "bg-blue-200", info: "Air-filled tissue significantly slows sound." },
  { name: "Fat", speed: 1450, color: "bg-yellow-200", info: "Slower than soft tissue average." },
  { name: "Soft Tissue", speed: 1540, color: "bg-rose-200", info: "The ARDMS Standard Average." },
  { name: "Liver", speed: 1560, color: "bg-orange-300", info: "Slightly faster than average soft tissue." },
  { name: "Blood", speed: 1560, color: "bg-red-500", info: "Matches liver/muscle closely." },
  { name: "Muscle", speed: 1600, color: "bg-red-700", info: "Higher stiffness increases speed." },
  { name: "Bone", speed: 3500, color: "bg-slate-100", info: "High stiffness = High speed." }
];

export const SpeedOfSoundLab: React.FC = () => {
  const [selectedMedium, setSelectedMedium] = useState(MEDIA_DATA[3]); // Default Soft Tissue
  const [stiffness, setStiffness] = useState(50); // Relative
  const [density, setDensity] = useState(50); // Relative

  const calculatedSpeed = useMemo(() => {
    // Speed is proportional to sqrt(Stiffness / Density)
    // Registry Logic: Stiffness (Bulk Modulus) is the dominant factor.
    const base = selectedMedium.speed;
    const stiffnessFactor = 1 + (stiffness - 50) / 100;
    const densityFactor = 1 - (density - 50) / 200;
    return Math.round(base * stiffnessFactor * densityFactor);
  }, [selectedMedium, stiffness, density]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Gauge size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="text-cyan-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Speed of Sound Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Propagation Speed & Media Density</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Current Medium</span>
              <span className="text-xl font-black text-cyan-400 uppercase tracking-tighter">{selectedMedium.name}</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Effective Velocity</span>
              <span className="text-xl font-black text-emerald-400">{calculatedSpeed} m/s</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Media Comparison */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner p-8 flex flex-col justify-end">
              <div className="flex items-end gap-2 h-full">
                {MEDIA_DATA.map((m) => (
                  <div key={m.name} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setSelectedMedium(m)}>
                    <div 
                      className={`w-full rounded-t-xl transition-all duration-500 ${m.color} ${selectedMedium.name === m.name ? 'ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'opacity-40 group-hover:opacity-100'}`}
                      style={{ height: `${(m.speed / 3500) * 100}%` }}
                    ></div>
                    <span className="text-[7px] font-black text-slate-500 uppercase rotate-45 mt-4 origin-left whitespace-nowrap">{m.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Media Velocity Chart (m/s)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Layers size={12} className="text-indigo-400"/> Stiffness (B)
                   </label>
                   <span className="text-xs font-black">{stiffness}%</span>
                </div>
                <input 
                  type="range" min="1" max="100"
                  value={stiffness}
                  onChange={(e) => setStiffness(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Database size={12} className="text-rose-400"/> Density (ρ)
                   </label>
                   <span className="text-xs font-black">{density}%</span>
                </div>
                <input 
                  type="range" min="1" max="100"
                  value={density}
                  onChange={(e) => setDensity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-[2.5rem] border border-cyan-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-cyan-600 rounded-xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Stiffness Rule</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Propagation speed depends <span className="text-white font-bold">ONLY</span> on the medium's stiffness and density. It is NOT affected by frequency!
               </p>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-400 uppercase">Stiffness ↑</span>
                    <span className="text-xs font-bold text-white">Speed ↑</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase">Density ↑</span>
                    <span className="text-xs font-bold text-white">Speed ↓</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Shortcut</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "Bulky (stiff) is Fast. Dense (heavy) is Slow."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
               <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Medium Fact: {selectedMedium.name}</h5>
               <p className="text-xs text-slate-400 leading-relaxed">{selectedMedium.info}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
