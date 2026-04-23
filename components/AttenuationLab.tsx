
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Filter, Ruler, Activity, Zap, ArrowRightLeft, Layers, Droplet } from 'lucide-react';

interface AttenuationLabProps {
  topic: string;
}

export const AttenuationLab: React.FC<AttenuationLabProps> = ({ topic }) => {
  const [frequency, setFrequency] = useState(5); // MHz
  const [depth, setDepth] = useState(5); // cm
  const [medium, setMedium] = useState('soft-tissue');

  const attenuationCoeffs: Record<string, number> = {
    'soft-tissue': 0.5, // dB/cm/MHz
    'fat': 0.6,
    'muscle': 1.0,
    'bone': 20,
    'water': 0.002,
    'air': 12
  };

  const totalAttenuation = useMemo(() => {
    const coeff = attenuationCoeffs[medium];
    return coeff * depth * frequency;
  }, [frequency, depth, medium]);

  const remainingIntensity = useMemo(() => {
    // Intensity = 10^(-dB/10)
    return Math.pow(10, -totalAttenuation / 10) * 100;
  }, [totalAttenuation]);

  return (
    <div className="glass-panel p-8 rounded-[2rem] border border-white/10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-500 rounded-2xl border border-purple-500/30">
            <Filter size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Attenuation Simulator</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Energy Loss & Absorption Analysis</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Frequency (MHz)</label>
              <span className="text-purple-500 font-black italic">{frequency} MHz</span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="15" 
              step="0.5"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Depth (cm)</label>
              <span className="text-purple-500 font-black italic">{depth} cm</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              step="1"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Medium Selection</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(attenuationCoeffs).map((m) => (
                <button
                  key={m}
                  onClick={() => setMedium(m)}
                  className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                    medium === m 
                      ? 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {m.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-purple-500/10 rounded-[2rem] border border-purple-500/20 flex flex-col items-center justify-center space-y-4">
            <div className="text-center">
              <span className="text-purple-400 font-black uppercase text-xs tracking-[0.3em]">Total Attenuation</span>
              <div className="text-5xl font-black text-white italic tracking-tighter">-{totalAttenuation.toFixed(1)} dB</div>
            </div>
            
            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${remainingIntensity}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              Remaining Intensity: {remainingIntensity.toFixed(2)}%
            </span>
          </div>

          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
            <h4 className="text-sm font-black text-purple-400 uppercase italic tracking-widest">Heuristic Insight</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Attenuation is directly proportional to frequency and depth. High-frequency probes (10-15 MHz) provide superior resolution but suffer from rapid energy loss, limiting their use to superficial structures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
