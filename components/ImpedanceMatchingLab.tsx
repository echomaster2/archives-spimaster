
import React, { useState, useMemo } from 'react';
import { Layers, Zap, Target, Activity, Info, Sparkles, MoveRight, Thermometer } from 'lucide-react';

export const ImpedanceMatchingLab: React.FC = () => {
  const [zPzt, setZPzt] = useState(30); // MRayls
  const [zMatching, setZMatching] = useState(15); // MRayls
  const [zSkin, setZSkin] = useState(1.6); // MRayls

  const reflectionData = useMemo(() => {
    // IRC between PZT and Matching
    const irc1 = Math.pow((zMatching - zPzt) / (zMatching + zPzt), 2) * 100;
    // IRC between Matching and Skin
    const irc2 = Math.pow((zSkin - zMatching) / (zSkin + zMatching), 2) * 100;
    
    const totalTransmission = (1 - (irc1/100)) * (1 - (irc2/100)) * 100;
    const isOptimal = zMatching > zSkin && zMatching < zPzt;

    return {
      irc1: irc1.toFixed(1),
      irc2: irc2.toFixed(1),
      transmission: totalTransmission.toFixed(1),
      isOptimal,
      status: isOptimal ? 'Efficient Coupling' : 'High Reflection Loss'
    };
  }, [zPzt, zMatching, zSkin]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Layers size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Layers className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Impedance Matching Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">The Acoustic Impedance Sandwich</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Total Transmission</span>
              <span className={`text-xl font-black ${parseFloat(reflectionData.transmission) > 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {reflectionData.transmission}%
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Coupling State</span>
              <span className="text-xl font-black text-indigo-400 uppercase tracking-tighter text-xs">{reflectionData.status}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Impedance Stack */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex flex-col p-8 group">
              <div className="flex-1 flex flex-col gap-1">
                 {/* PZT Layer */}
                 <div className="h-1/3 bg-purple-600 rounded-t-xl flex items-center justify-center relative border-b-4 border-black/20">
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">PZT ({zPzt} MRayls)</span>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <Zap size={12} className="text-purple-300 animate-pulse" />
                    </div>
                 </div>
                 {/* Matching Layer */}
                 <div 
                   className="h-1/3 bg-indigo-500 flex items-center justify-center relative border-b-4 border-black/20 transition-all duration-500"
                   style={{ opacity: 0.6 + (zMatching/40) }}
                 >
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">Matching ({zMatching} MRayls)</span>
                    {parseFloat(reflectionData.irc1) > 20 && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-rose-600 text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg">Refl: {reflectionData.irc1}%</div>
                    )}
                 </div>
                 {/* Skin Layer */}
                 <div className="h-1/3 bg-rose-200 rounded-b-xl flex items-center justify-center relative">
                    <span className="text-[10px] font-black uppercase text-rose-900 tracking-widest">Soft Tissue ({zSkin} MRayls)</span>
                    {parseFloat(reflectionData.irc2) > 20 && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-rose-600 text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg">Refl: {reflectionData.irc2}%</div>
                    )}
                 </div>
              </div>
              
              <div className="absolute bottom-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                1/4 Wavelength Thickness Applied
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Matching Layer Z</label>
                   <span className="text-xs font-black text-indigo-400">{zMatching}</span>
                </div>
                <input 
                  type="range" min="2" max="30" step="0.5"
                  value={zMatching}
                  onChange={(e) => setZMatching(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tissue Z (Skin)</label>
                   <span className="text-xs font-black text-rose-400">{zSkin}</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="0.1"
                  value={zSkin}
                  onChange={(e) => setZSkin(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
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
                  <h4 className="text-xl font-black tracking-tight">Impedance Hierarchy</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 To minimize reflection and maximize transmission into the body, impedance values must decrease in a specific order:
               </p>
               <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs font-black">
                     <span className="text-purple-400">PZT</span>
                     <MoveRight className="text-slate-600" size={14} />
                     <span className="text-indigo-400">Matching Layer</span>
                     <MoveRight className="text-slate-600" size={14} />
                     <span className="text-blue-300">Gel</span>
                     <MoveRight className="text-slate-600" size={14} />
                     <span className="text-rose-400">Skin</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note: Thickness</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  The <span className="text-white font-bold">Matching Layer</span> is 1/4 wavelength thick. The <span className="text-white font-bold">Active Element (PZT)</span> is 1/2 wavelength thick.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex gap-4 items-center">
               <div className="p-2 bg-indigo-600 rounded-lg shrink-0">
                  <Info size={16} />
               </div>
               <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                 Without matching layers and gel, 99.9% of the sound beam would reflect at the skin interface.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
