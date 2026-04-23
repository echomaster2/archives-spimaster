import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Waves, Zap, Info, Play, Pause, Activity, Layers, Sparkles, Microwave, Microscope, Wind, Clock, Mic, MicOff } from 'lucide-react';
import * as d3 from 'd3';
import { useHotMic } from '../services/hotMic';

export const PhysicsLab: React.FC<{ topic: string, hotMicEnabled: boolean }> = ({ topic, hotMicEnabled }) => {
  const [frequency, setFrequency] = useState(5); // MHz
  const [amplitude, setAmplitude] = useState(50);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [isHotMicEnabled, setIsHotMicEnabled] = useState(hotMicEnabled);
  const svgRef = useRef<SVGSVGElement>(null);
  const [time, setTime] = useState(0);

  // Sync with global setting
  useEffect(() => {
    setIsHotMicEnabled(hotMicEnabled);
  }, [hotMicEnabled]);

  const { feedback } = useHotMic("Acoustic Physics", { frequency, amplitude }, isHotMicEnabled);

  // Constants
  const propSpeed = 1540; // m/s in soft tissue

  useEffect(() => {
    let animationId: number;
    if (isPlaying) {
      const animate = () => {
        setTime(t => t + 0.1);
        animationId = requestAnimationFrame(animate);
      };
      animate();
    }
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  const waveParams = useMemo(() => {
    const period = (1 / (frequency * 1000000)) * 1000000; // microseconds
    const wavelength = (propSpeed / (frequency * 1000000)) * 1000; // mm
    return { period: period.toFixed(3), wavelength: wavelength.toFixed(3) };
  }, [frequency]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    
    svg.selectAll("*").remove();

    const x = d3.scaleLinear().domain([0, 10]).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([-100, 100]).range([height - margin.bottom, margin.top]);

    const line = d3.line<number>()
      .x((d, i) => x(i / 10))
      .y(d => y(d))
      .curve(d3.curveBasis);

    const g = svg.append("g");

    // Add gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "wave-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#6366f1");
    gradient.append("stop").attr("offset", "50%").attr("stop-color", "#ec4899");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#6366f1");

    const path = g.append("path")
      .attr("fill", "none")
      .attr("stroke", "url(#wave-gradient)")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("filter", "drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))");

    const update = () => {
      const data = d3.range(101).map(i => {
        const xVal = i / 10;
        return Math.sin(xVal * frequency * 1.5 - time) * amplitude;
      });
      path.attr("d", line(data));
    };

    const timer = d3.timer(update);
    return () => timer.stop();
  }, [frequency, amplitude, time]);

  return (
    <div className="glass-panel rounded-[2rem] md:rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl animate-in fade-in duration-1000 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black tracking-tight text-slate-100">Acoustic Field Simulator (D3 Engine)</h3>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Sequence Lab: {topic}</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
           <button 
             onClick={() => setIsHotMicEnabled(!isHotMicEnabled)}
             className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center gap-2 ${isHotMicEnabled ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'bg-white/5 text-slate-500'}`}
           >
             {isHotMicEnabled ? <Mic size={14} /> : <MicOff size={14} />}
             {isHotMicEnabled ? 'Hot-Mic ON' : 'Hot-Mic OFF'}
           </button>
           <button 
             onClick={() => setShowParticles(!showParticles)}
             className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${showParticles ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-slate-500'}`}
           >
             {showParticles ? 'Hide Particles' : 'Show Particles'}
           </button>
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${isPlaying ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-900 text-white'}`}
           >
             {isPlaying ? <Pause size={18} /> : <Play size={18} />}
           </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="lg:col-span-2 relative bg-black rounded-[1.5rem] md:rounded-[2rem] h-64 md:h-80 flex flex-col overflow-hidden border border-white/10 shadow-inner">
            {showParticles && (
              <div className="flex-1 relative overflow-hidden border-b border-white/5 flex items-center bg-slate-950/50">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)]" />
                 {[...Array(40)].map((_, i) => {
                   const xPos = (i / 40) * 100;
                   const shift = Math.sin(xPos * 0.5 + time) * 15;
                   const opacity = 0.2 + Math.cos(xPos * 0.5 + time) * 0.1;
                   return (
                     <div 
                        key={i}
                        className="absolute h-16 md:h-24 w-1 bg-indigo-400/20 rounded-full transition-transform duration-100 blur-[1px]"
                        style={{ 
                          left: `${xPos}%`, 
                          transform: `translateX(${shift}px)`,
                          opacity: opacity
                        }}
                     >
                        <div className="absolute top-0 w-full h-2 bg-indigo-400/40 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.4)]"></div>
                        <div className="absolute bottom-0 w-full h-2 bg-indigo-400/40 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.4)]"></div>
                     </div>
                   );
                 })}
                 <div className="absolute top-4 left-6 text-[7px] md:text-[8px] font-black text-indigo-500/40 uppercase tracking-[0.3em] z-10">Mechanical Longitudinal Particle Motion</div>
              </div>
            )}

            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-950/80">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_100%]" />
                <svg ref={svgRef} viewBox="0 0 800 200" className="w-full h-full preserve-3d" />
                <div className="absolute top-4 left-6 text-[7px] md:text-[8px] font-black text-pink-500/40 uppercase tracking-[0.3em] z-10">Pressure Oscillations (D3 Real-time)</div>
                
                {/* Scanning Line Effect */}
                <motion.div 
                  animate={{ left: ['0%', '100%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-px bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-20"
                />
            </div>
            
            <div className="absolute bottom-4 left-6">
              <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Layers size={10} /> Tissue Environment: Soft Tissue (1540 m/s)
              </span>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="p-5 md:p-6 glass-panel rounded-[1.5rem] md:rounded-3xl border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Frequency (MHz)</label>
                <span className="text-xs md:text-sm font-black text-indigo-400">{frequency} MHz</span>
              </div>
              <input 
                type="range" min="2" max="15" step="0.5" 
                value={frequency} 
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[7px] md:text-[8px] text-slate-500 mt-2 font-bold italic">Increase frequency to reduce wavelength (LARRD improvement).</p>
            </div>

            <div className="p-5 md:p-6 glass-panel rounded-[1.5rem] md:rounded-3xl border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Amplitude (%)</label>
                <span className="text-xs md:text-sm font-black text-pink-400">{amplitude}%</span>
              </div>
              <input 
                type="range" min="5" max="100" 
                value={amplitude} 
                onChange={(e) => setAmplitude(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <p className="text-[7px] md:text-[8px] text-slate-500 mt-2 font-bold italic">Power ∝ Amplitude². Intensity ∝ Amplitude².</p>
            </div>
            
            <div className="p-5 md:p-6 bg-indigo-600/20 rounded-[1.5rem] md:rounded-3xl text-white relative overflow-hidden group border border-indigo-500/30">
                <div className="relative z-10">
                    <p className="text-[8px] md:text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Sparkles size={10}/> Dynamic Analysis
                    </p>
                    <p className="text-[10px] md:text-xs font-medium leading-relaxed italic text-slate-300">
                        {frequency > 10 ? "Superficial resolution at its peak. Limited depth penetration." : "Maximum depth penetration. Sacrificing spatial resolution."}
                    </p>
                </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="p-6 md:p-8 glass-card rounded-[2rem] md:rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-sm">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-indigo-400"><Zap size={80}/></div>
            <p className="text-[8px] md:text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Wavelength (λ)</p>
            <p className="text-2xl md:text-3xl font-black text-slate-100 tracking-tighter">{waveParams.wavelength} mm</p>
            <p className="text-[9px] md:text-[10px] font-bold text-indigo-400 mt-3 flex items-center gap-2"><Wind size={12}/> λ = 1.54 / f</p>
          </div>
          
          <div className="p-6 md:p-8 glass-card rounded-[2rem] md:rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-sm">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-purple-400"><Activity size={80}/></div>
            <p className="text-[8px] md:text-[9px] font-black text-purple-400 uppercase tracking-widest mb-2">Period (T)</p>
            <p className="text-2xl md:text-3xl font-black text-slate-100 tracking-tighter">{waveParams.period} µs</p>
            <p className="text-[9px] md:text-[10px] font-bold text-purple-400 mt-3 flex items-center gap-2"><Clock size={12}/> T = 1 / f</p>
          </div>

          <div className="p-6 md:p-8 glass-card rounded-[2rem] md:rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-sm">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-emerald-400"><Microwave size={80}/></div>
            <p className="text-[8px] md:text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">Registry Type</p>
            <p className="text-2xl md:text-3xl font-black text-slate-100 tracking-tighter">Ultrasound</p>
            <p className="text-[9px] md:text-[10px] font-bold text-emerald-400 mt-3">Mechanical Energy</p>
          </div>
        </div>
      </div>
    </div>
  );
};