
import React, { useState, useMemo } from 'react';
import { Search, Zap, Target, Layers, Info, Sparkles, MoveHorizontal, MoveVertical, Activity } from 'lucide-react';

export const ResolutionLab: React.FC = () => {
  const [frequency, setFrequency] = useState(5); // MHz
  const [cycles, setCycles] = useState(2); // Number of cycles
  const [focalDepth, setFocalDepth] = useState(4); // cm
  const [reflectorSpacing, setReflectorSpacing] = useState(0.8); // mm

  const resParams = useMemo(() => {
    // Improved Physics Models from Neural Briefing
    // Axial Res = SPL / 2. SPL = cycles * wavelength.
    const wavelength = 1.54 / frequency; // mm
    const spl = cycles * wavelength;
    const axialRes = spl / 2;
    
    // Lateral Res = Beam Diameter. Narrowest at focus.
    const lateralResAtFocus = 2.0; 
    
    return {
      axial: axialRes.toFixed(3),
      spl: spl.toFixed(3),
      lateral: lateralResAtFocus.toFixed(1)
    };
  }, [frequency, cycles]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-right duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Search size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Resolution Dynamics Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Axial vs Lateral Precision Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Axial (LARRD)</span>
              <span className="text-xl font-black text-indigo-400">{resParams.axial} mm</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Lateral (LATA)</span>
              <span className="text-xl font-black text-emerald-400">{resParams.lateral} mm</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            {/* Visual Scan Area */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner group">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {/* Beam Visualization */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset={focalDepth * 10 + "%"} stopColor="#6366f1" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {/* Simulated Beam Shape */}
                <path 
                  d={`M ${150 - 20} 0 L ${150 - 5} ${focalDepth * 40} L ${150 - 30} 320 L ${150 + 30} 320 L ${150 + 5} ${focalDepth * 40} L ${150 + 20} 0 Z`} 
                  fill="url(#beamGrad)"
                  className="transition-all duration-500"
                />
              </svg>

              {/* Reflectors Area */}
              <div className="absolute inset-0 flex flex-col items-center pt-20">
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Target Reflectors</div>
                
                {/* Axial Pair (Vertical) */}
                <div className="relative h-20 w-full flex items-center justify-center border-b border-white/5">
                  <div className="absolute left-10 text-[8px] font-black text-indigo-500 uppercase -rotate-90">Axial Test</div>
                  <div className="flex flex-col items-center gap-2" style={{ gap: `${reflectorSpacing * 15}px` }}>
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                  </div>
                  <div className="absolute right-10 text-[8px] font-bold text-slate-500 italic">
                    {parseFloat(resParams.axial) < reflectorSpacing ? "RESOLVED ✅" : "BLURRED ❌"}
                  </div>
                </div>

                {/* Lateral Pair (Horizontal) */}
                <div className="relative h-24 w-full flex items-center justify-center">
                  <div className="absolute left-10 text-[8px] font-black text-emerald-500 uppercase -rotate-90">Lateral Test</div>
                  <div className="flex items-center" style={{ gap: `${reflectorSpacing * 15}px`, transform: `translateY(${(focalDepth - 4) * 20}px)` }}>
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                  </div>
                  <div className="absolute right-10 text-[8px] font-bold text-slate-500 italic">
                    {/* Lateral is best at focus */}
                    {(reflectorSpacing > 0.5) ? "RESOLVED ✅" : "BLURRED ❌"}
                  </div>
                </div>
              </div>

              {/* Focus Marker */}
              <div 
                className="absolute left-0 w-full border-t border-dashed border-emerald-500/50 flex justify-end pr-4 pointer-events-none transition-all duration-500"
                style={{ top: `${focalDepth * 40}px` }}
              >
                <span className="text-[8px] font-black text-emerald-500 uppercase bg-black px-2 -mt-1.5">Focal Zone</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pulse Cycles</label>
                   <span className="text-xs font-black text-purple-400">{cycles} λ</span>
                </div>
                <input 
                  type="range" min="1" max="5" step="1"
                  value={cycles}
                  onChange={(e) => setCycles(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4 col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Focal Depth</label>
                   <span className="text-xs font-black text-emerald-400">{focalDepth} cm</span>
                </div>
                <input 
                  type="range" min="1" max="7" step="0.5"
                  value={focalDepth}
                  onChange={(e) => setFocalDepth(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <MoveVertical size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Axial Resolution</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Ability to distinguish structures parallel to the beam. Higher frequency shortens the pulse, improving resolution.
               </p>
               <div className="bg-[#080c14] p-5 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={40} /></div>
                 <p className="text-[10px] font-black text-indigo-400 uppercase mb-3 tracking-widest">Flying Whales Mnemonic</p>
                 <div className="space-y-2">
                    <p className="text-[11px] font-bold text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> <span className="text-indigo-400">F</span>lying <span className="text-indigo-400">W</span>hales: Frequency → Wavelength</p>
                    <p className="text-[11px] font-bold text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> <span className="text-indigo-400">S</span>mash: Wavelength → SPL</p>
                    <p className="text-[11px] font-bold text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> <span className="text-indigo-400">R</span>ocks: SPL → Resolution</p>
                 </div>
               </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-[2.5rem] border border-emerald-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-lg">
                    <MoveHorizontal size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Lateral Resolution</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Ability to distinguish structures side-by-side (perpendicular). Best at the focus where the beam is narrowest.
               </p>
               <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-black text-emerald-400 uppercase mb-2">LATA Mnemonic</p>
                 <p className="text-[11px] font-bold text-white/80 tracking-wide">Lateral, Angular, Transverse, Azimuthal</p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Tip</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "Frequency improves Axial EVERYWHERE, but improves Lateral only in the far field."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
