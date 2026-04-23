
import React, { useState, useMemo } from 'react';
import { Target, Zap, Activity, Info, Sparkles, MoveHorizontal, Maximize2 } from 'lucide-react';

export const BeamProfileLab: React.FC = () => {
  const [diameter, setDiameter] = useState(10); // mm
  const [frequency, setFrequency] = useState(5); // MHz

  const beamMetrics = useMemo(() => {
    // NZL = (D^2 * f) / 6 (Approximate soft tissue formula)
    const nzl = (Math.pow(diameter, 2) * frequency) / 6;
    
    // Divergence (Far field) sin(theta) = 1.22 * lambda / D
    const lambda = 1.54 / frequency;
    const divergence = (1.22 * lambda) / diameter;
    const divergenceDeg = Math.asin(Math.min(1, divergence)) * (180 / Math.PI);

    return {
      nzl: nzl.toFixed(1),
      divergence: divergenceDeg.toFixed(1),
      focusDiameter: (diameter / 2).toFixed(1)
    };
  }, [diameter, frequency]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-right duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Target size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Maximize2 className="text-blue-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Beam Profiler Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Fresnel & Fraunhofer Dynamics</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Near Zone Length</span>
              <span className="text-xl font-black text-blue-400">{beamMetrics.nzl} mm</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Far Field Div.</span>
              <span className="text-xl font-black text-indigo-400">{beamMetrics.divergence}°</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Beam Profile */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner group flex items-center">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              
              {/* Beam Shape SVG */}
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                
                {/* 
                   Logic: 
                   x=0 is crystal. width=diameter.
                   x=NZL is focal point. width=diameter/2.
                   x > NZL is far field. divergence increases.
                */}
                {(() => {
                  const nzlMapped = Math.min(300, parseFloat(beamMetrics.nzl) * 2);
                  const dMapped = diameter * 2;
                  const divMapped = parseFloat(beamMetrics.divergence) * 2;
                  
                  return (
                    <path 
                      d={`M 0 ${100 - dMapped/2} 
                         L ${nzlMapped} ${100 - dMapped/4} 
                         L 400 ${100 - (dMapped/4 + divMapped)} 
                         L 400 ${100 + (dMapped/4 + divMapped)} 
                         L ${nzlMapped} ${100 + dMapped/4} 
                         L 0 ${100 + dMapped/2} Z`}
                      fill="url(#beamGradient)"
                      className="transition-all duration-500"
                    />
                  );
                })()}
                
                {/* Center Line */}
                <line x1="0" y1="100" x2="400" y2="100" stroke="white" strokeWidth="1" strokeDasharray="4" opacity="0.2" />
              </svg>

              {/* Zone Labels */}
              <div className="absolute top-4 left-4 flex flex-col gap-1">
                 <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest bg-blue-900/50 px-2 py-0.5 rounded">Fresnel Zone</span>
                 <span className="text-[6px] font-bold text-slate-500 italic">Near Field</span>
              </div>
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                 <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-900/50 px-2 py-0.5 rounded">Fraunhofer Zone</span>
                 <span className="text-[6px] font-bold text-slate-500 italic">Far Field</span>
              </div>

              {/* Focal Point Marker */}
              <div 
                className="absolute top-0 bottom-0 border-l border-white/20 flex flex-col justify-center transition-all duration-500"
                style={{ left: `${Math.min(300, parseFloat(beamMetrics.nzl) * 2)}px` }}
              >
                 <div className="bg-white text-slate-900 px-2 py-1 -ml-6 rounded-md text-[8px] font-black uppercase shadow-lg">Focus</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Crystal Diameter</label>
                   <span className="text-xs font-black text-blue-400">{diameter} mm</span>
                </div>
                <input 
                  type="range" min="5" max="20" step="1"
                  value={diameter}
                  onChange={(e) => setDiameter(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Frequency</label>
                   <span className="text-xs font-black text-indigo-400">{frequency} MHz</span>
                </div>
                <input 
                  type="range" min="2" max="15" step="0.5"
                  value={frequency}
                  onChange={(e) => setFrequency(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-blue-500/10 to-transparent rounded-[2.5rem] border border-blue-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Near Zone (NZL)</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Also called the Fresnel zone. It is the region from the transducer to the focus. <span className="text-blue-400 font-bold">Increasing diameter or frequency</span> lengthens this zone.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Registry Equation</p>
                  <p className="text-lg font-black tracking-widest italic text-blue-400">NZL = D² / 4λ</p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Far Field Logic</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Smaller crystals and lower frequencies produce <span className="text-amber-400">MORE divergence</span> in the far field, which worsens lateral resolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
