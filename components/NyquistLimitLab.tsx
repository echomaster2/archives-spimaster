
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Activity, Zap, Target, ArrowUpDown, Info, Sparkles, MoveRight, RotateCw, Gauge } from 'lucide-react';

export const NyquistLimitLab: React.FC = () => {
  const [prf, setPrf] = useState(5000); // Hz
  const [frequency, setFrequency] = useState(5); // MHz
  const [velocity, setVelocity] = useState(100); // cm/s
  const [baseline, setBaseline] = useState(50); // % height
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const physics = useMemo(() => {
    // Doppler Shift fd = (2 * v * fo * cos) / c. Assume cos(0)=1
    const shift = (2 * velocity * (frequency * 1000000)) / 154000;
    const nyquist = prf / 2;
    const isAliasing = shift > nyquist;
    
    return {
      shift: shift.toFixed(0),
      nyquist: nyquist.toFixed(0),
      isAliasing,
      ratio: (shift / nyquist).toFixed(2)
    };
  }, [prf, frequency, velocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const h = canvas.height;
      const w = canvas.width;
      const blY = h * (baseline / 100);
      
      // Draw Grid & Baseline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < h; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
      }
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, blY); ctx.lineTo(w, blY); ctx.stroke();

      // Draw Doppler Spectrum
      const shiftVal = parseFloat(physics.shift);
      const nyquistVal = parseFloat(physics.nyquist);
      const scale = 100 / nyquistVal;
      
      ctx.fillStyle = '#10b981';
      for (let x = 0; x < w; x += 4) {
        const time = (x + offset) * 0.05;
        const rawWave = Math.abs(Math.sin(time)) * shiftVal;
        let displayWave = rawWave * scale * 1.5;
        
        // Aliasing Logic: If wave height > nyquist (represented by canvas boundaries)
        // it wraps around to the other side
        const limit = blY; // Distance to top
        const bottomLimit = h - blY; // Distance to bottom
        
        ctx.fillStyle = physics.isAliasing ? '#f43f5e' : '#10b981';
        
        if (displayWave > limit) {
           // Alias wrap to bottom
           const wrappedHeight = displayWave - limit;
           ctx.fillRect(x, h - wrappedHeight, 3, wrappedHeight);
           // Draw partial at top
           ctx.fillRect(x, 0, 3, limit);
        } else {
           ctx.fillRect(x, blY - displayWave, 3, displayWave);
        }
      }

      offset += 2;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [physics, baseline]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
        <Gauge size={240} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <RotateCw className="text-rose-500" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic text-white">Spectral Aliasing Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Nyquist Limit & PRF Dynamics</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Doppler Shift</span>
              <span className={`text-xl font-black ${physics.isAliasing ? 'text-rose-500' : 'text-emerald-400'}`}>
                {physics.shift} Hz
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Nyquist Limit</span>
              <span className="text-xl font-black text-indigo-400">{physics.nyquist} Hz</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {/* Spectral Display */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner group">
              <canvas ref={canvasRef} width={600} height={320} className="w-full h-full" />
              
              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Pulsed Wave Spectrum
              </div>
              
              {physics.isAliasing && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-600/90 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase shadow-2xl animate-pulse text-center">
                  Wrap-Around Artifact<br/><span className="text-[8px] opacity-80 font-bold">Shift &gt; PRF/2</span>
                </div>
              )}

              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                 <div className="w-1 h-12 bg-white/10 rounded-full relative">
                    <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-1 transition-all duration-300" style={{ top: `${baseline}%` }} />
                 </div>
                 <span className="text-[6px] font-black text-slate-500 uppercase rotate-90">Baseline</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                     <Activity size={12}/> PRF (Scale)
                   </label>
                   <span className="text-xs font-black text-indigo-400">{prf} Hz</span>
                </div>
                <input 
                  type="range" min="1000" max="10000" step="500"
                  value={prf}
                  onChange={(e) => setPrf(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                     <Zap size={12}/> Transmit Freq
                   </label>
                   <span className="text-xs font-black text-rose-400">{frequency} MHz</span>
                </div>
                <input 
                  type="range" min="2" max="10" step="1"
                  value={frequency}
                  onChange={(e) => setFrequency(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between gap-8">
               <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Baseline Position</label>
                  <input type="range" min="10" max="90" value={baseline} onChange={(e) => setBaseline(parseInt(e.target.value))} className="w-full h-1 bg-slate-700 rounded-full appearance-none accent-white" />
               </div>
               <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Blood Velocity</label>
                  <input type="range" min="20" max="250" value={velocity} onChange={(e) => setVelocity(parseInt(e.target.value))} className="w-full h-1 bg-slate-700 rounded-full appearance-none accent-emerald-500" />
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Target size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Nyquist Equation</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Aliasing is the most common artifact in Doppler. It happens when the <span className="text-white font-bold underline">Doppler Shift</span> exceeds the <span className="text-indigo-400 font-black">Nyquist Limit</span>.
               </p>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Registry Math</p>
                  <p className="text-2xl font-black italic text-indigo-400 tracking-tighter">Nyquist = PRF / 2</p>
               </div>
            </div>

            <div className="p-8 bg-slate-800 rounded-[2.5rem] border border-white/5 space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Clinical Fixes for Aliasing:</h4>
               <div className="space-y-3">
                  {[
                    "Increase PRF (Scale)",
                    "Lower Transducer Frequency (fo)",
                    "Select a shallower sample volume",
                    "Shift the Baseline",
                    "Use Continuous Wave (CW) Doppler"
                  ].map((fix, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       {fix}
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-6 bg-rose-900/20 rounded-[2rem] border border-rose-500/20 flex gap-4 items-center">
              <div className="p-3 bg-rose-600/20 rounded-2xl">
                <Sparkles size={24} className="text-rose-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-rose-500">Registry Pro Tip</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "Think of aliasing like a <span className="text-white">fast-spinning wheel</span> appearing to turn backward in a movie. It's an issue of sampling rate."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
