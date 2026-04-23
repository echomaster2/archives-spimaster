
import React, { useState, useMemo } from 'react';
import { Palette, Zap, Layers, Info, Sparkles, Filter, Eye, Database } from 'lucide-react';

export const PostProcessingLab: React.FC = () => {
  const [bColor, setBColor] = useState<'none' | 'sepia' | 'cyan' | 'magma'>('none');
  const [mapType, setMapType] = useState(1); // 1-4
  const [isFrozen, setIsFrozen] = useState(true);

  const mapLabel = useMemo(() => {
    const labels = ["Standard Linear", "High Contrast", "Logarithmic", "S-Curve"];
    return labels[mapType - 1];
  }, [mapType]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Palette size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Palette className="text-pink-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Image Tinting Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">B-Color & Grey Scale Maps (Post-processing)</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Processing State</span>
              <span className="text-xl font-black text-emerald-400 uppercase">Frozen Image</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Virtual Ultrasound Display */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              
              <div 
                className="w-full h-full rounded-2xl relative overflow-hidden transition-all duration-500"
                style={{
                  filter: bColor === 'sepia' ? 'sepia(1) hue-rotate(-30deg)' : 
                          bColor === 'cyan' ? 'hue-rotate(140deg) saturate(1.5)' : 
                          bColor === 'magma' ? 'invert(0.2) sepia(1) hue-rotate(280deg) saturate(3)' : 'none'
                }}
              >
                {/* Simulated Anatomy */}
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                   <div className="w-48 h-32 bg-white/20 rounded-[3rem] blur-2xl animate-pulse"></div>
                   <div className="w-12 h-12 bg-black rounded-full absolute top-1/4 left-1/4 border border-white/10"></div>
                   <div className="w-16 h-16 bg-white/5 rounded-full absolute bottom-1/4 right-1/4 border border-white/5 shadow-xl"></div>
                </div>
                
                {/* Scanline pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '10px 100%' }}></div>
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-pink-400">
                Map: {mapLabel}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">B-Color (Tinting)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['none', 'sepia', 'cyan', 'magma'] as const).map(c => (
                      <button 
                        key={c}
                        onClick={() => setBColor(c)}
                        className={`py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${bColor === c ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Display Map</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map(m => (
                      <button 
                        key={m}
                        onClick={() => setMapType(m)}
                        className={`py-3 rounded-xl text-[8px] font-black uppercase transition-all ${mapType === m ? 'bg-pink-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                      >
                        Map {m}
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-pink-500/10 to-transparent rounded-[2.5rem] border border-pink-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-pink-600 rounded-xl text-white shadow-lg">
                    <Database size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Frozen Boundary</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 B-Color (Color Maps) are <span className="text-white font-bold underline uppercase">Post-Processing</span>. They are used to highlight small changes in echo amplitude that the human eye might miss in grayscale.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <p className="text-[10px] font-bold text-slate-300">Goal: Improve Contrast Detection</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                    <p className="text-[10px] font-bold text-slate-300">Goal: Reduce eye fatigue</p>
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
                  "If you can change the setting after the image is saved or frozen, it's post-processing. This includes B-Color, Read Zoom, and 3D rendering."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex gap-4 items-center">
               <Info size={16} className="text-indigo-300 shrink-0" />
               <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                 B-color has NO impact on lateral or axial resolution—it only affects how the information is perceived by the eye.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
