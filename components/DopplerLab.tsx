
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Zap, Target, Activity, Info, Sparkles, ArrowRight, RotateCw, Mic, MicOff } from 'lucide-react';
import * as d3 from 'd3';
import { useHotMic } from '../services/hotMic';

export const DopplerLab: React.FC<{ hotMicEnabled: boolean }> = ({ hotMicEnabled }) => {
  const [angle, setAngle] = useState(60); // degrees
  const [velocity, setVelocity] = useState(100); // cm/s
  const [prf, setPrf] = useState(5); // kHz (Nyquist = 2.5kHz)
  const [isHotMicEnabled, setIsHotMicEnabled] = useState(hotMicEnabled);

  // Sync with global setting
  useEffect(() => {
    setIsHotMicEnabled(hotMicEnabled);
  }, [hotMicEnabled]);
  const transmitFreq = 5; // MHz
  const svgRef = useRef<SVGSVGElement>(null);

  const { feedback } = useHotMic("Doppler Physics", { angle, velocity, prf }, isHotMicEnabled);

  const dopplerData = useMemo(() => {
    // Doppler Equation: fd = (2 * v * fo * cos(theta)) / c
    // c = 154000 cm/s
    const cosTheta = Math.cos(angle * (Math.PI / 180));
    const shift = (2 * velocity * (transmitFreq * 1000000) * cosTheta) / 154000;
    const shiftKHz = shift / 1000;
    const nyquist = prf / 2;
    const isAliasing = Math.abs(shiftKHz) > nyquist;

    return {
      shift: shiftKHz.toFixed(2),
      shiftNum: shiftKHz,
      cosValue: cosTheta,
      cosText: cosTheta.toFixed(2),
      isAliasing,
      accuracy: Math.abs(cosTheta * 100).toFixed(0)
    };
  }, [angle, velocity, prf]);

  // D3 Spectral Display
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 150;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };

    svg.selectAll("*").remove();

    const x = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([-prf, prf]).range([height - margin.bottom, margin.top]);

    // Axes
    const xAxis = d3.axisBottom(x).ticks(0);
    const yAxis = d3.axisLeft(y).ticks(5).tickFormat(d => `${d}k`);

    svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(xAxis).attr("color", "rgba(255,255,255,0.2)");
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis).attr("color", "rgba(255,255,255,0.2)");

    // Baseline
    svg.append("line")
      .attr("x1", margin.left)
      .attr("y1", y(0))
      .attr("x2", width - margin.right)
      .attr("y2", y(0))
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-width", 2);

    // Spectrum
    const spectrum = svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#fb7185") // rose-400
      .attr("stroke-width", 2);

    let spectralPoints: {x: number, y: number}[] = [];
    let timeStep = 0;

    const update = () => {
      timeStep++;
      const currentShift = dopplerData.shiftNum;
      
      // Handle aliasing visually
      let displayShift = currentShift;
      if (Math.abs(currentShift) > prf) {
        // Simple wrap-around for aliasing
        displayShift = ((currentShift + prf) % (2 * prf)) - prf;
      }

      spectralPoints.push({ x: timeStep % 100, y: displayShift });
      if (spectralPoints.length > 102) spectralPoints.shift();

      const line = d3.line<{x: number, y: number}>()
        .x(d => x(d.x))
        .y(d => y(d.y))
        .curve(d3.curveBasis);

      // Sort points for drawing if we hit the wrap-around
      const sortedPoints = [...spectralPoints].sort((a,b) => a.x - b.x);
      
      spectrum.attr("d", line(sortedPoints));
    };

    const timer = d3.timer(update);
    return () => timer.stop();
  }, [dopplerData, prf]);

  return (
    <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-1000 overflow-hidden relative border border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.1)_0%,transparent_60%)]" />
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <TrendingUp size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-rose-500" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Spectral Doppler Lab (D3 Simulator)</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Angle, Shift & Nyquist Dynamics</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsHotMicEnabled(!isHotMicEnabled)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center gap-2 ${isHotMicEnabled ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'bg-white/5 text-slate-500'}`}
            >
                {isHotMicEnabled ? <Mic size={14} /> : <MicOff size={14} />}
                {isHotMicEnabled ? 'AI Feedback ON' : 'AI Feedback OFF'}
            </button>
            <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Doppler Shift</span>
              <span className={`text-xl font-black ${dopplerData.isAliasing ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                {dopplerData.shift} kHz
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Cos(θ) Impact</span>
              <span className="text-xl font-black text-indigo-400">{dopplerData.cosText}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Doppler Simulation */}
            <div className="bg-slate-900 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-800 shadow-inner group flex flex-col">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_100%]" />
              
              {/* Blood Vessel Section */}
              <div className="h-1/2 relative flex items-center justify-center p-8">
                <div className="w-full h-12 bg-slate-950/80 border-y-2 border-white/10 relative flex items-center overflow-hidden shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                    <div className="flex gap-12 animate-infinite-scroll">
                    {[...Array(15)].map((_, i) => (
                        <motion.div 
                        key={i} 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                        className="w-5 h-5 rounded-full bg-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.6)]" 
                        />
                    ))}
                    </div>
                </div>

                {/* Transducer Beam */}
                <motion.div 
                    className="absolute top-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 via-indigo-500/40 to-transparent origin-top shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    animate={{ rotate: angle - 90 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <div className="absolute -top-6 -left-6 w-14 h-8 bg-slate-400 rounded-lg border-b-4 border-indigo-600 shadow-2xl flex items-center justify-center">
                    <span className="text-[8px] font-black text-slate-800">5MHz</span>
                    </div>
                </motion.div>
              </div>

              {/* D3 Spectral Display Section */}
              <div className="h-1/2 bg-black/40 border-t border-white/10 p-4 relative">
                <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 600 150" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[7px] font-black uppercase text-slate-500 tracking-widest">Spectral Envelope Analysis</div>
              </div>

              {/* Angle Label */}
              <div className="absolute bottom-4 left-4 bg-slate-900/80 px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400 z-20">
                Current Angle: {angle}°
              </div>

              {dopplerData.isAliasing && (
                <div className="absolute top-4 right-4 bg-rose-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase animate-bounce flex items-center gap-2 shadow-xl z-20">
                  <RotateCw size={10} /> Aliasing Detected
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Insonation Angle</label>
                   <span className="text-xs font-black text-indigo-400">{angle}°</span>
                </div>
                <input 
                  type="range" min="0" max="90" step="1"
                  value={angle}
                  onChange={(e) => setAngle(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PRF (Scale)</label>
                   <span className="text-xs font-black text-rose-400">{prf} kHz</span>
                </div>
                <input 
                  type="range" min="1" max="15" step="0.5"
                  value={prf}
                  onChange={(e) => setPrf(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Target size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The 60° Rule</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Physics dictates that as the angle increases, the Doppler shift decreases. At 90°, the shift is <span className="text-indigo-400 font-bold">ZERO</span> because cos(90) = 0.
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                    <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Velocity Accuracy</span>
                    <span className="text-xl font-black">{dopplerData.accuracy}%</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                    <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Best Accuracy at</span>
                    <span className="text-xl font-black">0°</span>
                  </div>
               </div>
            </div>

            <div className="bg-rose-950/20 rounded-[2.5rem] p-8 border border-rose-500/20 shadow-2xl shadow-rose-900/10">
               <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="text-rose-400" size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Registry Pro Tip: Nyquist</h4>
               </div>
               <p className="text-xs font-medium text-rose-100/70 leading-relaxed">
                 Aliasing occurs when the Doppler shift exceeds <span className="text-rose-400 font-black italic">PRF / 2</span>. 
                 <span className="block mt-2 font-black italic">Fixes: Increase PRF, lower frequency, or move baseline.</span>
               </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
