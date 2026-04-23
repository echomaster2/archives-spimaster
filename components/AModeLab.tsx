
import React, { useState, useMemo } from 'react';
import { Activity, Zap, Target, Info, Sparkles, MoveRight, Layers } from 'lucide-react';

export const AModeLab: React.FC = () => {
  const [reflector1Depth, setReflector1Depth] = useState(2); // cm
  const [reflector1Strength, setReflector1Strength] = useState(80); // %
  const [reflector2Depth, setReflector2Depth] = useState(6); // cm
  const [reflector2Strength, setReflector2Strength] = useState(40); // %

  const spikePath = useMemo(() => {
    const points = [];
    const width = 800;
    const height = 300;
    const padding = 20;
    
    // Start at baseline
    points.push(`0,${height - padding}`);
    
    for (let x = 0; x < width; x++) {
      let y = height - padding;
      
      // Reflector 1 Spike
      const r1X = (reflector1Depth / 10) * width;
      if (Math.abs(x - r1X) < 10) {
        const spikeHeight = (reflector1Strength / 100) * (height - padding * 2);
        y -= spikeHeight * Math.exp(-Math.pow(x - r1X, 2) / 20);
      }

      // Reflector 2 Spike
      const r2X = (reflector2Depth / 10) * width;
      if (Math.abs(x - r2X) < 10) {
        const spikeHeight = (reflector2Strength / 100) * (height - padding * 2);
        y -= spikeHeight * Math.exp(-Math.pow(x - r2X, 2) / 20);
      }

      // Add noise
      y += (Math.random() - 0.5) * 2;
      
      points.push(`${x},${y}`);
    }
    
    return points.join(' ');
  }, [reflector1Depth, reflector1Strength, reflector2Depth, reflector2Strength]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Activity size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-cyan-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">A-Mode Amplitude Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">The Foundation of Sonography</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">X-Axis</span>
              <span className="text-xl font-black text-cyan-400 uppercase tracking-tighter">Depth</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Y-Axis</span>
              <span className="text-xl font-black text-indigo-400 uppercase tracking-tighter">Amplitude</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            {/* Oscilloscope View */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner group">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              
              <svg viewBox="0 0 800 300" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  points={spikePath}
                  className="transition-all duration-300"
                />
              </svg>

              <div className="absolute bottom-4 left-0 w-full flex justify-between px-10 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                <span>Transducer Face</span>
                <span>Depth (cm)</span>
                <span>10cm</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Target 1 (Gallstone?)</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Depth</label>
                    <span className="text-xs font-black">{reflector1Depth} cm</span>
                  </div>
                  <input type="range" min="0.5" max="9.5" step="0.1" value={reflector1Depth} onChange={(e) => setReflector1Depth(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Strength</label>
                    <span className="text-xs font-black">{reflector1Strength}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={reflector1Strength} onChange={(e) => setReflector1Strength(parseInt(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Target 2 (Soft Tissue?)</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Depth</label>
                    <span className="text-xs font-black">{reflector2Depth} cm</span>
                  </div>
                  <input type="range" min="0.5" max="9.5" step="0.1" value={reflector2Depth} onChange={(e) => setReflector2Depth(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Strength</label>
                    <span className="text-xs font-black">{reflector2Strength}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={reflector2Strength} onChange={(e) => setReflector2Strength(parseInt(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-[2.5rem] border border-cyan-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-cyan-600 rounded-xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Amplitude Axis</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 In A-mode, the <span className="text-white font-bold">height of the spike</span> represents the strength of the returning echo. It's often used in Ophthalmology to measure exact distances in the eye.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Y-Axis</span>
                    <span className="text-white">AMPLITUDE (Strength)</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">X-Axis</span>
                    <span className="text-white">DEPTH (Time of Flight)</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note: A-Mode</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  "Think of a <span className="text-white">skyline of skyscrapers</span>. The taller the building, the stronger the echo."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20">
               <p className="text-xs font-bold text-indigo-100/80 leading-relaxed italic">
                 "A-mode is technically Amplitude Mode. It's the simplest form of diagnostic ultrasound visualization."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
