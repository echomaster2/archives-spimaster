
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Info, Zap, Target, Activity, Sliders, AlertTriangle } from 'lucide-react';

export const ArtifactSandbox: React.FC = () => {
  const [prf, setPrf] = useState(50); // Velocity Scale
  const [depth, setDepth] = useState(50);
  const [frequency, setFrequency] = useState(50);
  const [artifactType, setArtifactType] = useState<'aliasing' | 'reverberation' | 'mirror'>('aliasing');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      if (artifactType === 'aliasing') {
        renderAliasing(ctx, canvas);
      } else if (artifactType === 'reverberation') {
        renderReverberation(ctx, canvas);
      } else if (artifactType === 'mirror') {
        renderMirror(ctx, canvas);
      }

      animationId = requestAnimationFrame(render);
    };

    const renderAliasing = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now() / 1000;
      
      // Spectral Display Background
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

      const baseline = centerY;
      const nyquist = prf * 1.5; // PRF determines the height of the display
      const signalFreq = 80; // High velocity blood
      
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 50; x < canvas.width - 50; x++) {
        let yShift = Math.sin(x * 0.05 + time * 5) * signalFreq;
        
        // ALIASING LOGIC
        if (Math.abs(yShift) > nyquist) {
           // Wrap around
           if (yShift > nyquist) yShift = -nyquist + (yShift - nyquist);
           else if (yShift < -nyquist) yShift = nyquist + (yShift + nyquist);
        }

        const y = baseline - yShift;
        if (x === 50) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Nyquist Limits
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(244,63,94,0.5)';
      ctx.beginPath(); ctx.moveTo(50, baseline - nyquist); ctx.lineTo(canvas.width - 50, baseline - nyquist); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(50, baseline + nyquist); ctx.lineTo(canvas.width - 50, baseline + nyquist); ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = 'rgba(244,63,94,0.8)';
      ctx.font = '10px Inter';
      ctx.fillText(`NYQUIST LIMIT: ${Math.round(nyquist)}`, 60, baseline - nyquist - 5);
    };

    const renderReverberation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const centerX = canvas.width / 2;
      const reflectorY = depth + 50;
      
      // True Reflector
      ctx.fillStyle = '#fff';
      ctx.fillRect(centerX - 50, reflectorY, 100, 4);
      
      // Reverberations
      const spacing = reflectorY - 20; // 20 is transducer surface
      for (let i = 1; i < 6; i++) {
        const y = reflectorY + i * spacing;
        if (y < canvas.height - 20) {
          ctx.fillStyle = `rgba(255,255,255,${0.8 / (i + 1)})`;
          ctx.fillRect(centerX - 50, y, 100, 2);
        }
      }

      ctx.fillStyle = '#6366f1';
      ctx.font = '10px Inter';
      ctx.fillText("TRUE REFLECTOR", centerX + 60, reflectorY + 5);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText("ARTIFACT ECHOES", centerX + 60, reflectorY + spacing + 5);
    };

    const renderMirror = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const centerX = canvas.width / 2;
        const mirrorY = 200;
        
        // Curved Mirror (Diaphragm)
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, mirrorY + 100, 150, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();

        // Real Object
        const objY = mirrorY - 50;
        const objX = centerX - 60;
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(objX, objY, 15, 0, Math.PI * 2); ctx.fill();

        // Mirror Image
        const mirY = mirrorY + 50;
        const mirX = centerX - 60;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.beginPath(); ctx.arc(mirX, mirY, 15, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '10px Inter';
        ctx.fillText("DIAPHRAGM (MIRROR)", centerX + 60, mirrorY - 20);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [prf, depth, frequency, artifactType]);

  return (
    <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative border border-white/5 overflow-hidden">
      <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
      
      <div className="relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <div className="flex items-center gap-3">
                <Sparkles className="text-amber-500" size={24} />
                <h3 className="text-2xl font-black uppercase italic tracking-widest">Artifact Sandbox</h3>
             </div>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Break Physics. Understand Mastery.</p>
          </div>
          <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10">
            {(['aliasing', 'reverberation', 'mirror'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setArtifactType(t)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  artifactType === t ? 'bg-amber-500 text-white shadow-xl' : 'text-slate-500 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
           <div className="space-y-8">
              <div className="bg-black/60 rounded-[2.5rem] p-4 border border-white/10 relative h-[400px]">
                 <canvas ref={canvasRef} width={600} height={400} className="w-full h-full rounded-2xl" />
                 
                 <div className="absolute top-8 left-8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Simulation</span>
                 </div>
              </div>

              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6">
                 <h4 className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                    <Sliders size={14} /> Control Parameters
                 </h4>
                 
                 <div className="space-y-6">
                    {artifactType === 'aliasing' && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>Pulse Repetition Frequency (PRF) / Scale</span>
                          <span className="text-white">{prf} kHz</span>
                        </div>
                        <input 
                          type="range" min="10" max="100" value={prf}
                          onChange={(e) => setPrf(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <p className="text-[10px] text-slate-500 font-bold italic">Decrease PRF to CAUSE aliasing. Increase to RESOLVE it.</p>
                      </div>
                    )}

                    {(artifactType === 'reverberation' || artifactType === 'mirror') && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>Reflector Depth</span>
                          <span className="text-white">{depth} mm</span>
                        </div>
                        <input 
                          type="range" min="20" max="150" value={depth}
                          onChange={(e) => setDepth(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    )}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="p-10 bg-amber-500 text-slate-950 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-700">
                    <AlertTriangle size={120} />
                 </div>
                 <div className="relative z-10 space-y-4">
                    <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">The Artifact Challenge</h4>
                    <p className="text-sm font-black opacity-80 leading-relaxed uppercase">
                      {artifactType === 'aliasing' && "Observe how the wave 'wraps around' once the peak velocity crosses the Nyquist limit dashed line."}
                      {artifactType === 'reverberation' && "See how multiple false echoes appear at deeper intervals when the primary reflector is strong."}
                      {artifactType === 'mirror' && "A strong curved surface (diaphragm) creates a false second image on the opposite side."}
                    </p>
                    <div className="pt-4 border-t border-slate-950/20">
                       <p className="text-[10px] font-black uppercase tracking-widest mb-1">Assumption Broken</p>
                       <p className="text-lg font-black italic">
                          {artifactType === 'aliasing' && "PRF is too low for current velocity."}
                          {artifactType === 'reverberation' && "Sound travels directly to and back."}
                          {artifactType === 'mirror' && "Sound travels in a straight line."}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex gap-4">
                 <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500 shrink-0">
                    <Info size={24} />
                 </div>
                 <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">Registry Focus</h5>
                    <p className="text-xs font-bold text-slate-400 italic leading-relaxed">
                      "Examiners love to ask how to RESOLVE these. For Aliasing, remember: Scale Up, Frequency Down, Depth Down."
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
