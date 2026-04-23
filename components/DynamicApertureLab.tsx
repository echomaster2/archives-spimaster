
import React, { useState, useMemo } from 'react';
import { Maximize2, Zap, Target, Layers, Info, Sparkles, Radio, Activity } from 'lucide-react';

export const DynamicApertureLab: React.FC = () => {
  const [depth, setDepth] = useState(5); // cm

  const apertureData = useMemo(() => {
    // Basic relationship: Deeper structures need wider apertures (more crystals)
    // to maintain a narrow beam.
    const crystals = Math.min(24, Math.max(4, Math.floor(depth * 3)));
    const beamWidth = 2.0; // Simplified
    
    return {
      crystals,
      width: beamWidth.toFixed(1),
      status: depth > 10 ? 'Wide Aperture' : depth < 3 ? 'Narrow Aperture' : 'Optimal'
    };
  }, [depth]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-right duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Radio size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Layers className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Dynamic Aperture Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Variable Crystal Firing Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Active Crystals</span>
              <span className="text-xl font-black text-indigo-400">{apertureData.crystals}</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Aperture Size</span>
              <span className="text-xl font-black text-emerald-400">{apertureData.status}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Transducer Grid */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex flex-col items-center justify-center p-8">
              
              {/* Transducer Array */}
              <div className="flex gap-1 mb-8">
                {[...Array(24)].map((_, i) => {
                  const isActive = Math.abs(i - 11.5) < (apertureData.crystals / 2);
                  return (
                    <div 
                      key={i} 
                      className={`w-3 h-8 rounded-sm transition-all duration-500 ${
                        isActive ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-700 opacity-30'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Beam Visualization */}
              <div className="relative w-full h-40 flex justify-center">
                 <svg className="w-full h-full" viewBox="0 0 400 200">
                    <path 
                      d={`M ${200 - (apertureData.crystals * 2)} 0 
                         L ${200 - 5} ${depth * 20} 
                         L 200 200 
                         L 200 200 
                         L ${200 + 5} ${depth * 20} 
                         L ${200 + (apertureData.crystals * 2)} 0 Z`}
                      fill="#6366f1"
                      fillOpacity="0.2"
                      stroke="#6366f1"
                      strokeWidth="2"
                      className="transition-all duration-500"
                    />
                    <circle 
                      cx="200" 
                      cy={depth * 20} 
                      r="4" 
                      fill="#10b981" 
                      className="transition-all duration-500 shadow-xl"
                    />
                 </svg>
              </div>

              <div className="absolute bottom-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Listening Depth: {depth} cm
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Target Depth Control</label>
                  <span className="text-xs font-black text-indigo-400">{depth} cm</span>
               </div>
               <input 
                  type="range" min="1" max="15" step="1"
                  value={depth}
                  onChange={(e) => setDepth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Maximize2 size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Aperture Logic</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Dynamic Aperture is a technique where the machine changes the number of elements used to create the beam. This keeps the beam as <span className="text-white font-bold">narrow as possible</span> at all depths.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Shallow Reflector</span>
                    <span className="text-xs font-bold text-white">Few Elements</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Deep Reflector</span>
                    <span className="text-xs font-bold text-white">Many Elements</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-emerald-500/20 rounded-2xl">
                <Target size={24} className="text-emerald-400" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Registry Goal</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  The primary goal of Dynamic Aperture is to optimize <span className="text-white">Lateral Resolution</span> across the entire image depth.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20">
               <p className="text-xs font-bold text-indigo-100/80 leading-relaxed italic">
                 "Think of it like a flashlight: At close range, you use a small hole. For far distance, you need a larger lens."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
