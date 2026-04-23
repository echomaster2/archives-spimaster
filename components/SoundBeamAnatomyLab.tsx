
import React, { useState, useMemo } from 'react';
import { Maximize2, Zap, Target, Activity, Info, Sparkles, Layers, Box, MoveRight } from 'lucide-react';

export const SoundBeamAnatomyLab: React.FC = () => {
  const [focalLength, setFocalLength] = useState(100); // pixels
  const [diameter, setDiameter] = useState(40); // pixels

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-right duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Target size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Box className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Beam Anatomy Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Fresnel & Fraunhofer Zone Visualization</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Focus Diameter</span>
              <span className="text-xl font-black text-emerald-400">{Math.round(diameter / 2)} mm</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Focal Length</span>
              <span className="text-xl font-black text-indigo-400">{focalLength} mm</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Beam anatomy simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="relative w-full h-full p-8 flex items-center">
                {/* Crystal */}
                <div 
                  className="w-4 bg-slate-400 rounded-sm border-r-4 border-indigo-600 shadow-xl transition-all duration-500" 
                  style={{ height: `${diameter}px` }}
                ></div>

                {/* The Beam Path */}
                <svg className="flex-1 h-full overflow-visible">
                   <defs>
                      <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                         <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                         <stop offset={`${(focalLength / 350) * 100}%`} stopColor="#6366f1" stopOpacity="0.2" />
                         <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                      </linearGradient>
                   </defs>
                   
                   {/* Fresnel / NZL Region */}
                   <path 
                     d={`M 0 ${40 - diameter/2} L ${focalLength} ${40 - diameter/4} L ${focalLength} ${40 + diameter/4} L 0 ${40 + diameter/2} Z`}
                     fill="url(#beamGrad)"
                     className="transition-all duration-500"
                     style={{ transform: 'translateY(110px)' }}
                   />

                   {/* Fraunhofer / Far Field Region */}
                   <path 
                     d={`M ${focalLength} ${40 - diameter/4} L 350 ${40 - diameter/2} L 350 ${40 + diameter/2} L ${focalLength} ${40 + diameter/4} Z`}
                     fill="#6366f1"
                     fillOpacity="0.1"
                     className="transition-all duration-500"
                     style={{ transform: 'translateY(110px)' }}
                   />

                   {/* Center Axis */}
                   <line x1="0" y1="150" x2="350" y2="150" stroke="white" strokeWidth="1" strokeDasharray="4" opacity="0.2" />

                   {/* Labels */}
                   <text x="20" y="100" fill="rgba(255,255,255,0.4)" fontSize="8" className="font-black uppercase">Near Zone</text>
                   <text x={focalLength + 20} y="100" fill="rgba(255,255,255,0.4)" fontSize="8" className="font-black uppercase">Far Zone</text>
                   <circle cx={focalLength} cy="150" r="4" fill="#10b981" className="transition-all duration-500 animate-pulse" />
                </svg>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Transducer Diameter: {diameter} mm
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Focal Depth (NZL)</label>
                   <span className="text-xs font-black text-indigo-400">{focalLength}</span>
                </div>
                <input 
                  type="range" min="40" max="250" step="5"
                  value={focalLength}
                  onChange={(e) => setFocalLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PZT Diameter</label>
                   <span className="text-xs font-black text-emerald-400">{diameter}</span>
                </div>
                <input 
                  type="range" min="10" max="100" step="2"
                  value={diameter}
                  onChange={(e) => setDiameter(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Layers size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The 5 Beam Parts</h4>
               </div>
               <div className="space-y-3">
                  {[
                    "Focus: Beam is at its narrowest point.",
                    "Near Zone (Fresnel): Transducer to focus.",
                    "Focal Length (NZL): The actual distance.",
                    "Far Zone (Fraunhofer): Beyond the focus.",
                    "Focal Zone: Region around the focus (sharpest)."
                  ].map((line, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                       <div className="w-1 h-1 rounded-full bg-indigo-500" />
                       {line}
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Rules</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "At the transducer, beam width = D. At the focus, beam width = ½ D. At 2 x NZL, beam width = D again."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
