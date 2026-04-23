
import React, { useState, useMemo } from 'react';
import { BarChart3, Zap, Target, Activity, Info, Sparkles, CheckSquare, AlertCircle } from 'lucide-react';

export const StatisticalAccuracyLab: React.FC = () => {
  // 2x2 Table States
  const [tp, setTp] = useState(80); // True Positive
  const [fn, setFn] = useState(10); // False Negative
  const [fp, setFp] = useState(5);  // False Positive
  const [tn, setTn] = useState(105); // True Negative

  const stats = useMemo(() => {
    const total = tp + fn + fp + tn;
    const sensitivity = (tp / (tp + fn)) * 100;
    const specificity = (tn / (tn + fp)) * 100;
    const ppv = (tp / (tp + fp)) * 100;
    const npv = (tn / (tn + fn)) * 100;
    const accuracy = ((tp + tn) / total) * 100;

    return {
      sensitivity: sensitivity.toFixed(1),
      specificity: specificity.toFixed(1),
      ppv: ppv.toFixed(1),
      npv: npv.toFixed(1),
      accuracy: accuracy.toFixed(1),
      total
    };
  }, [tp, fn, fp, tn]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <CheckSquare size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Statistical Mastery Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Sensitivity, Specificity & Registry Logic</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Overall Accuracy</span>
              <span className="text-xl font-black text-emerald-400">{stats.accuracy}%</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Total Population</span>
              <span className="text-xl font-black text-indigo-400">{stats.total}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-10">
            {/* The 2x2 Matrix */}
            <div className="bg-slate-800 rounded-[2.5rem] p-8 border-4 border-slate-700 shadow-inner relative group">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-start-2 text-center text-[10px] font-black uppercase text-indigo-400">Disease (+)</div>
                <div className="text-center text-[10px] font-black uppercase text-rose-400">Disease (-)</div>
                
                <div className="flex items-center justify-end pr-4 text-[10px] font-black uppercase text-emerald-400">Test (+)</div>
                <div className="bg-emerald-500/20 rounded-2xl p-4 border border-emerald-500/30 text-center group/cell">
                  <span className="block text-[8px] font-black text-emerald-500 uppercase mb-1">True Pos (TP)</span>
                  <input type="number" value={tp} onChange={(e) => setTp(parseInt(e.target.value) || 0)} className="bg-transparent text-xl font-black w-full text-center focus:outline-none" />
                </div>
                <div className="bg-rose-500/10 rounded-2xl p-4 border border-rose-500/20 text-center">
                  <span className="block text-[8px] font-black text-rose-400 uppercase mb-1">False Pos (FP)</span>
                  <input type="number" value={fp} onChange={(e) => setFp(parseInt(e.target.value) || 0)} className="bg-transparent text-xl font-black w-full text-center focus:outline-none" />
                </div>

                <div className="flex items-center justify-end pr-4 text-[10px] font-black uppercase text-rose-400">Test (-)</div>
                <div className="bg-rose-500/10 rounded-2xl p-4 border border-rose-500/20 text-center">
                  <span className="block text-[8px] font-black text-rose-400 uppercase mb-1">False Neg (FN)</span>
                  <input type="number" value={fn} onChange={(e) => setFn(parseInt(e.target.value) || 0)} className="bg-transparent text-xl font-black w-full text-center focus:outline-none" />
                </div>
                <div className="bg-indigo-500/20 rounded-2xl p-4 border border-indigo-500/30 text-center">
                  <span className="block text-[8px] font-black text-indigo-400 uppercase mb-1">True Neg (TN)</span>
                  <input type="number" value={tn} onChange={(e) => setTn(parseInt(e.target.value) || 0)} className="bg-transparent text-xl font-black w-full text-center focus:outline-none" />
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-black/20 rounded-2xl border border-white/5">
                <p className="text-[9px] font-medium text-slate-400 text-center italic">
                   "Sensitivity = TP / (TP + FN). Specificity = TN / (TN + FP). Know these ratios!"
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
                  <p className="text-[8px] font-black text-slate-500 uppercase">Predictive Positive (PPV)</p>
                  <p className="text-3xl font-black text-emerald-400 tracking-tighter">{stats.ppv}%</p>
                  <p className="text-[9px] text-slate-500 font-bold italic">Likelihood you HAVE it if test is (+)</p>
               </div>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
                  <p className="text-[8px] font-black text-slate-500 uppercase">Predictive Negative (NPV)</p>
                  <p className="text-3xl font-black text-indigo-400 tracking-tighter">{stats.npv}%</p>
                  <p className="text-[9px] text-slate-500 font-bold italic">Likelihood you are healthy if test is (-)</p>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Target size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Sensitivity vs Specificity</h4>
               </div>
               <div className="space-y-6">
                  <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-emerald-500/50 transition-all">
                    <div>
                      <span className="block text-[8px] font-black text-emerald-400 uppercase mb-1">Sensitivity</span>
                      <p className="text-xs font-bold text-slate-200">Ability to detect disease</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-400">{stats.sensitivity}%</span>
                  </div>
                  <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-indigo-500/50 transition-all">
                    <div>
                      <span className="block text-[8px] font-black text-indigo-400 uppercase mb-1">Specificity</span>
                      <p className="text-xs font-bold text-slate-200">Ability to detect health</p>
                    </div>
                    <span className="text-2xl font-black text-indigo-400">{stats.specificity}%</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Hint</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "If the goal of the study is screening, we want high SENSITIVITY. If the goal is confirming a diagnosis, we want high SPECIFICITY."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/20 flex gap-4 items-center">
               <AlertCircle className="text-indigo-300 shrink-0" size={20}/>
               <p className="text-[10px] font-bold text-indigo-100 leading-relaxed uppercase tracking-wider">
                 The Gold Standard is the "perfect" test used for comparison (e.g. Biopsy or Angiography).
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
