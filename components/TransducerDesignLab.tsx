
import React, { useState, useMemo } from 'react';
import { Radio, Zap, Target, Activity, Info, Sparkles, Layers, Box } from 'lucide-react';

export const TransducerDesignLab: React.FC = () => {
  const [thickness, setThickness] = useState(0.5); // mm
  const [crystalSpeed, setCrystalSpeed] = useState(4000); // m/s (PZT is typically 4000-6000 m/s)

  const designData = useMemo(() => {
    // f = crystal speed / (2 * thickness)
    // thickness in mm -> m (* 10^-3)
    // frequency in MHz (* 10^6)
    const freqMHz = crystalSpeed / (2 * thickness * 1000);
    
    // Matching Layer Thickness = 1/4 wavelength
    // Lambda = speed in tissue (1540) / freq
    const lambdaTissue = 1.54 / freqMHz;
    const matchingLayer = lambdaTissue / 4;

    return {
      frequency: freqMHz.toFixed(1),
      matchingLayer: matchingLayer.toFixed(3),
      wavelength: lambdaTissue.toFixed(3)
    };
  }, [thickness, crystalSpeed]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Box size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Box className="text-purple-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Transducer Design Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">PZT Resonance & Construction</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Operating Freq.</span>
              <span className="text-xl font-black text-purple-400">{designData.frequency} MHz</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Matching Layer</span>
              <span className="text-xl font-black text-indigo-400">{designData.matchingLayer} mm</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Transducer Cross-Section */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex flex-col items-center justify-center p-8">
              
              {/* Backing Material */}
              <div className="w-48 h-20 bg-slate-600 rounded-t-lg border-b-2 border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 2px, transparent 2px, transparent 8px)' }}></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest z-10">Backing Material (Damping)</span>
              </div>

              {/* PZT Crystal */}
              <div 
                className="w-48 bg-purple-500 border-y-2 border-purple-300 transition-all duration-500 flex items-center justify-center relative shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                style={{ height: `${thickness * 80}px` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter shadow-sm">PZT Crystal</span>
              </div>

              {/* Matching Layer */}
              <div 
                className="w-48 bg-indigo-400 border-b-2 border-indigo-300 transition-all duration-500 flex items-center justify-center relative"
                style={{ height: `${parseFloat(designData.matchingLayer) * 100}px`, maxHeight: '30px' }}
              >
                 <span className="text-[7px] font-black text-indigo-900 uppercase">Matching Layer</span>
              </div>

              {/* Patient Interface */}
              <div className="mt-4 text-[8px] font-bold text-slate-500 italic uppercase">Tissue Interface</div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PZT Thickness</label>
                   <span className="text-xs font-black text-purple-400">{thickness} mm</span>
                </div>
                <input 
                  type="range" min="0.1" max="1.5" step="0.05"
                  value={thickness}
                  onChange={(e) => setThickness(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Crystal Speed</label>
                   <span className="text-xs font-black text-indigo-400">{crystalSpeed} m/s</span>
                </div>
                <input 
                  type="range" min="3000" max="6000" step="100"
                  value={crystalSpeed}
                  onChange={(e) => setCrystalSpeed(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-purple-500/10 to-transparent rounded-[2.5rem] border border-purple-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-purple-600 rounded-xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Crystal Frequency Rule</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 In pulsed wave transducers, frequency is determined by <span className="text-purple-400 font-bold">crystal thickness</span> and <span className="text-purple-400 font-bold">propagation speed</span> in the PZT.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Master Equation</p>
                  <p className="text-sm font-black italic text-purple-400">Freq (MHz) = Crystal Speed / (2 × Thickness)</p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-indigo-500/20 rounded-2xl">
                <Sparkles size={24} className="text-indigo-400" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Registry Tip: Matching Layer</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  The matching layer is <span className="text-white font-bold">1/4 wavelength thick</span>. Its impedance is between the PZT and the skin to reduce reflection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
