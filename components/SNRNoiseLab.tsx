
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Activity, Zap, Shield, Sliders, Info, Sparkles, AlertCircle, BarChart3 } from 'lucide-react';

export const SNRNoiseLab: React.FC = () => {
  const [outputPower, setOutputPower] = useState(30); // %
  const [receiverGain, setReceiverGain] = useState(50); // %
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stats = useMemo(() => {
    // Logic: Output power increases signal strength relative to noise floor.
    // Receiver gain multiplies both.
    const baseNoise = 15;
    const signalStrength = (outputPower / 100) * 100;
    const effectiveNoise = baseNoise;
    
    const snr = signalStrength / effectiveNoise;
    
    return {
      snr: snr.toFixed(1),
      status: snr > 4 ? 'High Quality' : snr > 2 ? 'Fair' : 'Poor (Noise Dominant)',
      signalLevel: (signalStrength * (receiverGain / 50)).toFixed(0),
      noiseLevel: (effectiveNoise * (receiverGain / 50)).toFixed(0)
    };
  }, [outputPower, receiverGain]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const midY = canvas.height / 2;
      const gainFactor = receiverGain / 50;
      const sigAmp = (outputPower / 100) * 80 * gainFactor;
      const noiseAmp = 15 * gainFactor;

      // Draw Signal (Sine Wave)
      ctx.beginPath();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      for (let x = 0; x < canvas.width; x++) {
        const y = midY + Math.sin((x + offset) * 0.05) * sigAmp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Noise (Random Jitter)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 2) {
        const noiseY = (Math.random() - 0.5) * noiseAmp * 2;
        const sigY = midY + Math.sin((x + offset) * 0.05) * sigAmp;
        const y = sigY + noiseY;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      offset += 2;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [outputPower, receiverGain]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Activity size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">SNR & Noise Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Signal-to-Noise Ratio Dynamics</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">SNR Ratio</span>
              <span className={`text-xl font-black ${parseFloat(stats.snr) < 2 ? 'text-rose-500' : 'text-emerald-400'}`}>
                {stats.snr}:1
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Image Clarity</span>
              <span className="text-xl font-black text-indigo-400 uppercase tracking-tighter text-xs">{stats.status}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Oscilloscope View */}
            <div className="bg-black rounded-[2.5rem] h-64 relative overflow-hidden border-4 border-slate-700 shadow-inner group">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <canvas ref={canvasRef} width={600} height={256} className="w-full h-full" />
              
              <div className="absolute top-4 left-6 flex items-center gap-2">
                 <Zap size={12} className="text-indigo-400 animate-pulse"/>
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">RF Signal Processing</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Zap size={12} className="text-amber-500"/> Output Power
                   </label>
                   <span className="text-xs font-black">{outputPower}%</span>
                </div>
                <input 
                  type="range" min="5" max="100"
                  value={outputPower}
                  onChange={(e) => setOutputPower(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Sliders size={12} className="text-indigo-400"/> Receiver Gain
                   </label>
                   <span className="text-xs font-black">{receiverGain}%</span>
                </div>
                <input 
                  type="range" min="0" max="100"
                  value={receiverGain}
                  onChange={(e) => setReceiverGain(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
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
                  <h4 className="text-xl font-black tracking-tight">The Registry Golden Rule</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Output power increases the <span className="text-white font-bold underline">signal-to-noise ratio</span>. Receiver gain increases both signal and noise equally, meaning SNR remains <span className="text-white font-bold underline">unchanged</span>.
               </p>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-400 uppercase">Signal Level</span>
                    <span className="text-xs font-bold text-white">{stats.signalLevel} units</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase">Noise Floor</span>
                    <span className="text-xs font-bold text-white">{stats.noiseLevel} units</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Bioeffects Note</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "While Output Power improves SNR, it also increases patient exposure. Always try to optimize Gain first if SNR is sufficient."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
