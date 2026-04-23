
import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Zap, Target, Activity, Info, Sparkles, Layout, Gauge, Maximize2, MoveHorizontal } from 'lucide-react';

export const ResolutionTradeoffLab: React.FC = () => {
  const [lineDensity, setLineDensity] = useState(100);
  const [sectorWidth, setSectorWidth] = useState(90); // degrees
  const [focalZones, setFocalZones] = useState(1);
  const [depth, setDepth] = useState(10); // cm
  
  const metrics = useMemo(() => {
    // Frame Rate formula basics: T-frame = # pulses per frame * PRP
    // # pulses = lineDensity * focalZones
    // PRP = 13us * depth
    const totalLines = (lineDensity * (sectorWidth / 90)) * focalZones;
    const prp = 13; // us per cm
    const tFrameUs = totalLines * prp * depth;
    const frameRate = 1000000 / tFrameUs;
    
    return {
      fr: frameRate.toFixed(1),
      tFrame: (tFrameUs / 1000).toFixed(1),
      spatialRes: lineDensity > 150 ? 'Superior' : lineDensity > 80 ? 'Standard' : 'Poor',
      temporalRes: frameRate > 30 ? 'Excellent' : frameRate > 15 ? 'Good' : 'Laggy',
      isFlicker: frameRate < 15
    };
  }, [lineDensity, sectorWidth, focalZones, depth]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Clock size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Layout className="text-emerald-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Resolution Trade-off Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Temporal vs Spatial detail Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Frame Rate (Temporal)</span>
              <span className={`text-xl font-black ${metrics.isFlicker ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                {metrics.fr} fps
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Line Density (Spatial)</span>
              <span className="text-xl font-black text-indigo-400">{lineDensity} LPF</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {/* Visual Scan Converter Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              
              {/* The Sector Scan */}
              <div className="relative w-full h-full flex flex-col items-center">
                 <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
                    <defs>
                       <radialGradient id="scanGrad" cx="50%" cy="0%" r="100%">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                       </radialGradient>
                    </defs>
                    
                    {/* The Scan Region */}
                    <path 
                      d={(() => {
                        const r = 180;
                        const startAngle = (90 - sectorWidth/2) * (Math.PI/180);
                        const endAngle = (90 + sectorWidth/2) * (Math.PI/180);
                        const x1 = 100 + r * Math.cos(startAngle);
                        const y1 = r * Math.sin(startAngle);
                        const x2 = 100 + r * Math.cos(endAngle);
                        const y2 = r * Math.sin(endAngle);
                        return `M 100 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
                      })()}
                      fill="url(#scanGrad)"
                      stroke="#6366f1"
                      strokeWidth="1"
                      opacity="0.3"
                    />

                    {/* The "Lines" (Spatial resolution visualization) */}
                    {[...Array(Math.min(40, Math.floor(lineDensity / 5)))].map((_, i) => {
                      const angle = (90 - sectorWidth/2 + (i / (Math.min(40, Math.floor(lineDensity / 5)) - 1)) * sectorWidth) * (Math.PI/180);
                      return (
                        <line 
                          key={i} x1="100" y1="0" 
                          x2={100 + 180 * Math.cos(angle)} y2={180 * Math.sin(angle)} 
                          stroke="rgba(255,255,255,0.15)" 
                          strokeWidth={lineDensity > 150 ? "0.5" : "1.5"}
                        />
                      );
                    })}

                    {/* Moving Heart Structure (Temporal focus) */}
                    <circle 
                      cx={100 + 40 * Math.sin(Date.now() / 200)} 
                      cy={100} 
                      r="12" 
                      fill="#f43f5e" 
                      fillOpacity="0.8"
                      className="transition-all duration-300"
                      style={{ 
                        filter: metrics.isFlicker ? 'blur(4px)' : 'none',
                        opacity: metrics.isFlicker ? 0.4 : 1
                      }}
                    />
                 </svg>
              </div>

              {metrics.isFlicker && (
                <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-[1px] flex items-center justify-center">
                   <div className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl animate-pulse">
                      <Zap size={14}/> Temporal Aliasing: Frame Rate Too Low
                   </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Maximize2 size={12}/> Line Density</label>
                    <span className="text-xs font-black text-indigo-400">{lineDensity}</span>
                  </div>
                  <input type="range" min="30" max="250" step="10" value={lineDensity} onChange={(e) => setLineDensity(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
               </div>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Target size={12}/> Focal Zones</label>
                    <span className="text-xs font-black text-amber-400">{focalZones}</span>
                  </div>
                  <input type="range" min="1" max="4" step="1" value={focalZones} onChange={(e) => setFocalZones(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" />
               </div>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><MoveHorizontal size={12}/> Sector Width</label>
                    <span className="text-xs font-black text-cyan-400">{sectorWidth}°</span>
                  </div>
                  <input type="range" min="30" max="120" step="10" value={sectorWidth} onChange={(e) => setSectorWidth(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
               </div>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Gauge size={12}/> Depth</label>
                    <span className="text-xs font-black text-emerald-400">{depth} cm</span>
                  </div>
                  <input type="range" min="2" max="20" step="1" value={depth} onChange={(e) => setDepth(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Sparkles size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The "Scan Line" Math</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Each scan line requires a round-trip pulse. More lines = better <span className="text-indigo-400 font-bold">Spatial Resolution</span> but takes more time, which <span className="text-rose-400 font-bold">DECREASES</span> frame rate.
               </p>
               <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Registry Relationships:</p>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                     <span>Depth ↑</span>
                     <span className="text-rose-400">Frame Rate ↓</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                     <span>Line Density ↑</span>
                     <span className="text-rose-400">Frame Rate ↓</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                     <span>Multi-Focus ↑</span>
                     <span className="text-rose-400">Frame Rate ↓</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Info size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Master Tip: Temporal Res</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "For a moving heart, keep it fast (High FR). For a still gallbladder, keep it sharp (High Line Density)."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20">
               <p className="text-[9px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed text-center">
                 T-frame is the time it takes to scan one full image frame.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
