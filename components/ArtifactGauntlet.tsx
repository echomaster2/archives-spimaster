
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Zap, Filter, Target, RotateCcw, CheckCircle, AlertTriangle, Sparkles, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { NeuralPreceptor } from './NeuralPreceptor';

interface Level {
  id: number;
  name: string;
  description: string;
  targetGain: number;
  targetTgc: number; // 0-100, represent middle slider
  targetFocus: number; // 0-100, represent depth
  noiseIntensity: number;
}

const LEVELS: Level[] = [
  {
    id: 1,
    name: "The Fog of Near-Field",
    description: "The image is washed out by excessive near-field gain. Balance the signal to reveal the cyst.",
    targetGain: 40,
    targetTgc: 30,
    targetFocus: 40,
    noiseIntensity: 0.8
  },
  {
    id: 2,
    name: "Deep Sitter Shadowing",
    description: "A deep structure is hidden in the dark. Boost TGC at the bottom without over-saturating the top.",
    targetGain: 60,
    targetTgc: 80,
    targetFocus: 75,
    noiseIntensity: 1.2
  },
  {
    id: 3,
    name: "The Focal Point Pinpoint",
    description: "The lateral resolution is failing. Align the focus exactly with the target lesion.",
    targetGain: 50,
    targetTgc: 50,
    targetFocus: 60,
    noiseIntensity: 1.5
  }
];

export const ArtifactGauntlet: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gain, setGain] = useState(80);
  const [tgc, setTgc] = useState(20);
  const [focus, setFocus] = useState(10);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPreceptorOpen, setIsPreceptorOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentLevel = LEVELS[currentLevelIdx];

  // Logic to determine "Closeness" to target
  const score = useMemo(() => {
    const gainDiff = Math.abs(gain - currentLevel.targetGain);
    const tgcDiff = Math.abs(tgc - currentLevel.targetTgc);
    const focusDiff = Math.abs(focus - currentLevel.targetFocus);
    
    // Weighted accuracy
    const accuracy = 100 - (gainDiff * 0.4 + tgcDiff * 0.4 + focusDiff * 0.2);
    return Math.max(0, accuracy);
  }, [gain, tgc, focus, currentLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      ctx.fillStyle = '#020617'; // slate-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw "Anatomy"
      // Target Lesion (A simple circle)
      const targetY = (currentLevel.targetFocus / 100) * canvas.height;
      const targetX = canvas.width / 2;
      
      // The lesion becomes clearer as parameters align
      const visibility = Math.pow(score / 100, 3);
      
      // Draw Noise
      const noise = (100 - score) / 100 * (currentLevel.noiseIntensity * 50);
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const alpha = Math.random() * (noise / 50);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(x, y, 1, 1);
      }

      // Draw TGC Gradient (Visualizing the gain across depth)
      const tgcGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      tgcGradient.addColorStop(0, `rgba(99, 102, 241, ${gain / 500})`);
      tgcGradient.addColorStop(1, `rgba(99, 102, 241, ${(gain + tgc) / 500})`);
      ctx.fillStyle = tgcGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the Lesion
      ctx.beginPath();
      ctx.arc(targetX, targetY, 20 + (100 - score) / 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + visibility * 0.6})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Focus Marker
      const focusY = (focus / 100) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, focusY);
      ctx.lineTo(20, focusY);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [score, gain, tgc, focus, currentLevel]);

  const handleCheck = () => {
    if (score > 90) {
      setIsSuccess(true);
      toast.success("Artifact neutralized! Crystal-clear imaging achieved.");
    } else {
      toast.error("Signal-to-noise ratio insufficient. Adjust your knobs.");
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setIsSuccess(false);
      // Reset knobs for next challenge
      setGain(80);
      setTgc(20);
      setFocus(10);
    } else {
      toast.info("Gauntlet Completed! You are a Master of Knobology.");
    }
  };

  return (
    <div className="bg-slate-950 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12 relative">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <ShieldAlert size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400">
                <ShieldAlert size={24} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">The Artifact Gauntlet</h2>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{currentLevel.name}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-3">Score</span>
                <span className={`text-lg font-black ${score > 90 ? 'text-emerald-400' : score > 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {Math.round(score)}%
                </span>
            </div>
            <button 
              onClick={() => { setGain(80); setTgc(20); setFocus(10); }}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-400"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* The Simulation Monitor */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-black rounded-[2rem] overflow-hidden border-4 border-slate-900 shadow-2xl h-[400px]">
                    <canvas 
                        ref={canvasRef} 
                        width={600} 
                        height={400} 
                        className="w-full h-full"
                    />
                    
                    {/* UI Overlays */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className="bg-black/60 backdrop-blur px-3 py-1 rounded border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">
                            FREQ: 12 MHz
                        </div>
                        <div className="bg-black/60 backdrop-blur px-3 py-1 rounded border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">
                            DEPTH: 4.0 CM
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 text-[10px] font-black uppercase text-indigo-400/40 tracking-[0.5em] rotate-90 origin-bottom-right">
                        SONO-OS V2.4
                    </div>

                    <AnimatePresence>
                        {isSuccess && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center"
                            >
                                <div className="text-center p-8 bg-slate-900 rounded-[2.5rem] border border-emerald-500/50 shadow-2xl">
                                    <CheckCircle size={60} className="text-emerald-400 mx-auto mb-4" />
                                    <h4 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">Diagnostic Match!</h4>
                                    <p className="text-slate-400 text-xs mb-6 max-w-[200px] mx-auto">You've successfully cleared the artifacts and isolated the pathology.</p>
                                    <button 
                                        onClick={nextLevel}
                                        className="px-8 py-3 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-3 mx-auto shadow-lg"
                                    >
                                        Next Challenge <Zap size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* The Console Knobs */}
            <div className="space-y-8">
                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <Zap size={12} /> Knobology Controls
                    </h4>

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Gain</label>
                                <span className="text-xs font-black text-white">{gain}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" 
                                value={gain} 
                                onChange={(e) => setGain(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TGC (Mid-Field)</label>
                                <span className="text-xs font-black text-white">{tgc}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" 
                                value={tgc} 
                                onChange={(e) => setTgc(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Focal Zone</label>
                                <span className="text-xs font-black text-white">{focus}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" 
                                value={focus} 
                                onChange={(e) => setFocus(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                      <button 
                          onClick={handleCheck}
                          className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-900/40"
                      >
                          Acquire Image <Target size={20} />
                      </button>
                      <button 
                          onClick={() => setIsPreceptorOpen(true)}
                          className="p-5 bg-emerald-600/10 border border-emerald-600/30 text-emerald-500 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-xl group"
                        >
                          <Brain size={24} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-indigo-600/10 rounded-[2rem] border border-indigo-500/20 flex gap-4 items-center">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 shrink-0">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Clinic Briefing</h5>
                        <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
                            "{currentLevel.description}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <NeuralPreceptor 
        isOpen={isPreceptorOpen} 
        onClose={() => setIsPreceptorOpen(false)} 
        context={`Artifact Gauntlet Simulation. Current Level: ${currentLevel.name}. Description: ${currentLevel.description}. User is struggling with knobology settings for Gain, TGC, and Focus.`}
        initialMessage={`Neural link established. I'm HARVEY. You're analyzing ${currentLevel.name}. The artifact logic here is tricky. Do you need a deep dive on the physics of ${currentLevel.name}, or a tactical hint for the knobs?`}
      />
    </div>
  );
};
