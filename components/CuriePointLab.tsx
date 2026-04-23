
import React, { useState, useMemo } from 'react';
import { Thermometer, Zap, Target, Activity, Info, Sparkles, ShieldAlert, RotateCcw } from 'lucide-react';

export const CuriePointLab: React.FC = () => {
  const [temp, setTemp] = useState(25); // Celsius
  const CURIE_POINT = 360;

  const crystalData = useMemo(() => {
    const isDepolarized = temp >= CURIE_POINT;
    const efficiency = isDepolarized ? 0 : Math.max(0, 100 - (temp / CURIE_POINT) * 20);
    
    return {
      isDepolarized,
      efficiency: efficiency.toFixed(0),
      status: isDepolarized ? 'Permanently Damaged' : temp > 200 ? 'Warning: High Heat' : 'Operational',
      color: isDepolarized ? 'text-rose-500' : temp > 200 ? 'text-amber-400' : 'text-emerald-400'
    };
  }, [temp]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Thermometer size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="text-rose-500" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Curie Point Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Depolarization & Sterilization Safety</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Temperature</span>
              <span className={`text-xl font-black ${temp > CURIE_POINT ? 'text-rose-500' : 'text-white'}`}>
                {temp}°C
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Piezo Efficiency</span>
              <span className={`text-xl font-black ${crystalData.color}`}>{crystalData.efficiency}%</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Crystal Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              <div className="grid grid-cols-4 gap-4">
                 {[...Array(16)].map((_, i) => (
                   <div 
                     key={i}
                     className={`w-8 h-8 rounded-lg transition-all duration-1000 relative flex items-center justify-center ${
                       crystalData.isDepolarized ? 'bg-slate-700 opacity-20' : 'bg-indigo-500/40 border-2 border-indigo-400'
                     }`}
                     style={{ 
                       transform: crystalData.isDepolarized 
                         ? `rotate(${Math.random() * 360}deg)` 
                         : 'rotate(0deg)',
                       boxShadow: crystalData.isDepolarized ? 'none' : '0 0 15px rgba(99,102,241,0.3)'
                     }}
                   >
                      {!crystalData.isDepolarized && <Zap size={14} className="text-white animate-pulse" />}
                      {/* Dipole visual */}
                      <div className={`absolute inset-0 flex flex-col justify-between p-1 opacity-40 ${crystalData.isDepolarized ? 'hidden' : ''}`}>
                         <div className="w-full h-1 bg-red-400 rounded-full"></div>
                         <div className="w-full h-1 bg-blue-400 rounded-full"></div>
                      </div>
                   </div>
                 ))}
              </div>

              {crystalData.isDepolarized && (
                <div className="absolute inset-0 bg-rose-950/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4">
                   <ShieldAlert size={48} className="text-rose-500 animate-bounce" />
                   <div className="text-center">
                      <p className="text-xl font-black text-white uppercase tracking-tighter italic">Permanent Depolarization</p>
                      <p className="text-[10px] font-bold text-rose-400 uppercase mt-1">Crystals non-functional</p>
                   </div>
                   <button 
                    onClick={() => setTemp(25)}
                    className="mt-4 px-6 py-2 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                   >
                     <RotateCcw size={12}/> Replace Crystal (Reset)
                   </button>
                </div>
              )}

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                PZT Molecular Alignment
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                    <Thermometer size={14} /> External Heat Source
                  </label>
                  <span className="text-xs font-black">{temp}°C</span>
               </div>
               <input 
                  type="range" min="20" max="500" step="5"
                  value={temp}
                  onChange={(e) => setTemp(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
                   <span>Room Temp</span>
                   <span className="text-rose-500">Curie Point (360°C)</span>
                   <span>Autoclave Range</span>
                </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-rose-600 rounded-xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Curie Rule</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Piezoelectric materials are created by <span className="text-white">Polarization</span> (heating while in a strong magnetic field). If the crystal is later heated above the <span className="text-rose-400 font-black">Curie Point</span>, its properties are lost forever.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Registry Keyword</p>
                  <p className="text-lg font-black text-white italic tracking-widest">DEPOLARIZATION</p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Sterilization Safety</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "NEVER autoclave a transducer. High heat kills the piezoelectric properties. Use <span className="text-white">Cidex</span> or cold germicides instead."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex gap-4 items-center">
               <Info className="text-indigo-300" size={20} />
               <p className="text-[10px] font-bold text-indigo-100 leading-relaxed uppercase tracking-wider">
                 The piezoelectric effect is the property of certain materials to create a voltage when mechanically deformed.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
