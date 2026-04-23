
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Activity, Zap, Layers, Droplet, Search, Waves } from 'lucide-react';

interface AdvancedImagingLabProps {
  topic: string;
}

export const AdvancedImagingLab: React.FC<AdvancedImagingLabProps> = ({ topic }) => {
  const [isHarmonicsOn, setIsHarmonicsOn] = useState(false);
  const [isContrastOn, setIsContrastOn] = useState(false);
  const [isElastographyOn, setIsElastographyOn] = useState(false);

  const isHarmonicsTopic = topic.toLowerCase().includes('harmonics') || topic.toLowerCase().includes('contrast');
  const isElastographyTopic = topic.toLowerCase().includes('elastography') || topic.toLowerCase().includes('fusion');

  return (
    <div className="glass-panel p-8 rounded-[2rem] border border-white/10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/20 text-cyan-500 rounded-2xl border border-cyan-500/30">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Advanced Modality Simulator</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Harmonics, Contrast & Elastography</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {isHarmonicsTopic && (
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Tissue Harmonics Control</label>
              <button
                onClick={() => setIsHarmonicsOn(!isHarmonicsOn)}
                className={`w-full p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${
                  isHarmonicsOn 
                    ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isHarmonicsOn ? 'bg-white/20' : 'bg-white/5'}`}>
                    <Waves size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-black uppercase italic text-lg tracking-tighter">Harmonic Mode</span>
                    <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60">
                      {isHarmonicsOn ? 'Filtering Fundamental Frequencies' : 'Fundamental Frequency Active'}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full border border-white/20 relative transition-colors ${isHarmonicsOn ? 'bg-white/20' : 'bg-white/5'}`}>
                  <motion.div 
                    animate={{ x: isHarmonicsOn ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </div>
              </button>

              <button
                onClick={() => setIsContrastOn(!isContrastOn)}
                className={`w-full p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${
                  isContrastOn 
                    ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isContrastOn ? 'bg-white/20' : 'bg-white/5'}`}>
                    <Droplet size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-black uppercase italic text-lg tracking-tighter">Contrast Agents</span>
                    <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60">
                      {isContrastOn ? 'Microbubbles Active' : 'No Contrast Injected'}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full border border-white/20 relative transition-colors ${isContrastOn ? 'bg-white/20' : 'bg-white/5'}`}>
                  <motion.div 
                    animate={{ x: isContrastOn ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </div>
              </button>
            </div>
          )}

          {isElastographyTopic && (
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Elastography Control</label>
              <button
                onClick={() => setIsElastographyOn(!isElastographyOn)}
                className={`w-full p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${
                  isElastographyOn 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isElastographyOn ? 'bg-white/20' : 'bg-white/5'}`}>
                    <Activity size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-black uppercase italic text-lg tracking-tighter">Strain Mapping</span>
                    <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60">
                      {isElastographyOn ? 'Measuring Tissue Stiffness' : 'B-Mode Active'}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full border border-white/20 relative transition-colors ${isElastographyOn ? 'bg-white/20' : 'bg-white/5'}`}>
                  <motion.div 
                    animate={{ x: isElastographyOn ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-black/40 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
            
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Simulated Ultrasound Image */}
              <div className="w-48 h-48 rounded-full border-4 border-white/10 relative overflow-hidden bg-slate-900">
                <motion.div 
                  animate={{ 
                    scale: isContrastOn ? [1, 1.05, 1] : 1,
                    opacity: isContrastOn ? [0.4, 0.8, 0.4] : 0.4
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute inset-0 bg-cyan-500/20 ${isContrastOn ? 'visible' : 'invisible'}`}
                />
                
                <div className={`absolute inset-0 flex items-center justify-center ${isHarmonicsOn ? 'brightness-150 contrast-125' : ''}`}>
                  <div className={`w-24 h-24 rounded-full border-2 border-white/20 ${isElastographyOn ? 'bg-gradient-to-br from-emerald-500/40 to-rose-500/40' : 'bg-slate-800'}`} />
                </div>

                {isHarmonicsOn && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full bg-cyan-500/5 mix-blend-overlay" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 text-center space-y-2">
              <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Neural Visualization Output</span>
              <p className="text-slate-300 text-sm font-bold italic">
                {isHarmonicsOn && "Harmonic Mode: Superior lateral resolution, reduced side-lobe artifacts."}
                {isContrastOn && "Contrast Mode: Enhanced visualization of micro-vascularity."}
                {isElastographyOn && "Elastography: Color-coded stiffness map (Red = Hard, Blue = Soft)."}
                {!isHarmonicsOn && !isContrastOn && !isElastographyOn && "Standard B-Mode: Fundamental frequency imaging."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
