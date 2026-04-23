
import React, { useState, useEffect, useRef } from 'react';
import { Activity, Clock, Heart, Zap, Info, Layers, Waves } from 'lucide-react';

export const MModeLab: React.FC = () => {
  const [heartRate, setHeartRate] = useState(70); // BPM
  const [depth, setDepth] = useState(10); // cm
  const [history, setHistory] = useState<number[]>(Array(100).fill(50));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const time = Date.now() / 1000;
        const frequency = heartRate / 60;
        // Simulate heart wall motion (sinusoidal + harmonics)
        const motion = 50 + 20 * Math.sin(2 * Math.PI * frequency * time) + 5 * Math.sin(4 * Math.PI * frequency * time);
        return [motion, ...prev.slice(0, 99)];
      });
    }, 50);

    return () => clearInterval(interval);
  }, [heartRate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Drawing the M-Mode strip
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Motion Line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
    ctx.beginPath();
    history.forEach((val, i) => {
      const x = (i / history.length) * canvas.width;
      const y = (val / 100) * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [history]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Activity size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-emerald-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">M-Mode Motion Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Temporal Resolution Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Heart Rate</span>
              <span className="text-xl font-black text-emerald-400">{heartRate} BPM</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Time Axis</span>
              <span className="text-xl font-black text-indigo-400">Real-time</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Strip Chart View */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-800 shadow-2xl">
              <div className="absolute top-4 left-6 flex items-center gap-2 z-10">
                 <Activity size={14} className="text-emerald-500 animate-pulse"/>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time-Motion Record (M-Mode)</span>
              </div>
              
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={320} 
                className="w-full h-full"
              />

              <div className="absolute bottom-4 right-6 text-[8px] font-bold text-slate-600 uppercase italic">
                Scanning single scan line...
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cardiac Rate</label>
                   <span className="text-xs font-black text-emerald-400">{heartRate} BPM</span>
                </div>
                <input 
                  type="range" min="40" max="180" step="5"
                  value={heartRate}
                  onChange={(e) => setHeartRate(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sweep Speed</label>
                   <span className="text-xs font-black text-indigo-400">High</span>
                </div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 w-[75%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
               <h4 className="text-lg font-black mb-4 tracking-tight flex items-center gap-2">
                 <Layers size={18} className="text-emerald-400"/> M-Mode Fundamentals
               </h4>
               <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-[10px] font-black text-white uppercase mb-1">What it is</p>
                     <p className="text-[9px] text-slate-400 leading-relaxed">A 1D representation showing structure depth over time. Essential for valve motion and heart rate.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-[10px] font-black text-white uppercase mb-1">Temporal Res</p>
                     <p className="text-[9px] text-slate-400 leading-relaxed">M-mode has the highest temporal resolution because it only uses <span className="text-emerald-400">one scan line</span>.</p>
                  </div>
               </div>
            </div>

            <div className="bg-emerald-600 rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-500/20">
               <div className="flex items-center gap-3 mb-2">
                  <Zap className="text-emerald-200" size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Registry Fact</h4>
               </div>
               <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                 The x-axis in M-Mode represents <span className="font-black italic">Time</span>, while the y-axis represents <span className="font-black italic">Depth</span>.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
