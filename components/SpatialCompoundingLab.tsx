
import React, { useState, useMemo } from 'react';
import { Layers, Zap, Target, Activity, Info, Sparkles, Filter, Grid } from 'lucide-react';

export const SpatialCompoundingLab: React.FC = () => {
  const [isCompounding, setIsCompounding] = useState(false);
  const [numAngles, setNumAngles] = useState(3);

  const compoundingData = useMemo(() => {
    return {
      frameRate: isCompounding ? (60 / (numAngles / 2)).toFixed(0) : '60',
      speckle: isCompounding ? 'Low' : 'High',
      shadowing: isCompounding ? 'Reduced' : 'Significant',
      resolution: isCompounding ? 'Superior' : 'Standard'
    };
  }, [isCompounding, numAngles]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Filter size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Grid className="text-cyan-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Spatial Compounding Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Multi-Angle Artifact Reduction Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Frame Rate</span>
              <span className={`text-xl font-black ${isCompounding ? 'text-amber-400' : 'text-emerald-400'}`}>
                {compoundingData.frameRate} Hz
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Speckle Noise</span>
              <span className="text-xl font-black text-cyan-400">{compoundingData.speckle}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Scan Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner p-8 flex items-center justify-center">
              
              <div className="relative w-64 h-48 bg-slate-900 rounded-3xl overflow-hidden border border-white/10">
                 {/* The "Organ" with a Stone */}
                 <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center">
                       <div className="w-8 h-8 bg-slate-200 rounded-full shadow-[0_0_20px_white] z-20"></div>
                    </div>
                 </div>

                 {/* Acoustic Shadowing */}
                 <div 
                   className="absolute top-1/2 left-1/2 -translate-x-1/2 w-8 h-32 bg-black transition-all duration-700 blur-md"
                   style={{ 
                     opacity: isCompounding ? 0.2 : 0.9,
                     clipPath: 'polygon(0% 0%, 100% 0%, 120% 100%, -20% 100%)'
                   }}
                 ></div>

                 {/* Scanning Beams */}
                 <div className="absolute inset-0 z-10 pointer-events-none">
                    {/* Main Straight Beam */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-cyan-500/20 animate-pulse"></div>
                    
                    {/* Compounding Angles */}
                    {isCompounding && [...Array(numAngles)].map((_, i) => {
                      const angle = (i - (numAngles - 1) / 2) * 15;
                      return (
                        <div 
                          key={i}
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-cyan-400/10 origin-top transition-all duration-1000"
                          style={{ transform: `rotate(${angle}deg)` }}
                        ></div>
                      );
                    })}
                 </div>

                 {/* Speckle Noise Overlay */}
                 <div 
                   className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isCompounding ? 'opacity-20' : 'opacity-80'}`}
                   style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")', backgroundSize: '4px' }}
                 ></div>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-cyan-400">
                Acoustic Field: {isCompounding ? 'Averaged' : 'Single Frame'}
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-6 rounded-full p-1 transition-all cursor-pointer ${isCompounding ? 'bg-indigo-600' : 'bg-slate-700'}`} onClick={() => setIsCompounding(!isCompounding)}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-all ${isCompounding ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Enable Compounding</span>
                  </div>
                  {isCompounding && (
                    <div className="flex items-center gap-4">
                       <span className="text-[8px] font-black text-slate-500 uppercase">Angle Count</span>
                       <div className="flex gap-2">
                          {[3, 5, 7].map(n => (
                            <button key={n} onClick={() => setNumAngles(n)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${numAngles === n ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}>{n}</button>
                          ))}
                       </div>
                    </div>
                  )}
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                     <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Shadow Fix</span>
                     <span className="text-xs font-bold text-indigo-400 uppercase">{compoundingData.shadowing}</span>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                     <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Spatial Res</span>
                     <span className="text-xs font-bold text-emerald-400 uppercase">{compoundingData.resolution}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-[2.5rem] border border-cyan-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-cyan-600 rounded-xl text-white shadow-lg">
                    <Layers size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Compounding Trade-off</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Spatial compounding uses <span className="text-white font-bold underline">electronic steering</span> to scan structures from multiple different angles.
               </p>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-cyan-400 uppercase">Image Quality ↑</span>
                    <span className="text-xs font-bold text-white">Compound Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase">Temporal Res ↓</span>
                    <span className="text-xs font-bold text-white">Frame Rate Drop</span>
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
                  Compounding is <span className="text-white">only possible</span> with Phased Array (electronic steering) transducers. Mechanical probes cannot do this.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
               <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                 "By seeing the stone from 3 angles, the shadow is filled in by the other beams, allowing the sonographer to see behind high-attenuators."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
