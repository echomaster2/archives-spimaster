
import React, { useState, useMemo } from 'react';
import { Layers, Zap, Sliders, Activity, Info, Sparkles, Filter, Maximize2 } from 'lucide-react';

export const DynamicRangeLab: React.FC = () => {
  const [inputDR, setInputDR] = useState(100); // dB
  const [compression, setCompression] = useState(40); // %

  const drMetrics = useMemo(() => {
    // Output DR = Input DR - Compression factor
    const outputDR = Math.max(10, inputDR - (compression / 100 * inputDR * 0.8));
    const shadesOfGray = Math.pow(2, Math.floor(outputDR / 10)); // Simplified visualization logic
    
    return {
      outputDR: outputDR.toFixed(0),
      shades: Math.min(256, Math.max(2, Math.round(outputDR))),
      contrast: outputDR > 60 ? 'Low Contrast' : 'High Contrast'
    };
  }, [inputDR, compression]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Filter size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sliders className="text-purple-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Dynamic Range Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Log Compression & Contrast Dynamics</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Output Range</span>
              <span className="text-xl font-black text-purple-400">{drMetrics.outputDR} dB</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Visual Class</span>
              <span className={`text-xl font-black ${parseFloat(drMetrics.outputDR) > 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {drMetrics.contrast}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Contrast Strip */}
            <div className="bg-black rounded-[2.5rem] h-64 relative overflow-hidden border-4 border-slate-700 shadow-inner flex flex-col items-center justify-center p-8">
              <div className="w-full h-24 rounded-2xl overflow-hidden flex shadow-2xl border border-white/10">
                {[...Array(drMetrics.shades)].map((_, i) => {
                  const intensity = (i / (drMetrics.shades - 1)) * 255;
                  return (
                    <div 
                      key={i} 
                      className="flex-1 h-full transition-all duration-300"
                      style={{ backgroundColor: `rgb(${intensity}, ${intensity}, ${intensity})` }}
                    />
                  );
                })}
              </div>
              
              <div className="mt-8 flex justify-between w-full px-2">
                 <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-black border border-white/20 rounded-full mb-1"></div>
                    <span className="text-[8px] font-black text-slate-500 uppercase">Anechoic</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-white rounded-full mb-1"></div>
                    <span className="text-[8px] font-black text-slate-500 uppercase">Hyperechoic</span>
                 </div>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-purple-400">
                Gray Scale Map: {drMetrics.shades} Levels
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Input Range</label>
                   <span className="text-xs font-black">{inputDR} dB</span>
                </div>
                <input 
                  type="range" min="60" max="120"
                  value={inputDR}
                  onChange={(e) => setInputDR(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Compression</label>
                   <span className="text-xs font-black">{compression}%</span>
                </div>
                <input 
                  type="range" min="0" max="90"
                  value={compression}
                  onChange={(e) => setCompression(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-purple-500/10 to-transparent rounded-[2.5rem] border border-purple-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-purple-600 rounded-xl text-white shadow-lg">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Compression Factor</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Log compression reduces the <span className="text-purple-400 font-bold">Dynamic Range</span> of signals so that the eye can perceive them. 
               </p>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <p className="text-[10px] font-bold text-slate-300">NARROW DR: High Contrast, Fewer Grays (B&W)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                    <p className="text-[10px] font-bold text-slate-300">WIDE DR: Low Contrast, Many Grays (Smooth)</p>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Tip</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Compression is an adjustable receiver function. Increasing compression <span className="text-white">DECREASES</span> the dynamic range.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20">
               <p className="text-xs font-bold text-indigo-100/80 leading-relaxed italic">
                 "Components earlier in the chain (Receiver) handle a WIDER range than components later in the chain (Display/PACS)."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
