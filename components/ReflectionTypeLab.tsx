
import React, { useState, useMemo } from 'react';
import { Waves, Zap, Target, Activity, Info, Sparkles, MoveRight, Layers, Radio } from 'lucide-react';

type ReflectorType = 'specular' | 'diffuse' | 'rayleigh';

export const ReflectionTypeLab: React.FC = () => {
  const [type, setType] = useState<ReflectorType>('specular');
  const [frequency, setFrequency] = useState(5); // MHz

  const data = useMemo(() => {
    switch (type) {
      case 'specular':
        return {
          title: "Specular Reflection",
          description: "Sound hits a large, smooth boundary (e.g., Diaphragm, Vessel Wall). Reflection is unidirectional and angle-dependent.",
          logic: "Boundary size > wavelength",
          impact: "Excellent signal if perpendicular, lost if oblique.",
          color: "text-blue-400"
        };
      case 'diffuse':
        return {
          title: "Diffuse (Backscatter)",
          description: "Sound hits a rough or irregular boundary. Reflection is disorganized and sends echoes in many directions.",
          logic: "Boundary size ≈ wavelength",
          impact: "Allows imaging even if not perpendicular, but signals are weaker.",
          color: "text-amber-400"
        };
      case 'rayleigh':
        return {
          title: "Rayleigh Scattering",
          description: "Sound hits an object much smaller than the wavelength (e.g., Red Blood Cells). Echoes go in all directions equally.",
          logic: "Boundary size << wavelength",
          impact: "Extremely weak. Increases massively with higher frequency (f⁴).",
          color: "text-rose-400"
        };
    }
  }, [type]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Waves size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Layers className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Reflector Interaction Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Specular vs Scattering Simulator</p>
          </div>
          
          <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10">
            {(['specular', 'diffuse', 'rayleigh'] as ReflectorType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  type === t ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Physics Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Boundary / Surface */}
                <div className="absolute bottom-1/4 w-full flex justify-center">
                   {type === 'specular' && <div className="w-4/5 h-2 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>}
                   {type === 'diffuse' && <div className="w-4/5 h-4 bg-amber-500/20 border-t-2 border-dashed border-amber-500/40" style={{ clipPath: 'polygon(0% 100%, 5% 50%, 10% 100%, 15% 50%, 20% 100%, 25% 50%, 30% 100%, 35% 50%, 40% 100%, 45% 50%, 50% 100%, 55% 50%, 60% 100%, 65% 50%, 70% 100%, 75% 50%, 80% 100%, 85% 50%, 90% 100%, 95% 50%, 100% 100%)' }}></div>}
                   {type === 'rayleigh' && (
                     <div className="grid grid-cols-6 gap-8">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rose]" />
                        ))}
                     </div>
                   )}
                </div>

                {/* Sound Rays */}
                <svg className="w-full h-full">
                   {/* Incident Ray */}
                   <line x1="50%" y1="10%" x2="50%" y2="73%" stroke="#fff" strokeWidth="4" strokeDasharray="8" className="animate-dash" />
                   
                   {/* Reflection Rays */}
                   {type === 'specular' && (
                     <line x1="50%" y1="73%" x2="70%" y2="10%" stroke="#3b82f6" strokeWidth="4" className="transition-all duration-500" />
                   )}
                   {type === 'diffuse' && [...Array(5)].map((_, i) => (
                     <line key={i} x1="50%" y1="73%" x2={`${20 + i * 15}%`} y2="20%" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
                   ))}
                   {type === 'rayleigh' && [...Array(12)].map((_, i) => {
                     const angle = (i / 12) * Math.PI * 2;
                     const length = 40 + (frequency * 2);
                     return (
                       <line 
                        key={i} 
                        x1="50%" y1="75%" 
                        x2={`${50 + Math.cos(angle) * length}%`} 
                        y2={`${75 + Math.sin(angle) * length}%`} 
                        stroke="#f43f5e" 
                        strokeWidth="1.5" 
                        opacity="0.5" 
                       />
                     );
                   })}
                </svg>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Acoustic Reflection Map
              </div>
            </div>

            {type === 'rayleigh' && (
              <div className="p-8 bg-rose-900/10 rounded-[2rem] border border-rose-500/20 space-y-6 animate-in slide-in-from-bottom-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest italic flex items-center gap-2">
                       <Radio size={14} /> Scattering Frequency (f)
                    </label>
                    <span className="text-xs font-black text-rose-500">{frequency} MHz</span>
                 </div>
                 <input 
                    type="range" min="2" max="15" step="1"
                    value={frequency}
                    onChange={(e) => setFrequency(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <div className="bg-black/40 p-4 rounded-xl text-center">
                     <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Scattering Intensity (f⁴)</p>
                     <p className="text-xl font-black text-rose-500 tracking-tighter">{(Math.pow(frequency, 4) / 1000).toFixed(1)}x Factor</p>
                  </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
               <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 rounded-xl text-white shadow-lg bg-indigo-600`}>
                    <Activity size={20} />
                  </div>
                  <h4 className={`text-xl font-black tracking-tight ${data.color}`}>{data.title}</h4>
               </div>
               
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Requirement</span>
                        <p className="text-xs font-black text-white">{data.logic}</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Clinical Note</span>
                        <p className="text-xs font-black text-slate-300">{data.impact}</p>
                     </div>
                  </div>
                  
                  <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
                    {data.description}
                  </p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Trap</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "Only <span className="text-white font-bold">Rayleigh scattering</span> is highly dependent on frequency. Specular reflection doesn't care about the frequency, only the angle."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex items-center gap-3">
               <Info size={16} className="text-indigo-300" />
               <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                 Diffuse reflection is why we can see organ parenchyma (liver tissue) from many angles.
               </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -16; }
        }
        .animate-dash {
          stroke-dasharray: 8;
          animation: dash 0.5s linear infinite;
        }
      `}</style>
    </div>
  );
};
