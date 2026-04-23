
import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Zap, Target, Activity, Info, Sparkles, Layout, Gauge } from 'lucide-react';

export const TemporalResolutionLab: React.FC = () => {
  const [depth, setDepth] = useState(10); // cm
  const [lineDensity, setLineDensity] = useState(100); // lines per frame
  const [focalZones, setFocalZones] = useState(1);
  const [scanPos, setScanPos] = useState(0);

  const stats = useMemo(() => {
    // T-frame = # lines * PRP
    // PRP = 13us * depth
    const prp = 13 * depth; // microseconds
    const tFrame = lineDensity * focalZones * prp; // microseconds
    const frameRate = 1000000 / tFrame; // Hz (fps)
    
    return {
      tFrame: (tFrame / 1000).toFixed(1), // ms
      frameRate: frameRate.toFixed(1),
      quality: frameRate > 30 ? 'Excellent' : frameRate > 15 ? 'Good' : 'Poor (Flicker)'
    };
  }, [depth, lineDensity, focalZones]);

  // Animation for the scanning beam
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setScanPos(prev => (prev + parseFloat(stats.frameRate) / 60) % 100);
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [stats.frameRate]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Clock size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-emerald-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Temporal Resolution Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Frame Rate & T-Frame Dynamics</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Frame Rate</span>
              <span className={`text-xl font-black ${parseFloat(stats.frameRate) < 15 ? 'text-rose-500' : 'text-emerald-400'}`}>
                {stats.frameRate} Hz
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">T-Frame</span>
              <span className="text-xl font-black text-indigo-400">{stats.tFrame} ms</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Scan Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner group">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              
              {/* Scanning Beam */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] transition-opacity duration-300"
                style={{ left: `${scanPos}%` }}
              ></div>

              {/* Grid representation of "Lines" */}
              <div className="absolute inset-0 flex justify-between px-2 opacity-20">
                {[...Array(Math.min(20, lineDensity / 10))].map((_, i) => (
                  <div key={i} className="w-px h-full bg-white/30"></div>
                ))}
              </div>

              {/* Focal Zone Markers */}
              <div className="absolute inset-y-0 right-4 flex flex-col justify-around py-10">
                {[...Array(focalZones)].map((_, i) => (
                  <Target key={i} size={12} className="text-amber-500 animate-pulse" />
                ))}
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Motion Smoothness: {stats.quality}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Imaging Depth</label>
                   <span className="text-xs font-black">{depth} cm</span>
                </div>
                <input 
                  type="range" min="2" max="20" step="1"
                  value={depth}
                  onChange={(e) => setDepth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Focal Zones</label>
                   <span className="text-xs font-black">{focalZones} Focus</span>
                </div>
                <input 
                  type="range" min="1" max="4" step="1"
                  value={focalZones}
                  onChange={(e) => setFocalZones(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Line Density (Sector Width)</label>
                 <span className="text-xs font-black">{lineDensity} Lines</span>
              </div>
              <input 
                type="range" min="50" max="250" step="10"
                value={lineDensity}
                onChange={(e) => setLineDensity(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Frame Rate Trade-off</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Temporal resolution is the ability to track moving structures in real-time. It is determined by the <span className="text-white font-bold underline">Frame Rate</span>.
               </p>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase">Shallow Depth ↑</span>
                    <span className="text-xs font-bold text-white">Frame Rate ↑</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-400 uppercase">Multi-Focus ↑</span>
                    <span className="text-xs font-bold text-white">Frame Rate ↓</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Math</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "Frame Rate × T-frame = 1. They are inverse reciprocals."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20">
               <p className="text-xs font-bold text-indigo-100/80 leading-relaxed">
                 High line density improves <span className="underline">Spatial Resolution</span> but sacrifices <span className="underline">Temporal Resolution</span>.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
