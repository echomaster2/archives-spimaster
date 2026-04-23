
import React, { useState, useMemo } from 'react';
import { Shield, Zap, Target, Activity, Info, Sparkles, Thermometer, MoveHorizontal, Database } from 'lucide-react';

export const HydrophoneLab: React.FC = () => {
  const [hydrophonePos, setHydrophonePos] = useState(50); // % across the beam
  const [beamIntensity, setBeamIntensity] = useState(70);

  const measurement = useMemo(() => {
    // Beam profile: Gaussian-ish shape
    const offset = Math.abs(hydrophonePos - 50);
    const pressure = beamIntensity * Math.exp(-Math.pow(offset / 15, 2));
    
    return {
      pressure: pressure.toFixed(1),
      isPeak: offset < 5,
      status: offset < 5 ? 'Center Beam (Peak)' : offset > 30 ? 'Off-axis (Edge)' : 'Mid-Beam'
    };
  }, [hydrophonePos, beamIntensity]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Shield size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Hydrophone Measurement Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Acoustic Pressure & Bioeffects Research</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Measured Pressure</span>
              <span className={`text-xl font-black ${measurement.isPeak ? 'text-amber-400' : 'text-indigo-400'}`}>
                {measurement.pressure} MPa
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Location</span>
              <span className="text-xl font-black text-emerald-400 uppercase tracking-tighter text-xs">{measurement.status}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Beam & Hydrophone */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              
              {/* The Ultrasound Beam (Lateral View) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-xl"></div>
                 <div className="w-1 h-full bg-indigo-400/40 shadow-[0_0_40px_rgba(99,102,241,0.5)]"></div>
              </div>

              {/* The Hydrophone Probe */}
              <div 
                className="absolute w-2 h-40 bg-gradient-to-b from-slate-400 to-slate-600 rounded-full border-x border-white/20 transition-all duration-300 z-30 flex flex-col items-center"
                style={{ left: `${hydrophonePos}%`, top: '10%' }}
              >
                 <div className="w-4 h-4 bg-indigo-500 rounded-full -mt-2 border-2 border-white shadow-[0_0_10px_indigo]"></div>
                 <div className="mt-40 text-[8px] font-black text-slate-500 uppercase rotate-90 whitespace-nowrap">Micro-Transducer</div>
              </div>

              {/* Oscilloscope Mini-View */}
              <div className="absolute bottom-6 right-6 w-32 h-20 bg-black/80 rounded-xl border border-white/10 p-2 overflow-hidden">
                 <svg viewBox="0 0 100 50" className="w-full h-full">
                    <polyline 
                      fill="none" 
                      stroke="#818cf8" 
                      strokeWidth="1"
                      points={(() => {
                        let p = "";
                        for(let x=0; x<100; x++) {
                          p += `${x},${25 + Math.sin(x*0.5) * (parseFloat(measurement.pressure)/4)} `;
                        }
                        return p;
                      })()}
                    />
                 </svg>
                 <span className="text-[6px] font-black text-slate-500 uppercase absolute top-1 left-2 tracking-tighter">Measured Pulse</span>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Acoustic Field Map
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hydrophone Position (Lateral Scan)</label>
                    <span className="text-xs font-black">{hydrophonePos}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="90" step="1"
                    value={hydrophonePos}
                    onChange={(e) => setHydrophonePos(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Beam Output Power</label>
                    <span className="text-xs font-black text-amber-400">{beamIntensity}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" step="5"
                    value={beamIntensity}
                    onChange={(e) => setBeamIntensity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
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
                  <h4 className="text-xl font-black tracking-tight">Hydrophone Capability</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 A hydrophone (or micro-probe) is a tiny transducer that measures the <span className="text-white font-bold">acoustic pressure</span> at specific points in the beam.
               </p>
               <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase border-b border-white/5 pb-2">Measured Parameters:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-[9px] font-bold text-indigo-300">Beam Shape</span>
                    <span className="text-[9px] font-bold text-indigo-300">Period / Freq</span>
                    <span className="text-[9px] font-bold text-indigo-300">PRP / PRF</span>
                    <span className="text-[9px] font-bold text-indigo-300">Pulse Duration</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note: Bioeffects</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Hydrophones are essential for determining the <span className="text-white">Mechanical Index (MI)</span> and <span className="text-white">Thermal Index (TI)</span> output of clinical machines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
