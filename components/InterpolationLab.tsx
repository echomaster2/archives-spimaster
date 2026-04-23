
import React, { useState, useMemo } from 'react';
import { Grid, Zap, Target, Activity, Info, Sparkles, Layers, Box, MoveRight } from 'lucide-react';

export const InterpolationLab: React.FC = () => {
  const [isInterpolated, setIsInterpolated] = useState(false);
  const [depth, setDepth] = useState(10); // cm

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Grid size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Grid className="text-cyan-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Fill-In Interpolation Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Sector Divergence & Prediction Simulator</p>
          </div>
          
          <button 
            onClick={() => setIsInterpolated(!isInterpolated)}
            className={`px-10 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all shadow-xl border-2 ${
              isInterpolated ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {isInterpolated ? 'Interpolation Active' : 'Show Raw Scan Lines'}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Sector Visualizer */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center">
              
              <div className="relative w-64 h-64 flex flex-col items-center">
                {/* The Diverging Sector Lines */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
                  {[...Array(7)].map((_, i) => {
                    const angle = (i - 3) * 15;
                    return (
                      <line 
                        key={i} 
                        x1="50" y1="0" 
                        x2={50 + 50 * Math.sin(angle * Math.PI / 180)} 
                        y2={50 * Math.cos(angle * Math.PI / 180)} 
                        stroke="#6366f1" 
                        strokeWidth="2"
                        className="transition-all duration-300"
                        opacity="0.6"
                      />
                    );
                  })}
                  
                  {/* The Interpolated Fill */}
                  {isInterpolated && [...Array(6)].map((_, i) => {
                    const angle = (i - 2.5) * 15;
                    return (
                      <line 
                        key={i} 
                        x1="50" y1="0" 
                        x2={50 + 50 * Math.sin(angle * Math.PI / 180)} 
                        y2={50 * Math.cos(angle * Math.PI / 180)} 
                        stroke="#10b981" 
                        strokeWidth="4"
                        strokeDasharray="2"
                        className="animate-in fade-in duration-1000"
                        opacity="0.3"
                      />
                    );
                  })}
                </svg>

                {/* Gap Markers at deep depth */}
                <div className="absolute bottom-4 w-full flex justify-between px-10">
                   {!isInterpolated ? (
                      <div className="flex gap-4 items-center animate-pulse">
                         <span className="text-[8px] font-black text-rose-500 uppercase bg-rose-950/50 px-2 py-0.5 rounded">Gaps in data</span>
                         <MoveRight size={10} className="text-rose-500" />
                      </div>
                   ) : (
                      <div className="flex gap-4 items-center">
                         <span className="text-[8px] font-black text-emerald-400 uppercase bg-emerald-950/50 px-2 py-0.5 rounded">Averaged data filling</span>
                      </div>
                   )}
                </div>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Mode: Sector Transducer (Deep Field)
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Imaging Depth</label>
                  <span className="text-xs font-black text-indigo-400">{depth} cm</span>
               </div>
               <input 
                  type="range" min="2" max="20" step="1"
                  value={depth}
                  onChange={(e) => setDepth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <p className="text-[8px] text-slate-500 font-bold italic">At deeper depths, the space between scan lines increases significantly.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The "Best Guess" Logic</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Fill-in interpolation is a <span className="text-white font-bold">pre-processing</span> technique. The computer uses the gray shades of neighboring scan lines to "guess" the data in the empty spaces.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <p className="text-[10px] font-bold text-slate-300">Goal: Improve image continuity</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                    <p className="text-[10px] font-bold text-slate-300">Goal: Visualize round borders better</p>
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
                  Interpolation increases <span className="text-white">line density</span> without reducing the <span className="text-white">frame rate</span>.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex gap-4 items-center">
               <Info size={16} className="text-indigo-300 shrink-0" />
               <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                 Interpolation is especially important for circular structures, as it helps define the curved boundaries that scan lines might miss.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
