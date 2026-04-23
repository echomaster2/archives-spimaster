
import React, { useState, useMemo } from 'react';
import { Sliders, Zap, Target, Activity, Info, Sparkles, Settings, Maximize2, Gauge, MousePointer2 } from 'lucide-react';

export const KnobologyLab: React.FC = () => {
  const [gain, setGain] = useState(50);
  const [dynamicRange, setDynamicRange] = useState(60);
  const [depth, setDepth] = useState(10);
  const [focusDepth, setFocusDepth] = useState(5);
  const [reject, setReject] = useState(10);
  const [tgcFar, setTgcFar] = useState(0);

  const imageStyle = useMemo(() => {
    // Simulate ultrasound image processing
    const brightness = (gain / 100) * 1.5 + (tgcFar / 100) * 0.5;
    const contrast = 1 + (100 - dynamicRange) / 50;
    const blur = Math.abs(focusDepth - (depth / 2)) * 0.5; // Focus logic simulation
    
    return {
      filter: `brightness(${brightness}) contrast(${contrast})`,
      opacity: (100 - reject) / 100
    };
  }, [gain, dynamicRange, depth, focusDepth, reject, tgcFar]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Settings size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Clinical Console Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Full Knobology & Image Optimization</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Image Score</span>
              <span className="text-xl font-black text-emerald-400">Diagnostic</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
               <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Optimization</span>
               <span className="text-xl font-black text-indigo-400">Active</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Virtual Screen */}
          <div className="lg:col-span-7 space-y-6">
             <div className="bg-black rounded-[2.5rem] aspect-video relative overflow-hidden border-8 border-slate-800 shadow-2xl group">
                <div className="absolute top-4 left-6 z-20 flex flex-col gap-1">
                   <span className="text-[10px] font-black text-white/40 uppercase">MI: 0.8 TI: 0.4</span>
                   <span className="text-[10px] font-black text-white/40 uppercase">G: {gain}% DR: {dynamicRange}dB</span>
                </div>

                {/* Simulated Ultrasound Image (Liver-ish) */}
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300" style={imageStyle}>
                   <div className="w-full h-full bg-slate-900 overflow-hidden relative">
                      {/* Speckle Pattern */}
                      <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                      
                      {/* Simulated Organ */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-gradient-to-b from-slate-400/20 via-slate-600/30 to-slate-800/40 rounded-[4rem] blur-xl"></div>
                      
                      {/* Simulated Vessels */}
                      <div className="absolute top-1/3 left-1/4 w-12 h-12 rounded-full bg-black/80 blur-md"></div>
                      <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-black/80 blur-lg"></div>

                      {/* Focus Marker on Image */}
                      <div 
                        className="absolute left-0 w-full border-t border-dashed border-indigo-500/30 transition-all duration-500"
                        style={{ top: `${(focusDepth / depth) * 100}%` }}
                      >
                         <Target size={12} className="text-indigo-400 -mt-1.5 ml-2 animate-pulse" />
                      </div>
                   </div>
                </div>

                {/* Scanning Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                   <div className="w-full h-full border-[1px] border-white/5 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.1) 95%)', backgroundSize: '20px 100%' }}></div>
                </div>
             </div>

             <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-600 rounded-lg"><Maximize2 size={16}/></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Imaging Depth</span>
                </div>
                <div className="flex items-center gap-4 flex-1 max-w-xs">
                   <input type="range" min="5" max="25" step="1" value={depth} onChange={(e) => setDepth(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                   <span className="text-xs font-black w-10">{depth}cm</span>
                </div>
             </div>
          </div>

          {/* Console Controls */}
          <div className="lg:col-span-5 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-800/50 rounded-3xl border border-white/5 space-y-4">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gain (Amplification)</label>
                   <div className="flex items-center gap-4">
                      <input type="range" min="0" max="100" value={gain} onChange={(e) => setGain(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                      <span className="text-[10px] font-black">{gain}</span>
                   </div>
                </div>
                <div className="p-6 bg-slate-800/50 rounded-3xl border border-white/5 space-y-4">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dynamic Range</label>
                   <div className="flex items-center gap-4">
                      <input type="range" min="30" max="100" value={dynamicRange} onChange={(e) => setDynamicRange(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                      <span className="text-[10px] font-black">{dynamicRange}</span>
                   </div>
                </div>
                <div className="p-6 bg-slate-800/50 rounded-3xl border border-white/5 space-y-4">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Focus Position</label>
                   <div className="flex items-center gap-4">
                      <input type="range" min="1" max={depth} step="0.5" value={focusDepth} onChange={(e) => setFocusDepth(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                      <span className="text-[10px] font-black">{focusDepth}</span>
                   </div>
                </div>
                <div className="p-6 bg-slate-800/50 rounded-3xl border border-white/5 space-y-4">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reject (Threshold)</label>
                   <div className="flex items-center gap-4">
                      <input type="range" min="0" max="50" value={reject} onChange={(e) => setReject(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                      <span className="text-[10px] font-black">{reject}</span>
                   </div>
                </div>
             </div>

             <div className="p-8 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-500/20">
                <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                   <Zap size={16} /> Registry Insight: Order of Operations
                </h4>
                <div className="space-y-3">
                   <p className="text-xs text-slate-400 leading-relaxed italic">
                     "If the entire image is too dark, always adjust <span className="text-white font-bold">Receiver Gain</span> first. Only increase Output Power if gain is maxed and SNR is still poor."
                   </p>
                   <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">ALARA Compliant</button>
                      <button onClick={() => {setGain(50); setDynamicRange(60); setDepth(10); setFocusDepth(5); setReject(10); setTgcFar(0);}} className="px-4 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white">Reset Console</button>
                   </div>
                </div>
             </div>

             <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/10 flex gap-4 items-center">
                <div className="p-3 bg-amber-500/20 rounded-2xl">
                   <Sparkles size={24} className="text-amber-500" />
                </div>
                <div>
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Master Class Hint</h5>
                   <p className="text-[11px] text-slate-400 leading-snug">
                     Reject (or threshold) removes low-level noise without affecting the strong echoes from diagnostic structures.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
