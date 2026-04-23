
import React, { useState, useMemo } from 'react';
import { Shield, Thermometer, Zap, AlertTriangle, Info, Sparkles, Activity, Heart } from 'lucide-react';

export const SafetyLab: React.FC = () => {
  const [outputPower, setOutputPower] = useState(50);
  const [isDopplerMode, setIsDopplerMode] = useState(false);
  const [exposureTime, setExposureTime] = useState(5); // minutes

  const safetyMetrics = useMemo(() => {
    // Basic heuristics for registry concepts
    // Power increases both MI and TI
    // Doppler uses higher energy (higher TI)
    const mi = (outputPower / 100) * 1.9; // MI limit is 1.9
    const baseTI = (outputPower / 100) * 1.5;
    const ti = isDopplerMode ? baseTI * 2.5 : baseTI;
    
    return {
      mi: mi.toFixed(2),
      ti: ti.toFixed(2),
      isRiskMI: mi > 1.0,
      isRiskTI: ti > 1.5
    };
  }, [outputPower, isDopplerMode]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-bottom-6 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Shield size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-emerald-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Bioeffects Safety Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Safety Indices & ALARA Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Mechanical Index (MI)</span>
              <span className={`text-xl font-black ${safetyMetrics.isRiskMI ? 'text-amber-500' : 'text-emerald-400'}`}>
                {safetyMetrics.mi}
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Thermal Index (TI)</span>
              <span className={`text-xl font-black ${safetyMetrics.isRiskTI ? 'text-rose-500' : 'text-emerald-400'}`}>
                {safetyMetrics.ti}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Tissue Simulation */}
            <div className="bg-slate-800 rounded-[2.5rem] h-64 relative overflow-hidden border-4 border-slate-700 shadow-inner group">
              <div className="absolute inset-0 flex items-center justify-center">
                 {/* Tissue Model */}
                 <div className="relative w-48 h-48 rounded-full bg-rose-950/20 border-2 border-white/5 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Heart size={80} className={`transition-all duration-1000 ${safetyMetrics.isRiskTI ? 'text-rose-500 animate-pulse scale-110' : 'text-rose-900/30'}`}/>
                    </div>
                    {/* Heating Overlay */}
                    <div 
                      className="absolute inset-0 bg-rose-600 transition-all duration-1000 mix-blend-overlay"
                      style={{ opacity: (parseFloat(safetyMetrics.ti) / 4) }}
                    ></div>
                    {/* Cavitation (MI) Particles */}
                    {[...Array(15)].map((_, i) => (
                      <div 
                        key={i}
                        className={`absolute w-1 h-1 bg-cyan-400 rounded-full transition-all duration-300 ${safetyMetrics.isRiskMI ? 'opacity-60 scale-150' : 'opacity-0'}`}
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animation: safetyMetrics.isRiskMI ? `pulse 0.5s infinite ${Math.random()}s` : 'none'
                        }}
                      ></div>
                    ))}
                 </div>
              </div>

              {safetyMetrics.isRiskTI && (
                <div className="absolute top-4 left-4 bg-rose-500/90 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2">
                  <Thermometer size={10}/> Thermal Risk High
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Output Power</label>
                   <span className="text-xs font-black">{outputPower}%</span>
                </div>
                <input 
                  type="range" min="1" max="100"
                  value={outputPower}
                  onChange={(e) => setOutputPower(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
              <button 
                onClick={() => setIsDopplerMode(!isDopplerMode)}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                  isDopplerMode ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <Activity size={20}/>
                <span className="text-[10px] font-black uppercase">Spectral Doppler</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-[2.5rem] border border-emerald-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-emerald-500 rounded-xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">ALARA Principle</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 As Low As Reasonably Achievable. Minimize output power and exposure time to reduce risk while obtaining diagnostic quality.
               </p>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-emerald-400 uppercase mb-3 flex items-center gap-2">
                     <AlertTriangle size={12} className="text-amber-500"/> Sonographer Action
                  </p>
                  <p className="text-xs font-bold leading-relaxed text-white/90">
                    "If the image is too dark, first increase the receiver GAIN. If it's still dark, increase OUTPUT POWER."
                  </p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Info size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Registry Mechanism</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  TI represents potential for <span className="text-rose-400 font-bold">heating</span>. MI represents potential for <span className="text-cyan-400 font-bold">cavitation</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
