
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Activity, Zap, Target, Layers, Info, Sparkles, MoveVertical, Maximize2 } from 'lucide-react';

export const SampleVolumeLab: React.FC = () => {
  const [gateSize, setGateSize] = useState(2); // mm
  const [gateDepth, setGateDepth] = useState(50); // % from top of vessel
  const [isTurbulent, setIsTurbulent] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const spectrumData = useMemo(() => {
    // Parabolic flow: Velocity is highest in center (50%), lowest at walls (0%, 100%)
    // v(r) = v_max * (1 - (r/R)^2)
    const normalizedPos = Math.abs(gateDepth - 50) / 50; // 0 at center, 1 at walls
    const centerVelocity = 100;
    const velocityAtGate = centerVelocity * (1 - Math.pow(normalizedPos, 2));
    
    // Spectral Broadening: Wider gate = more velocity samples = thicker spectral line
    // Near walls = higher shear = more velocity samples = thicker spectral line
    const broadening = (gateSize * 5) + (normalizedPos * 40) + (isTurbulent ? 50 : 0);
    
    return {
      peakVel: velocityAtGate.toFixed(0),
      broadening: Math.round(broadening),
      status: broadening > 40 ? 'Spectral Broadening' : 'Clean Spectral Window'
    };
  }, [gateSize, gateDepth, isTurbulent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Baseline
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 40);
      ctx.lineTo(canvas.width, canvas.height - 40);
      ctx.stroke();

      // Draw Spectral Trace
      ctx.fillStyle = '#10b981';
      const peak = parseFloat(spectrumData.peakVel) * 1.5;
      const width = spectrumData.broadening;

      for (let x = 0; x < canvas.width; x += 4) {
        const time = (x + offset) * 0.05;
        const wave = Math.abs(Math.sin(time)) * peak + (Math.random() * 5);
        
        // Gradient for broadening
        const grad = ctx.createLinearGradient(0, canvas.height - 40 - wave, 0, canvas.height - 40 - wave + width);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - 40 - wave, 3, width);
      }

      offset += 2;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [spectrumData]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Activity size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Layers className="text-emerald-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Sample Volume Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Pulsed Doppler Gate & Spectral Window</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Spectral Envelope</span>
              <span className={`text-xl font-black ${spectrumData.broadening > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {spectrumData.status}
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Peak Velocity</span>
              <span className="text-xl font-black text-indigo-400">{spectrumData.peakVel} cm/s</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {/* Vessel Cross Section */}
            <div className="bg-slate-800 rounded-[2.5rem] h-48 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              <div className="w-full h-24 bg-rose-950/20 relative rounded-full border-y-4 border-white/5 overflow-hidden">
                {/* Parabolic Flow Visualization */}
                <div className="absolute inset-0 flex flex-col justify-around py-2">
                  {[...Array(5)].map((_, i) => {
                    const distFromCenter = Math.abs(i - 2);
                    const speed = 1 - (distFromCenter * 0.3);
                    return (
                      <div 
                        key={i} 
                        className="h-1 bg-rose-500/30 rounded-full"
                        style={{ 
                          width: '120%', 
                          animation: `slide ${1 / speed}s linear infinite`,
                          marginLeft: '-10%'
                        }}
                      />
                    );
                  })}
                </div>

                {/* The Doppler Gate */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 border-x-2 border-indigo-400 transition-all duration-300 z-30"
                  style={{ 
                    top: `${gateDepth}%`, 
                    height: `${gateSize * 10}%`,
                    marginTop: `-${(gateSize * 10) / 2}%`
                  }}
                >
                  <div className="absolute -top-1 -left-1 -right-1 h-0.5 bg-indigo-400"></div>
                  <div className="absolute -bottom-1 -left-1 -right-1 h-0.5 bg-indigo-400"></div>
                  <div className="absolute inset-0 bg-indigo-400/20 animate-pulse"></div>
                </div>
              </div>
              
              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Gate: {gateSize}mm @ {gateDepth}% Depth
              </div>
            </div>

            {/* Spectral Waveform */}
            <div className="bg-black rounded-[2.5rem] h-64 relative overflow-hidden border-4 border-slate-800 shadow-2xl">
               <canvas ref={canvasRef} width={500} height={256} className="w-full h-full" />
               <div className="absolute top-4 right-6 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                 Spectral Trace (FFT Analysis)
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gate Size</label>
                   <span className="text-xs font-black text-indigo-400">{gateSize} mm</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="0.5"
                  value={gateSize}
                  onChange={(e) => setGateSize(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gate Position</label>
                   <span className="text-xs font-black text-emerald-400">{gateDepth}%</span>
                </div>
                <input 
                  type="range" min="10" max="90" step="1"
                  value={gateDepth}
                  onChange={(e) => setGateDepth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Maximize2 size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Spectral Broadening</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 When the sample volume is too large or placed near a vessel wall, it picks up many <span className="text-white font-bold">different velocities</span>. This fills in the "spectral window."
               </p>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-emerald-400 uppercase">Small Gate @ Center</span>
                    <span className="text-xs font-bold text-white">Clean Window</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase">Large Gate or Stenosis</span>
                    <span className="text-xs font-bold text-white">Broadening</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "Pulsed Doppler has the ability to select the EXACT location of velocity measurement, called Range Resolution."
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsTurbulent(!isTurbulent)}
              className={`w-full py-5 rounded-[2rem] border-2 font-black uppercase tracking-widest text-[10px] transition-all ${
                isTurbulent ? 'bg-rose-600 border-rose-500 text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            >
              Simulate Post-Stenotic Turbulence
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slide {
          from { transform: translateX(-10%); }
          to { transform: translateX(40%); }
        }
      `}</style>
    </div>
  );
};
