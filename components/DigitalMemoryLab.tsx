
import React, { useState, useMemo } from 'react';
import { Cpu, Grid, Zap, Layers, Info, Sparkles, BarChart3, Database, MessageSquare } from 'lucide-react';
import { NeuralPreceptor } from './NeuralPreceptor';

export const DigitalMemoryLab: React.FC = () => {
  const [bits, setBits] = useState(3);
  const [pixelDensity, setPixelDensity] = useState(10); // 10x10 grid
  const [isPreceptorOpen, setIsPreceptorOpen] = useState(false);

  const memoryData = useMemo(() => {
    const shades = Math.pow(2, bits);
    return {
      shades,
      bitsNeeded: bits,
      contrastRes: shades > 64 ? 'High' : 'Low'
    };
  }, [bits]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Database size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Grid className="text-cyan-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Digital Memory Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Bits, Pixels & Contrast Dynamics</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPreceptorOpen(true)}
              className="px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-3"
            >
              <MessageSquare size={16} /> Consult Harvey
            </button>
            <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
              <div className="text-center">
                <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Gray Shades</span>
                <span className="text-xl font-black text-cyan-400">{memoryData.shades}</span>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center">
                <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Contrast Res</span>
                <span className={`text-xl font-black ${bits >= 6 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {memoryData.contrastRes}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Grid Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8">
              <div 
                className="grid gap-px w-full h-full"
                style={{ 
                  gridTemplateColumns: `repeat(${pixelDensity}, 1fr)`,
                  gridTemplateRows: `repeat(${pixelDensity}, 1fr)`
                }}
              >
                {[...Array(pixelDensity * pixelDensity)].map((_, i) => {
                  // Random gray based on bits
                  const shadeIdx = Math.floor(Math.random() * memoryData.shades);
                  const intensity = (shadeIdx / (memoryData.shades - 1)) * 255;
                  return (
                    <div 
                      key={i} 
                      className="w-full h-full transition-colors duration-500"
                      style={{ backgroundColor: `rgb(${intensity}, ${intensity}, ${intensity})` }}
                    />
                  );
                })}
              </div>
              
              <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-cyan-400">
                Pixel Matrix: {pixelDensity} x {pixelDensity}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Number of Bits</label>
                   <span className="text-xs font-black text-cyan-400">{bits} Bits</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="1"
                  value={bits}
                  onChange={(e) => setBits(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pixel Density</label>
                   <span className="text-xs font-black text-indigo-400">{pixelDensity}²</span>
                </div>
                <input 
                  type="range" min="4" max="24" step="2"
                  value={pixelDensity}
                  onChange={(e) => setPixelDensity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-[2.5rem] border border-cyan-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-cyan-600 rounded-xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Binary Rule</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Shades of gray = 2<sup>n</sup>, where <span className="text-cyan-400 font-bold">n</span> is the number of bits. Registry questions often ask: "How many shades of gray for an 8-bit memory?"
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Registry Answer</span>
                  <span className="text-xl font-black text-cyan-400">2<sup>{bits}</sup> = {memoryData.shades}</span>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Shortcut</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "Bits = Contrast Resolution. Pixels = Spatial Resolution. More is always better."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-3">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Key Definitions</p>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-black text-white">Bit</p>
                    <p className="text-[9px] text-slate-500">Binary Digit (0 or 1)</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-white">Byte</p>
                    <p className="text-[9px] text-slate-500">8 Bits (Enough for 256 shades)</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <NeuralPreceptor 
        isOpen={isPreceptorOpen} 
        onClose={() => setIsPreceptorOpen(false)}
        context={JSON.stringify({
          labId: 'digital-memory',
          topic: 'Instrumentation: Digital Memory',
          currentBits: bits,
          shades: memoryData.shades,
          pixelDensity: pixelDensity
        })}
      />
    </div>
  );
};
