
import React, { useState, useMemo } from 'react';
import { Activity, ShieldAlert, Zap, Thermometer, Info, Sparkles, BarChart3, AlertCircle } from 'lucide-react';

export const IntensityLab: React.FC = () => {
  const [power, setPower] = useState(50);
  const [dutyFactor, setDutyFactor] = useState(0.01); // 1%
  const [beamArea, setBeamArea] = useState(1.0); // cm^2

  const intensities = useMemo(() => {
    // Basic heuristics for SPI relationships
    // Peak is always highest. Average is lower.
    const sptp = (power / beamArea) * 2; 
    const sppa = sptp * 0.7;
    const spta = sppa * dutyFactor * 10; // Scaled for visualization
    const sata = spta * 0.5;

    return {
      sptp: sptp.toFixed(0),
      spta: spta.toFixed(1),
      sata: sata.toFixed(1),
      isRisk: spta > 100 // Visual risk threshold
    };
  }, [power, dutyFactor, beamArea]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Activity size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-rose-500" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Intensity & Power Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Spatial vs Temporal Dynamics</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Highest (SPTP)</span>
              <span className="text-xl font-black text-rose-500">{intensities.sptp} mW/cm²</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Registry Key (SPTA)</span>
              <span className="text-xl font-black text-emerald-400">{intensities.spta} mW/cm²</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Visual Intensity Comparison */}
            <div className="bg-slate-950 rounded-[2.5rem] h-64 relative overflow-hidden border-4 border-slate-800 shadow-inner flex items-end p-12 gap-8">
              <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 group">
                 <div className="w-full bg-rose-500/20 border border-rose-500/40 rounded-t-xl transition-all duration-500" style={{ height: '100%' }}></div>
                 <span className="text-[10px] font-black uppercase text-rose-500">SPTP</span>
                 <div className="absolute top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[8px] font-bold">Spatial Peak, Temporal Peak</div>
              </div>
              <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 group">
                 <div className="w-full bg-orange-500/20 border border-orange-500/40 rounded-t-xl transition-all duration-500" style={{ height: '70%' }}></div>
                 <span className="text-[10px] font-black uppercase text-orange-500">SPPA</span>
              </div>
              <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 group">
                 <div className="w-full bg-emerald-500/20 border border-emerald-500/40 rounded-t-xl transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]" style={{ height: `${Math.max(10, (parseFloat(intensities.spta) / 2))}%` }}></div>
                 <span className="text-[10px] font-black uppercase text-emerald-500">SPTA</span>
                 <div className="absolute top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[8px] font-bold">Bioeffects Primary Metric</div>
              </div>
              <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 group">
                 <div className="w-full bg-slate-700/20 border border-slate-700/40 rounded-t-xl transition-all duration-500" style={{ height: `${Math.max(5, (parseFloat(intensities.sata) / 2))}%` }}></div>
                 <span className="text-[10px] font-black uppercase text-slate-500">SATA</span>
              </div>
              
              <div className="absolute top-4 right-6 flex items-center gap-2">
                 <Thermometer size={14} className={intensities.isRisk ? "text-rose-500 animate-pulse" : "text-slate-600"} />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Thermal Risk Indicator</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Output Power</label>
                   <span className="text-xs font-black">{power} W</span>
                </div>
                <input 
                  type="range" min="10" max="200" step="10"
                  value={power}
                  onChange={(e) => setPower(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duty Factor</label>
                   <span className="text-xs font-black">{dutyFactor * 100}%</span>
                </div>
                <input 
                  type="range" min="0.001" max="0.1" step="0.001"
                  value={dutyFactor}
                  onChange={(e) => setDutyFactor(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldAlert size={40} /></div>
               <h4 className="text-lg font-black mb-4 tracking-tight">The SPTA Rule</h4>
               <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">
                 Spatial Peak Temporal Average (SPTA) is the most relevant intensity with respect to <span className="text-rose-400 font-bold underline">tissue heating</span>.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex gap-3">
                  <AlertCircle size={18} className="text-amber-500 shrink-0"/>
                  <p className="text-[10px] font-bold text-slate-300 leading-tight">Registry Rank: SPTP (highest) &gt; SATP &gt; SPTA &gt; SATA (lowest)</p>
               </div>
            </div>

            <div className="bg-emerald-600 rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-500/20 flex gap-4 items-center">
               <div className="p-3 bg-white/20 rounded-2xl">
                 <Zap className="text-white" size={24} />
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Registry Tip</h4>
                  <p className="text-xs font-bold text-emerald-50 leading-relaxed italic">
                    "Intensities describe the concentration of energy. Remember: Units are always <span className="underline">Watts / Area</span>."
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
