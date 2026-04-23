
import React, { useState, useMemo } from 'react';
import { Maximize2, Zap, Target, Activity, Info, Sparkles, Layers, Grid, Cpu } from 'lucide-react';

export const ZoomTechniquesLab: React.FC = () => {
  const [zoomType, setZoomType] = useState<'read' | 'write'>('read');
  const [zoomFactor, setZoomFactor] = useState(2); // 2x, 3x, 4x

  const zoomData = useMemo(() => {
    const isWrite = zoomType === 'write';
    return {
      pixelDensity: isWrite ? 'Higher (Rescanned)' : 'Same (Enlarged)',
      spatialRes: isWrite ? 'Improved' : 'No Change',
      type: isWrite ? 'Pre-processing' : 'Post-processing',
      status: isWrite ? 'New Data Acquired' : 'Existing Data Stretched',
      color: isWrite ? 'text-emerald-400' : 'text-amber-400'
    };
  }, [zoomType]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Maximize2 size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Maximize2 className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Acoustic Zoom Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Read vs Write Zoom Dynamics</p>
          </div>
          
          <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10 shadow-inner">
             <button 
               onClick={() => setZoomType('write')} 
               className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${zoomType === 'write' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
             >
               Write Zoom
             </button>
             <button 
               onClick={() => setZoomType('read')} 
               className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${zoomType === 'read' ? 'bg-amber-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
             >
               Read Zoom
             </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Pixel Comparison */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              <div className="relative w-full h-full flex items-center justify-center">
                 {/* The "ROI" Region of Interest */}
                 <div 
                   className={`grid gap-px transition-all duration-700 rounded-lg overflow-hidden border-2 border-white/10 shadow-2xl`}
                   style={{ 
                     gridTemplateColumns: `repeat(${zoomType === 'write' ? 32 : 12}, 1fr)`,
                     width: '240px',
                     height: '240px',
                     transform: `scale(${1 + (zoomFactor - 2) * 0.2})`
                   }}
                 >
                    {[...Array((zoomType === 'write' ? 32 : 12) * (zoomType === 'write' ? 32 : 12))].map((_, i) => {
                      const row = Math.floor(i / (zoomType === 'write' ? 32 : 12));
                      const col = i % (zoomType === 'write' ? 32 : 12);
                      const dist = Math.sqrt(Math.pow(row - (zoomType === 'write' ? 16 : 6), 2) + Math.pow(col - (zoomType === 'write' ? 16 : 6), 2));
                      const isInside = dist < (zoomType === 'write' ? 10 : 4);
                      const gray = isInside ? 200 : 50;
                      return <div key={i} className="w-full h-full" style={{ backgroundColor: `rgb(${gray},${gray},${gray})` }} />;
                    })}
                 </div>
                 
                 {zoomType === 'read' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="w-64 h-64 border-4 border-amber-500/20 rounded-2xl animate-pulse flex items-center justify-center">
                          <span className="text-[10px] font-black text-amber-500 uppercase bg-black/80 px-2 py-1 rounded">Coarse Pixels</span>
                       </div>
                    </div>
                 )}
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Visualizing {zoomData.type}
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Magnification Factor</label>
                  <span className="text-xs font-black text-indigo-400">{zoomFactor}x</span>
               </div>
               <input 
                  type="range" min="2" max="5" step="0.5"
                  value={zoomFactor}
                  onChange={(e) => setZoomFactor(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
               <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 rounded-xl text-white shadow-lg ${zoomType === 'write' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                    <Cpu size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">{zoomType === 'write' ? 'Write Zoom' : 'Read Zoom'}</h4>
               </div>
               
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Timing</span>
                        <p className="text-xs font-black text-white">{zoomData.type}</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Spatial Res</span>
                        <p className={`text-xs font-black ${zoomData.color}`}>{zoomData.spatialRes}</p>
                     </div>
                  </div>
                  
                  <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
                    {zoomType === 'write' 
                      ? "The system discards old data and rescans only the ROI. This results in more scan lines and more pixels in the same area."
                      : "The system enlarges a portion of the frozen image. Pixel size increases, making the image look grainier (pixelated)."}
                  </p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  <span className="text-white font-bold">Write Zoom</span> cannot be used on a frozen image. <span className="text-white font-bold">Read Zoom</span> is used after data acquisition.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex items-center gap-3">
               <Info size={16} className="text-indigo-300" />
               <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                 Temporal resolution can also improve with Write Zoom if the ROI is shallow!
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
