
import React, { useState, useMemo } from 'react';
import { TrendingUp, Zap, Target, Activity, Info, Sparkles, Droplet, Layers } from 'lucide-react';

export const ColorDopplerLab: React.FC = () => {
  const [scale, setScale] = useState(2500); // PRF in Hz
  const [colorGain, setColorGain] = useState(50);
  const [ensembleLength, setEnsembleLength] = useState(10); // Packet size
  const actualVelocity = 3500; // Peak velocity in cm/s (simulated)

  const colorData = useMemo(() => {
    const nyquist = scale / 2;
    const isAliasing = actualVelocity > nyquist;
    const frameRateImpact = 100 / (ensembleLength / 3);
    
    return {
      nyquist: nyquist.toFixed(0),
      isAliasing,
      status: colorGain > 80 ? 'Color Bleeding' : colorGain < 20 ? 'Weak Sensitivity' : 'Optimal',
      fr: frameRateImpact.toFixed(0)
    };
  }, [scale, colorGain, ensembleLength]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Droplet size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Droplet className="text-blue-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Color Flow Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Ensemble Length & Aliasing Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Nyquist Limit</span>
              <span className={`text-xl font-black ${colorData.isAliasing ? 'text-rose-500 animate-pulse' : 'text-blue-400'}`}>
                {colorData.nyquist} Hz
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Color Sensitivity</span>
              <span className="text-xl font-black text-indigo-400">{colorData.status}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Color Flow Visualization */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex flex-col items-center justify-center p-8">
              
              {/* The "Vessel" */}
              <div className="w-full h-24 bg-slate-950 rounded-2xl relative overflow-hidden flex items-center border border-white/5">
                
                {/* Background flow texture */}
                <div className="absolute inset-0 opacity-10 animate-flow-pulse" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 10px)' }}></div>

                {/* The Color Box */}
                <div 
                  className="w-1/2 h-20 bg-blue-500/20 border-2 border-white/20 mx-auto rounded-lg transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    backgroundColor: colorData.isAliasing ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)',
                    boxShadow: `inset 0 0 40px ${colorData.isAliasing ? '#ef4444' : '#3b82f6'}`,
                    opacity: colorGain / 100
                  }}
                >
                  {/* Flow Particles */}
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i}
                      className={`absolute h-full w-4 transition-all duration-500 ${colorData.isAliasing ? 'bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500' : 'bg-blue-400/30'}`}
                      style={{ 
                        left: `${(i * 15) % 100}%`,
                        opacity: colorGain / 100
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {colorData.isAliasing && (
                <div className="absolute top-4 right-6 bg-rose-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2 animate-bounce">
                  Aliasing: Wrap-around detected
                </div>
              )}

              <div className="absolute bottom-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Frame Rate: {colorData.fr} Hz
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Scale (PRF)</label>
                   <span className="text-xs font-black text-blue-400">{scale} Hz</span>
                </div>
                <input 
                  type="range" min="1000" max="8000" step="250"
                  value={scale}
                  onChange={(e) => setScale(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Color Gain</label>
                   <span className="text-xs font-black text-indigo-400">{colorGain}%</span>
                </div>
                <input 
                  type="range" min="0" max="100"
                  value={colorGain}
                  onChange={(e) => setColorGain(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Ensemble Length (Packet Size)</label>
                 <span className="text-xs font-black text-emerald-400">{ensembleLength} pulses</span>
              </div>
              <input 
                type="range" min="3" max="25" step="1"
                value={ensembleLength}
                onChange={(e) => setEnsembleLength(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-blue-500/10 to-transparent rounded-[2.5rem] border border-blue-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg">
                    <Droplet size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Ensemble Trade-off</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Color Doppler uses <span className="text-blue-400 font-bold">multiple pulses</span> per scan line. Larger packets (ensembles) have higher sensitivity but <span className="text-rose-400 font-black">destroy</span> temporal resolution.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-emerald-400 uppercase">Higher Ensemble</span>
                    <span className="text-xs font-bold text-white">Better Velocity Accuracy</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase">Higher Ensemble</span>
                    <span className="text-xs font-bold text-white">Lower Frame Rate</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note: Ghosting</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  Ghosting or clutter artifacts are bleeding of color outside the vessel. <span className="text-white">Fix: Increase the wall filter.</span>
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20">
               <p className="text-xs font-bold text-indigo-100/80 leading-relaxed">
                 Autocorrelation is the technique used to process Color Doppler signals. It is <span className="underline">faster</span> but <span className="underline">less accurate</span> than FFT.
               </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes flow-pulse {
          from { transform: translateX(-10%); }
          to { transform: translateX(10%); }
        }
        .animate-flow-pulse {
          animation: flow-pulse 2s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};
