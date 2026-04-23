
import React, { useState, useMemo } from 'react';
import { Activity, Zap, Layers, Info, Sparkles, Clock, MoveDown, BarChart3 } from 'lucide-react';

export const PulsedWaveLab: React.FC = () => {
  const [depth, setDepth] = useState(5); // cm
  const [cycles, setCycles] = useState(3);
  const transmitFreq = 5; // MHz

  const pwParams = useMemo(() => {
    // PRP = 13us * depth
    const prp = 13 * depth; // microseconds
    const prf = (1 / (prp / 1000000)) / 1000; // kHz
    
    // Pulse Duration = cycles * period. fo = 5MHz, T = 0.2us
    const period = 1 / transmitFreq; // 0.2us
    const pd = cycles * period;
    
    const dutyFactor = (pd / prp) * 100;
    
    return {
      prp: prp.toFixed(0),
      prf: prf.toFixed(1),
      pd: pd.toFixed(1),
      df: dutyFactor.toFixed(3)
    };
  }, [depth, cycles]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-left duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Clock size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-emerald-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Pulsed Wave Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Temporal Parameter Dynamics</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">PRF</span>
              <span className="text-xl font-black text-emerald-400">{pwParams.prf} kHz</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Duty Factor</span>
              <span className="text-xl font-black text-indigo-400">{pwParams.df}%</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            {/* Visual Pulse Train */}
            <div className="bg-slate-950 rounded-[2.5rem] h-64 relative overflow-hidden border-4 border-slate-800 shadow-inner group">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, #ffffff11 1px, transparent 1px)', backgroundSize: '40px 100%' }}></div>
              
              <div className="absolute inset-0 flex items-center px-10">
                <div className="flex items-end w-full h-32 border-b border-white/10 gap-1 relative">
                  {/* Pulses */}
                  {[...Array(5)].map((_, i) => (
                    <React.Fragment key={i}>
                      {/* Transmit Pulse */}
                      <div 
                        className="bg-indigo-500 rounded-t shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-500"
                        style={{ width: `${cycles * 2}px`, height: '60px' }}
                      />
                      {/* Listening Time (Gap) */}
                      <div 
                        className="transition-all duration-500 h-px bg-transparent"
                        style={{ width: `${depth * 15}px` }}
                      />
                    </React.Fragment>
                  ))}

                  {/* Measurements */}
                  <div className="absolute -bottom-6 left-0 flex items-center gap-2">
                    <div className="w-8 h-1 bg-indigo-500 rounded-full" />
                    <span className="text-[7px] font-black uppercase text-indigo-400">Pulse Duration (PD)</span>
                  </div>
                  <div className="absolute -bottom-10 left-0 flex items-center gap-2">
                    <div className="w-24 h-1 bg-emerald-500 rounded-full" />
                    <span className="text-[7px] font-black uppercase text-emerald-400">PRP (Depth Dependent)</span>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 left-6 flex items-center gap-2">
                <BarChart3 size={14} className="text-indigo-400" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Pulse-Echo Chronometer</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Imaging Depth</label>
                   <span className="text-xs font-black text-emerald-400">{depth} cm</span>
                </div>
                <input 
                  type="range" min="1" max="15" step="1"
                  value={depth}
                  onChange={(e) => setDepth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cycles/Pulse</label>
                   <span className="text-xs font-black text-indigo-400">{cycles} Cycles</span>
                </div>
                <input 
                  type="range" min="2" max="6" step="1"
                  value={cycles}
                  onChange={(e) => setCycles(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
               <h4 className="text-lg font-black mb-6 tracking-tight flex items-center gap-2">
                 <Clock size={18} className="text-indigo-400"/> Temporal Stats
               </h4>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Pulse Rep Period (PRP)</span>
                    <span className="text-sm font-black text-emerald-400">{pwParams.prp} µs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Pulse Duration (PD)</span>
                    <span className="text-sm font-black text-indigo-400">{pwParams.pd} µs</span>
                  </div>
                  <div className="h-px bg-white/5 w-full" />
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400 leading-relaxed italic">
                    <MoveDown size={20} className="text-indigo-600 shrink-0" />
                    "Increasing depth lengthens the LISTENING TIME, which increases PRP and decreases PRF."
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2.5rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Zap size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Shortcut</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  PRP and PRF are <span className="text-white font-bold">Reciprocals</span>. Duty Factor for imaging is always &lt; 1%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
