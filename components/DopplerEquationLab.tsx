
import React, { useState, useMemo } from 'react';
import { Target, Zap, Activity, Info, Sparkles, Layers, ArrowRight, MousePointer2 } from 'lucide-react';

export const DopplerEquationLab: React.FC = () => {
  const [velocity, setVelocity] = useState(100); // cm/s
  const [frequency, setFrequency] = useState(5); // MHz
  const [angle, setAngle] = useState(0); // degrees
  const C = 154000; // cm/s

  const results = useMemo(() => {
    const cosTheta = Math.cos(angle * (Math.PI / 180));
    // fd = (2 * v * fo * cos) / c
    const shift = (2 * velocity * (frequency * 1000000) * cosTheta) / C;
    
    return {
      shift: shift.toFixed(0),
      cos: cosTheta.toFixed(2),
      impact: angle > 60 ? 'Critical Error Risk' : angle > 20 ? 'Standard Accuracy' : 'Maximum Sensitivity'
    };
  }, [velocity, frequency, angle]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Activity size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">The Doppler Equation Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Variable Decomposition & Result Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Measured Shift (fd)</span>
              <span className="text-2xl font-black text-indigo-400">{results.shift} Hz</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Equation Dissection */}
            <div className="bg-black rounded-[2.5rem] p-10 border-4 border-slate-700 shadow-inner flex flex-col items-center justify-center relative group">
               <div className="flex flex-wrap items-center justify-center gap-6 text-4xl font-black italic tracking-tighter">
                  <div className="text-indigo-400 group-hover:scale-110 transition-transform">fd</div>
                  <div className="text-slate-700">=</div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3">
                       <span className="text-white opacity-40">2</span>
                       <span className={`transition-colors ${velocity > 150 ? 'text-rose-500' : 'text-slate-100'}`}>v</span>
                       <span className={`transition-colors ${frequency > 7 ? 'text-indigo-400' : 'text-slate-100'}`}>fo</span>
                       <span className={`transition-colors ${angle > 60 ? 'text-rose-500' : 'text-emerald-400'}`}>cosθ</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 my-2"></div>
                    <span className="text-slate-600">c</span>
                  </div>
               </div>
               <div className="mt-12 flex gap-8">
                  <div className="text-center">
                    <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Cos({angle}°)</span>
                    <span className="text-lg font-black text-emerald-400">{results.cos}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Accuracy</span>
                    <span className="text-lg font-black text-indigo-400">{results.impact}</span>
                  </div>
               </div>
               
               <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest text-indigo-400">
                  Mathematical Model
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                     <MousePointer2 size={12}/> Insonation Angle (θ)
                   </label>
                   <span className="text-xs font-black text-indigo-400">{angle}°</span>
                </div>
                <input 
                  type="range" min="0" max="90" step="5"
                  value={angle}
                  onChange={(e) => setAngle(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
                   <span>Best Shift (0°)</span>
                   <span>No Shift (90°)</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Velocity (v)</label>
                       <span className="text-xs font-black">{velocity} cm/s</span>
                    </div>
                    <input type="range" min="20" max="300" step="10" value={velocity} onChange={(e) => setVelocity(parseInt(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none accent-indigo-500" />
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transmit (fo)</label>
                       <span className="text-xs font-black">{frequency} MHz</span>
                    </div>
                    <input type="range" min="2" max="12" step="1" value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none accent-indigo-500" />
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Direct Proportions</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 In the Doppler equation, the shift (fd) is <span className="text-white font-bold underline">Directly Proportional</span> to:
               </p>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                     <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                     <p className="text-[10px] font-bold text-slate-200">Velocity: Faster blood = Larger shift</p>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                     <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                     <p className="text-[10px] font-bold text-slate-200">Frequency: High freq probe = Larger shift</p>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                     <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                     <p className="text-[10px] font-bold text-slate-200">Cosθ: Smaller angle = Larger shift</p>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note: The '2'</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "The number '2' in the equation accounts for the fact that there are <span className="text-white font-bold underline">two</span> Doppler shifts: one when the sound hits the RBC, and another when it reflects back."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20">
               <p className="text-[9px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                 Remember: Velocity is what we want, but Doppler shift is what we measure!
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
