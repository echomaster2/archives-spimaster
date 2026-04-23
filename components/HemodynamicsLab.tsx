
import React, { useState, useMemo } from 'react';
import { Droplet, TrendingUp, Zap, Info, Activity, Wind } from 'lucide-react';

export const HemodynamicsLab: React.FC = () => {
  const [radius, setRadius] = useState(1.0); // Normal vessel radius normalized to 1.0
  const [inflowVelocity, setInflowVelocity] = useState(50); // cm/s

  const hemodynamics = useMemo(() => {
    // Continuity Equation: A1 * V1 = A2 * V2 => (r1^2) * V1 = (r2^2) * V2
    // V2 = V1 * (r1^2 / r2^2)
    const velocityInStenosis = inflowVelocity * (1 / Math.pow(radius, 2));
    
    // Bernoulli's simplified (ultrasound): ΔP = 4 * V^2
    const pressureGradient = 4 * Math.pow(velocityInStenosis / 100, 2); // Velocity converted to m/s
    
    const stenosisPercent = Math.max(0, Math.round((1 - radius) * 100));

    return {
      v2: velocityInStenosis.toFixed(0),
      gradient: pressureGradient.toFixed(1),
      stenosis: stenosisPercent,
      isAliasing: velocityInStenosis > 200 // Threshold for visual "aliasing"
    };
  }, [radius, inflowVelocity]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-bottom-6 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Droplet size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-rose-500" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Flow Dynamics Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Stenosis & Bernoulli Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Stenosis</span>
              <span className={`text-xl font-black ${hemodynamics.stenosis > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {hemodynamics.stenosis}%
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Max Velocity</span>
              <span className="text-xl font-black">{hemodynamics.v2} cm/s</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Vessel Simulation */}
            <div className="bg-slate-800 rounded-[2.5rem] h-64 relative overflow-hidden border-4 border-slate-700 shadow-inner group">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Vessel Walls */}
                <div 
                  className="w-full h-32 bg-rose-950/30 relative flex items-center transition-all duration-700"
                  style={{ transform: `scaleY(${radius})` }}
                >
                  <div className="absolute top-0 w-full h-2 bg-rose-500/20"></div>
                  <div className="absolute bottom-0 w-full h-2 bg-rose-500/20"></div>
                  
                  {/* Blood Particles (simulated) */}
                  <div className="flex w-full overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i}
                        className={`h-2 w-4 rounded-full mx-2 shrink-0 transition-all duration-100 ${
                          hemodynamics.isAliasing ? 'bg-cyan-400 shadow-[0_0_10px_cyan]' : 'bg-rose-500'
                        }`}
                        style={{
                          animation: `slide ${Math.max(0.2, 2 / (radius * radius))}s linear infinite`,
                          animationDelay: `${i * 0.1}s`,
                          opacity: 0.6
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Aliasing Indicator */}
              {hemodynamics.isAliasing && (
                <div className="absolute top-4 left-4 bg-cyan-500/90 text-slate-900 px-3 py-1 rounded-full text-[9px] font-black uppercase animate-pulse">
                  Spectral Aliasing Detected
                </div>
              )}

              <style>{`
                @keyframes slide {
                  from { transform: translateX(-100%); }
                  to { transform: translateX(400%); }
                }
              `}</style>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inflow V1</label>
                   <span className="text-xs font-black">{inflowVelocity} cm/s</span>
                </div>
                <input 
                  type="range" min="10" max="100" step="5"
                  value={inflowVelocity}
                  onChange={(e) => setInflowVelocity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lumen Radius</label>
                   <span className="text-xs font-black">{radius.toFixed(2)}r</span>
                </div>
                <input 
                  type="range" min="0.2" max="1.5" step="0.05"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-rose-500/10 to-transparent rounded-[2.5rem] border border-rose-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-rose-500 rounded-xl text-white shadow-lg">
                    <TrendingUp size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Bernoulli Impact</h4>
               </div>
               <div className="space-y-6">
                  <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Pressure Gradient</span>
                    <span className="text-2xl font-black text-rose-500">{hemodynamics.gradient} mmHg</span>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                     <p className="text-[10px] font-black text-slate-500 uppercase mb-3 flex items-center gap-2">
                        <Zap size={12} className="text-amber-500"/> Registry Formula
                     </p>
                     <p className="text-lg font-black tracking-widest italic text-center text-white/90">ΔP = 4 * V²</p>
                     <p className="text-[9px] text-slate-500 mt-4 leading-relaxed font-bold italic">
                       "As velocity increases through a stenosis, the pressure gradient increases exponentially. Remember this for carotid and valve registry questions!"
                     </p>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-indigo-600 rounded-2xl">
                <Info size={24} />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Poiseuille vs Bernoulli</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  While Bernoulli describes pressure/velocity at a point, Poiseuille describes flow through the entire system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
