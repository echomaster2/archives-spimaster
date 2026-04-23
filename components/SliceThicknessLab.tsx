
import React, { useState, useMemo } from 'react';
import { Layers, Zap, Target, Activity, Info, Sparkles, Box, Maximize2 } from 'lucide-react';

export const SliceThicknessLab: React.FC = () => {
  const [beamThickness, setBeamThickness] = useState(5); // mm
  const [targetDepth, setTargetDepth] = useState(4); // cm
  const [transducerType, setTransducerType] = useState<'standard' | '1.5d'>('standard');

  const sliceData = useMemo(() => {
    // 1.5D arrays have much thinner slices due to electronic focusing in the elevation plane
    const effectiveThickness = transducerType === '1.5d' ? beamThickness * 0.3 : beamThickness;
    const isArtifact = effectiveThickness > 3.0;
    
    return {
      thickness: effectiveThickness.toFixed(1),
      status: isArtifact ? 'Artifact Alert: Cystic Fill-in' : 'Clear Anechoic Window',
      resolution: transducerType === '1.5d' ? 'Superior Elevational' : 'Standard Elevational'
    };
  }, [beamThickness, transducerType]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Box size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Layers className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Slice Thickness Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Elevational Resolution & 3rd Dimension Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Beam Thickness</span>
              <span className={`text-xl font-black ${parseFloat(sliceData.thickness) > 3 ? 'text-rose-500' : 'text-emerald-400'}`}>
                {sliceData.thickness} mm
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Image Integrity</span>
              <span className="text-xl font-black text-indigo-400 uppercase tracking-tighter text-xs">{sliceData.status}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* 3D Beam Visualization */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner p-8 flex items-center justify-center perspective-1000">
              
              {/* The Cyst (Target) */}
              <div className="absolute w-32 h-32 rounded-full border-4 border-white/10 bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest absolute top-4">Fluid Filled Cyst</div>
                
                {/* Debris Fill-in Artifact */}
                <div 
                  className="w-full bg-slate-400/20 transition-all duration-700 blur-sm"
                  style={{ height: `${Math.max(0, (parseFloat(sliceData.thickness) - 1) * 20)}%` }}
                ></div>
              </div>

              {/* Ultrasound Beam (Side View / Slice) */}
              <div 
                className="absolute w-40 h-full bg-indigo-500/20 transition-all duration-700 border-x-2 border-indigo-400/30"
                style={{ 
                  width: `${parseFloat(sliceData.thickness) * 20}px`,
                  clipPath: 'polygon(10% 0%, 90% 0%, 55% 50%, 90% 100%, 10% 100%, 45% 50%)',
                  transform: 'rotateX(45deg)'
                }}
              ></div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Acoustic Dimension: Z-Axis
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hardware Selection</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTransducerType('standard')}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${transducerType === 'standard' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}
                    >
                      1D Array
                    </button>
                    <button 
                      onClick={() => setTransducerType('1.5d')}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${transducerType === '1.5d' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}
                    >
                      1.5D Array
                    </button>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fixed Elevation Focus</label>
                    <span className="text-xs font-black">{beamThickness}mm at Face</span>
                  </div>
                  <input 
                    type="range" min="2" max="8" step="0.5"
                    value={beamThickness}
                    onChange={(e) => setBeamThickness(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Forgotten Resolution</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Elevational resolution (Slice Thickness) is determined by the <span className="text-white font-bold underline">thickness</span> of the ultrasound beam. If the beam is wider than the structure, adjacent tissues bleed into the image.
               </p>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase">Thick Beam</span>
                    <span className="text-xs font-bold text-white">False Debris (Fill-in)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-400 uppercase">Thin Beam</span>
                    <span className="text-xs font-bold text-white">True Anechoic Cyst</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note: 1.5D Arrays</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "1.5D arrays have multiple rows of elements allowing for electronic focusing in the elevational plane, creating a thinner slice."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
