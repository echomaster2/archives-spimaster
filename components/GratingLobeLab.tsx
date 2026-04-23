
import React, { useState, useMemo } from 'react';
import { Radio, Zap, Target, Activity, Info, Sparkles, Layers, ShieldAlert, Cpu } from 'lucide-react';

export const GratingLobeLab: React.FC = () => {
  const [isApodized, setIsApodized] = useState(false);
  const [isSubdiced, setIsSubdiced] = useState(false);
  const [transducerType, setTransducerType] = useState<'single' | 'array'>('array');

  const lobeData = useMemo(() => {
    const lobeIntensity = transducerType === 'single' 
      ? 40 // Side lobes are always present in single
      : (isApodized && isSubdiced ? 5 : isApodized || isSubdiced ? 15 : 45);
    
    return {
      intensity: lobeIntensity,
      label: transducerType === 'single' ? 'Side Lobes' : 'Grating Lobes',
      status: lobeIntensity < 10 ? 'Optimal' : lobeIntensity < 20 ? 'Reduced' : 'High Artifact Risk'
    };
  }, [isApodized, isSubdiced, transducerType]);

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
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Acoustic Lobe Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Off-Axis Energy & Artifact Fixes</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Lobe Type</span>
              <span className="text-xl font-black text-rose-400 uppercase tracking-tighter">{lobeData.label}</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Signal Integrity</span>
              <span className={`text-xl font-black ${lobeData.intensity < 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {lobeData.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Lobe Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8">
              
              <div className="relative w-full h-full flex flex-col items-center">
                {/* Transducer Face */}
                <div className="w-32 h-4 bg-slate-400 rounded-t-sm flex gap-0.5 px-0.5 relative z-20">
                   {[...Array(10)].map((_, i) => (
                     <div key={i} className="flex-1 h-full bg-indigo-500/50 border-x border-white/5"></div>
                   ))}
                   {isSubdiced && transducerType === 'array' && (
                     <div className="absolute inset-0 flex">
                        {[...Array(20)].map((_, i) => (
                          <div key={i} className="flex-1 h-full border-r border-black/40"></div>
                        ))}
                     </div>
                   )}
                </div>

                {/* Main Beam */}
                <div className="w-8 h-full bg-gradient-to-b from-indigo-500/60 to-transparent shadow-[0_0_30px_rgba(99,102,241,0.3)] relative z-10"></div>

                {/* Lobes (The "Wings") */}
                <div 
                  className="absolute top-4 w-48 h-40 bg-rose-500/20 transition-all duration-700"
                  style={{ 
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    opacity: lobeData.intensity / 100,
                    transform: `scaleY(${lobeData.intensity / 40}) rotate(45deg)`,
                    left: '10%'
                  }}
                ></div>
                <div 
                  className="absolute top-4 w-48 h-40 bg-rose-500/20 transition-all duration-700"
                  style={{ 
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    opacity: lobeData.intensity / 100,
                    transform: `scaleY(${lobeData.intensity / 40}) rotate(-45deg)`,
                    right: '10%'
                  }}
                ></div>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-rose-400">
                Lobe Intensity: {lobeData.intensity}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hardware Configuration</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTransducerType('single')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${transducerType === 'single' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}
                    >
                      Single Crystal
                    </button>
                    <button 
                      onClick={() => setTransducerType('array')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${transducerType === 'array' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}
                    >
                      Array
                    </button>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lobe Reduction (Fixes)</p>
                  <div className="flex gap-2">
                    <button 
                      disabled={transducerType === 'single'}
                      onClick={() => setIsApodized(!isApodized)}
                      className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase transition-all ${isApodized && transducerType === 'array' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 disabled:opacity-20'}`}
                    >
                      Apodization
                    </button>
                    <button 
                      disabled={transducerType === 'single'}
                      onClick={() => setIsSubdiced(!isSubdiced)}
                      className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase transition-all ${isSubdiced && transducerType === 'array' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 disabled:opacity-20'}`}
                    >
                      Sub-dicing
                    </button>
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
                  <h4 className="text-xl font-black tracking-tight">The Lobe Logic</h4>
               </div>
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed">
                      <span className="text-white font-bold">Side Lobes</span> occur in single-crystal transducers. Energy "leaks" from the main beam.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed">
                      <span className="text-white font-bold">Grating Lobes</span> occur in array transducers. They create extra, weaker beams that place false anatomy in the image.
                    </p>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Definitions</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "Apodization varies voltage across crystals. Sub-dicing splits crystals into smaller parts."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20">
               <p className="text-xs font-bold text-indigo-100/80 leading-relaxed">
                 Both grating lobes and side lobes <span className="underline">degrade Lateral Resolution</span> because they widen the effective beam.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
