
import React, { useState, useMemo } from 'react';
import { Activity, Zap, Layers, Info, Sparkles, Filter, Wind, MoveRight } from 'lucide-react';

export const PersistenceLab: React.FC = () => {
  const [persistence, setPersistence] = useState(30); // 0-100%
  const [motionSpeed, setMotionSpeed] = useState(50); // %

  const persistenceData = useMemo(() => {
    return {
      noiseReduction: persistence > 60 ? 'Significant' : persistence > 20 ? 'Moderate' : 'Low',
      motionBlur: persistence > 70 ? 'Extreme' : persistence > 40 ? 'Noticeable' : 'Minimal',
      status: persistence > 70 ? 'Laggy Image' : 'Smooth Flow',
      label: persistence > 50 ? 'High Persistence' : 'Low Persistence'
    };
  }, [persistence]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Filter size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Wind className="text-blue-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Persistence Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Temporal Smoothing & Frame Averaging</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Speckle Reduction</span>
              <span className="text-xl font-black text-emerald-400">{persistenceData.noiseReduction}</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Motion Clarity</span>
              <span className={`text-xl font-black ${persistence > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {persistence < 60 ? 'Sharp' : 'Blurred'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Frame Averaging Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
              
              <div className="relative w-full h-full flex items-center justify-center">
                 {/* The Moving Object */}
                 <div className="relative w-full h-32 flex items-center">
                    {/* Trailing frames (Persistence visual) */}
                    {[...Array(5)].map((_, i) => {
                      const trailOpacity = (persistence / 100) * (1 - (i * 0.2));
                      if (trailOpacity <= 0) return null;
                      return (
                        <div 
                          key={i}
                          className="absolute w-12 h-12 bg-blue-500/40 rounded-xl transition-all duration-100"
                          style={{ 
                            left: `${(50 + 30 * Math.sin(Date.now() / 500 - (i * (persistence/1000))))}%`,
                            opacity: trailOpacity,
                            filter: 'blur(2px)'
                          }}
                        ></div>
                      );
                    })}
                    
                    {/* The Active Frame Object */}
                    <div 
                      className="absolute w-12 h-12 bg-white rounded-xl shadow-[0_0_20px_white] z-10 transition-all duration-100"
                      style={{ 
                        left: `${(50 + 30 * Math.sin(Date.now() / 500))}%`
                      }}
                    >
                       <div className="absolute inset-0 bg-blue-600 rounded-xl mix-blend-overlay"></div>
                    </div>
                 </div>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-blue-400">
                Averaging Map: {persistenceData.label}
              </div>
              
              <div className="absolute bottom-4 right-6 text-[8px] font-bold text-slate-600 uppercase">
                {persistenceData.status}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                       <Layers size={14} className="text-blue-400"/> Persistence Level
                    </label>
                    <span className="text-xs font-black text-blue-400">{persistence}%</span>
                 </div>
                 <input 
                    type="range" min="0" max="95" step="5"
                    value={persistence}
                    onChange={(e) => setPersistence(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
                    <span>Raw (No Average)</span>
                    <span>Smooth (Heavy Average)</span>
                  </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-blue-500/10 to-transparent rounded-[2.5rem] border border-blue-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Temporal Averaging</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Persistence (also called <span className="text-white font-bold">Temporal Compounding</span>) provides a smoother image by averaging previous frames with the current one.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-emerald-400">PRO:</span>
                    <span className="text-slate-200">Significantly reduces noise & speckle</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-rose-400">CON:</span>
                    <span className="text-slate-200">Causes motion blur on moving targets</span>
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
                  Persistence is a <span className="text-white">Pre-processing</span> function. It is best used for slow-moving structures like the liver or thyroid.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex gap-4 items-center">
               <Info size={16} className="text-indigo-300 shrink-0" />
               <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                 Don't confuse Spatial Compounding (multiple angles) with Temporal Compounding (multiple times/frames).
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
