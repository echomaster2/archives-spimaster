
import React, { useState, useMemo } from 'react';
import { Grid, Zap, Layers, Info, Sparkles, Database, Layout } from 'lucide-react';

export const PixelResolutionLab: React.FC = () => {
  const [matrixSize, setMatrixSize] = useState(16); // 16x16
  const [bitDepth, setBitDepth] = useState(3); // 2^3 = 8 shades

  const pixelData = useMemo(() => {
    const totalPixels = matrixSize * matrixSize;
    const shades = Math.pow(2, bitDepth);
    
    return {
      totalPixels,
      shades,
      spatialRes: matrixSize > 32 ? 'Superior' : matrixSize > 16 ? 'Standard' : 'Pixelated',
      contrastRes: shades > 16 ? 'High' : 'Low'
    };
  }, [matrixSize, bitDepth]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Grid size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="text-cyan-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Scan Converter Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Matrix Density & Bit Depth Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Spatial Res</span>
              <span className={`text-xl font-black ${matrixSize > 32 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                {pixelData.spatialRes}
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Contrast Res</span>
              <span className={`text-xl font-black ${pixelData.shades > 16 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                {pixelData.contrastRes}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Digital Grid */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8">
              
              <div 
                className="grid w-full h-full"
                style={{ 
                  gridTemplateColumns: `repeat(${matrixSize}, 1fr)`,
                  gridTemplateRows: `repeat(${matrixSize}, 1fr)`,
                  gap: matrixSize > 40 ? '0' : '1px'
                }}
              >
                {[...Array(matrixSize * matrixSize)].map((_, i) => {
                  // Simulate a circular organ with digital quantization
                  const row = Math.floor(i / matrixSize);
                  const col = i % matrixSize;
                  const centerX = matrixSize / 2;
                  const centerY = matrixSize / 2;
                  const dist = Math.sqrt(Math.pow(row - centerY, 2) + Math.pow(col - centerX, 2));
                  const isInside = dist < matrixSize / 3;
                  
                  // Intensity based on bit depth
                  const rawIntensity = isInside ? 0.8 : 0.2;
                  const shadeIdx = Math.round(rawIntensity * (pixelData.shades - 1));
                  const finalIntensity = (shadeIdx / (pixelData.shades - 1)) * 255;
                  
                  return (
                    <div 
                      key={i} 
                      className="w-full h-full transition-all duration-300"
                      style={{ backgroundColor: `rgb(${finalIntensity}, ${finalIntensity}, ${finalIntensity})` }}
                    />
                  );
                })}
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-cyan-400">
                Digital Matrix: {matrixSize} x {matrixSize}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Matrix Size (Pixels)</label>
                   <span className="text-xs font-black text-cyan-400">{matrixSize}²</span>
                </div>
                <input 
                  type="range" min="8" max="64" step="8"
                  value={matrixSize}
                  onChange={(e) => setMatrixSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Bit Depth</label>
                   <span className="text-xs font-black text-indigo-400">{bitDepth} Bits</span>
                </div>
                <input 
                  type="range" min="1" max="8" step="1"
                  value={bitDepth}
                  onChange={(e) => setBitDepth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-cyan-600 rounded-xl text-white shadow-lg">
                    <Layout size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Scan Converter</h4>
               </div>
               <div className="space-y-6">
                  <div className="p-5 bg-slate-800/50 rounded-2xl border border-white/5">
                    <span className="block text-[8px] font-black text-cyan-400 uppercase mb-1">Spatial Resolution</span>
                    <p className="text-xs font-bold text-slate-300 leading-relaxed">
                      Determined by <span className="text-white">Pixel Density</span>. Higher density = smaller pixels = better detail.
                    </p>
                  </div>
                  <div className="p-5 bg-slate-800/50 rounded-2xl border border-white/5">
                    <span className="block text-[8px] font-black text-indigo-400 uppercase mb-1">Contrast Resolution</span>
                    <p className="text-xs font-bold text-slate-300 leading-relaxed">
                      Determined by <span className="text-white">Bit Depth</span>. More bits = more gray shades = better contrast resolution.
                    </p>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Math</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  How many shades of gray for {bitDepth} bits? <span className="text-white font-bold">2^{bitDepth} = {pixelData.shades}</span>.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex gap-4 items-center">
              <Zap size={20} className="text-indigo-300" />
              <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">
                Post-processing happens AFTER the image is frozen and stored in memory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
