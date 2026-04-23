
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calculator, Ruler, Activity, Zap, ArrowRightLeft } from 'lucide-react';

interface MathematicsLabProps {
  topic: string;
}

export const MathematicsLab: React.FC<MathematicsLabProps> = ({ topic }) => {
  const [inputValue, setInputValue] = useState(1);
  
  const isDecibel = topic.toLowerCase().includes('decibel') || topic.toLowerCase().includes('log');
  const isMetric = topic.toLowerCase().includes('metric');
  const isScientific = topic.toLowerCase().includes('scientific');

  const decibelResult = useMemo(() => {
    if (!isDecibel) return null;
    // Simple dB calculation: 10 * log10(P2/P1) or 20 * log10(A2/A1)
    // We'll use intensity (10 * log10)
    const ratio = inputValue;
    const db = 10 * Math.log10(ratio);
    return db.toFixed(1);
  }, [inputValue, isDecibel]);

  const metricResults = useMemo(() => {
    if (!isMetric) return null;
    return {
      milli: inputValue * 1000,
      micro: inputValue * 1000000,
      nano: inputValue * 1000000000,
      kilo: inputValue / 1000,
      mega: inputValue / 1000000
    };
  }, [inputValue, isMetric]);

  const scientificNotation = useMemo(() => {
    if (!isScientific) return null;
    return inputValue.toExponential(2);
  }, [inputValue, isScientific]);

  return (
    <div className="glass-panel p-8 rounded-[2rem] border border-white/10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-500 rounded-2xl border border-indigo-500/30">
            <Calculator size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Neural Math Processor</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Unit Conversion & Logarithmic Analysis</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Input Value</label>
            <input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white font-mono text-2xl focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div className="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 space-y-4">
            <h4 className="text-sm font-black text-indigo-400 uppercase italic tracking-widest">Interactive Heuristic</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isDecibel && "Adjust the intensity ratio to see the corresponding decibel change. Remember: a 3dB increase means doubling the intensity."}
              {isMetric && "Convert base units to metric prefixes. In ultrasound, we frequently move between millimeters (10⁻³) and microseconds (10⁻⁶)."}
              {isScientific && "Visualize large and small numbers in scientific notation. Essential for handling frequencies in Megahertz (10⁶)."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Calculated Output</label>
          
          <div className="grid grid-cols-1 gap-3">
            {isDecibel && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-indigo-500" />
                  <span className="text-slate-300 font-bold uppercase text-xs">Intensity Change</span>
                </div>
                <span className="text-2xl font-black text-white italic">{decibelResult} dB</span>
              </motion.div>
            )}

            {isMetric && metricResults && (
              <>
                {[
                  { label: 'Mega (M)', value: metricResults.mega, color: 'text-rose-500' },
                  { label: 'Kilo (k)', value: metricResults.kilo, color: 'text-orange-500' },
                  { label: 'Milli (m)', value: metricResults.milli, color: 'text-emerald-500' },
                  { label: 'Micro (μ)', value: metricResults.micro, color: 'text-cyan-500' },
                ].map((item, i) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between"
                  >
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{item.label}</span>
                    <span className={`font-mono font-bold ${item.color}`}>{item.value.toLocaleString()}</span>
                  </motion.div>
                ))}
              </>
            )}

            {isScientific && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 bg-indigo-500/10 rounded-[2rem] border border-indigo-500/20 flex flex-col items-center justify-center space-y-2"
              >
                <span className="text-indigo-400 font-black uppercase text-xs tracking-[0.3em]">Scientific Notation</span>
                <span className="text-4xl font-black text-white italic tracking-tighter">{scientificNotation}</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
