
import React, { useState, useMemo } from 'react';
import { Waves, Zap, Target, Activity, Info, Sparkles, Filter, Shield, MessageSquare } from 'lucide-react';
import { NeuralPreceptor } from './NeuralPreceptor';

export const HarmonicsLab: React.FC = () => {
  const [fundamentalFreq, setFundamentalFreq] = useState(2.0); // MHz
  const [depth, setDepth] = useState(50); // Relative depth factor
  const [showHarmonic, setShowHarmonic] = useState(true);
  const [isPreceptorOpen, setIsPreceptorOpen] = useState(false);

  const harmonicFreq = fundamentalFreq * 2;

  const generateWavePath = (isHarmonic: boolean) => {
    const points = [];
    const steps = 150;
    const width = 800;
    const height = 150;
    const freq = isHarmonic ? harmonicFreq : fundamentalFreq;
    const amp = isHarmonic ? 25 : 50;
    
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      // Non-linear lean simulation: wave "leans" more with depth (x)
      const phase = (x * 0.05);
      const lean = (depth / 1000) * Math.sin(phase);
      const y = height / 2 + Math.sin(phase * freq + (isHarmonic ? 0 : lean)) * amp;
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Sparkles size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Filter className="text-pink-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Harmonic Imaging Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Non-Linear Propagation Simulator</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPreceptorOpen(true)}
              className="px-6 py-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl text-pink-400 font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 hover:text-white transition-all flex items-center gap-3"
            >
              <MessageSquare size={16} /> Consult Harvey
            </button>
            <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Fundamental</span>
              <span className="text-xl font-black text-indigo-400">{fundamentalFreq} MHz</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Harmonic (2nd)</span>
              <span className="text-xl font-black text-pink-400">{harmonicFreq} MHz</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Wave Comparison */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner p-8 flex flex-col justify-around">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                   <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Fundamental Signal</span>
                </div>
                <svg viewBox="0 0 800 150" className="w-full h-24 overflow-visible">
                  <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={generateWavePath(false)} />
                </svg>
              </div>

              <div className={`space-y-2 transition-opacity duration-500 ${showHarmonic ? 'opacity-100' : 'opacity-20'}`}>
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                   <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Harmonic Signal (Twice Fundamental)</span>
                </div>
                <svg viewBox="0 0 800 150" className="w-full h-24 overflow-visible">
                  <polyline fill="none" stroke="#ec4899" strokeWidth="3" points={generateWavePath(true)} />
                </svg>
              </div>
              
              <div className="absolute top-4 right-6 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                Real-time Distortion Model
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transmit Freq</label>
                   <span className="text-xs font-black text-indigo-400">{fundamentalFreq} MHz</span>
                </div>
                <input 
                  type="range" min="1.5" max="5" step="0.1"
                  value={fundamentalFreq}
                  onChange={(e) => setFundamentalFreq(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tissue Depth</label>
                   <span className="text-xs font-black text-pink-400">{depth}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5"
                  value={depth}
                  onChange={(e) => setDepth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-pink-500/10 to-transparent rounded-[2.5rem] border border-pink-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-pink-600 rounded-xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Non-Linear Behavior</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Sound crests travel <span className="text-white font-bold underline">faster</span> than troughs in tissue. This tiny speed difference causes wave distortion, creating harmonics.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2 text-center">The "Sweet Spot"</p>
                  <p className="text-xs text-slate-300 leading-relaxed text-center italic">
                    Tissue harmonics are best in the <span className="text-pink-400 font-bold">Mid-Field</span>. They don't exist in the near field and attenuate in the far field.
                  </p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-indigo-500/20 rounded-2xl">
                <Shield size={24} className="text-indigo-400" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Registry Advantage</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Harmonics travel only in the <span className="text-white">center</span> of the beam, effectively removing side-lobes and artifactual noise from the image.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <NeuralPreceptor 
        isOpen={isPreceptorOpen} 
        onClose={() => setIsPreceptorOpen(false)}
        context={JSON.stringify({
          labId: 'harmonics',
          topic: 'Waves & Propagation: Harmonics',
          fundamentalFreq,
          harmonicFreq,
          tissueDepth: depth
        })}
      />
    </div>
  );
};
