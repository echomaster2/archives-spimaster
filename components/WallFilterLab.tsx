
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Activity, Wind, Zap, Target, Info, Sparkles, Filter, Droplet } from 'lucide-react';

export const WallFilterLab: React.FC = () => {
  const [filterLevel, setFilterLevel] = useState(20); // Frequency cutoff in Hz
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filterData = useMemo(() => {
    return {
      clutterReduction: filterLevel > 30 ? 'Aggressive' : 'Standard',
      flowLossRisk: filterLevel > 60 ? 'High (Low flow missed)' : 'Low',
      label: filterLevel > 100 ? 'Reject' : 'Wall Filter'
    };
  }, [filterLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const baseline = canvas.height - 40;
      
      // Draw Baseline
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(0, baseline);
      ctx.lineTo(canvas.width, baseline);
      ctx.stroke();

      // 1. Vessel Wall Clutter (Low frequency, High amplitude)
      // If filterLevel is higher than the clutter's "frequency", it's hidden
      const clutterAmp = filterLevel > 15 ? 0 : 60; 
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let x = 0; x < canvas.width; x += 8) {
        const clutterY = Math.sin((x + offset) * 0.01) * clutterAmp;
        ctx.fillRect(x, baseline - 5 - clutterY, 4, 10);
      }

      // 2. Real Blood Flow (High frequency range)
      // If filterLevel is too high, it eats into the baseline of the flow
      const flowPeak = 120;
      ctx.fillStyle = '#3b82f6';
      for (let x = 0; x < canvas.width; x += 4) {
        const time = (x + offset) * 0.05;
        const baseHeight = Math.abs(Math.sin(time)) * flowPeak;
        
        // Setting the cutoff: everything below filterLevel near baseline is black
        const startY = baseline - Math.max(filterLevel, 2);
        const endY = baseline - baseHeight;
        
        if (baseHeight > filterLevel) {
           ctx.fillRect(x, startY, 3, endY - startY);
        }
      }

      offset += 2;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [filterLevel]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Filter size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Wind className="text-cyan-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Wall Filter Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">High-Pass Filtering & Clutter Control</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Cut-off Frequency</span>
              <span className="text-xl font-black text-cyan-400">{filterLevel} Hz</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Clutter Status</span>
              <span className={`text-xl font-black ${filterLevel < 15 ? 'text-rose-500' : 'text-emerald-400'}`}>
                {filterLevel < 15 ? 'High Clutter' : 'Clean Trace'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Spectral Visualization */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              <canvas ref={canvasRef} width={600} height={320} className="w-full h-full" />
              
              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-cyan-400">
                Mode: Spectral Doppler
              </div>
              
              {filterLevel > 80 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-600/90 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-2xl animate-pulse text-center">
                  Risk: Missing Low Velocity Flow<br/>(Setting Too High)
                </div>
              )}
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Filter Threshold (High-Pass)</label>
                  <span className="text-xs font-black text-cyan-400">{filterLevel} Hz</span>
               </div>
               <input 
                  type="range" min="0" max="150" step="5"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
                   <span>No Filter</span>
                   <span>Aggressive Reject</span>
                </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-[2.5rem] border border-cyan-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-cyan-600 rounded-xl text-white shadow-lg">
                    <Filter size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The "High-Pass" Logic</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Vessel walls move slowly but reflect a <span className="text-white font-bold">LOT of sound</span>. This creates high-amplitude, low-frequency Doppler shifts (clutter). The Wall Filter removes them.
               </p>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-cyan-400 uppercase">Wall Filter ↑</span>
                    <span className="text-xs font-bold text-white">Clutter ↓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase">Wall Filter ↑</span>
                    <span className="text-xs font-bold text-white">Low Velocity Flow Removed</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note: "Rejection"</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Wall filters are high-pass filters. They only allow <span className="text-white">high frequencies</span> to "pass" through to the processor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
