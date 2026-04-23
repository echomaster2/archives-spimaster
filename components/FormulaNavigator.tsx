
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
/* Added Circle to imports from lucide-react */
import { Calculator, Zap, Info, Search, BookOpen, Layers, Target, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

interface Formula {
  id: string;
  name: string;
  equation: string;
  description: string;
  variables: { name: string; label: string; unit: string; default: number }[];
  calculator: (vals: number[]) => string;
  domain: 'Physical' | 'Doppler' | 'Resolution' | 'Safety';
}

const FORMULAS: Formula[] = [
  {
    id: 'wavelength',
    name: "Wavelength",
    equation: "λ = c / f",
    description: "The length of a single cycle. Higher frequency = shorter wavelength = better resolution.",
    domain: 'Physical',
    variables: [
      { name: 'c', label: 'Prop Speed', unit: 'm/s', default: 1540 },
      { name: 'f', label: 'Frequency', unit: 'MHz', default: 5 }
    ],
    calculator: ([c, f]) => (c / (f * 1000000) * 1000).toFixed(3) + " mm"
  },
  {
    id: 'range',
    name: "Range Equation",
    equation: "Depth = (c × t) / 2",
    description: "Determines structural position. Uses the 13-microsecond rule in soft tissue.",
    domain: 'Physical',
    variables: [
      { name: 't', label: 'Go-Return Time', unit: 'µs', default: 13 }
    ],
    calculator: ([t]) => (t / 13).toFixed(1) + " cm"
  },
  {
    id: 'axial',
    name: "Axial Resolution",
    equation: "SPL / 2",
    description: "Ability to resolve structures parallel to beam. Smaller is better.",
    domain: 'Resolution',
    variables: [
      { name: 'spl', label: 'Spatial Pulse Length', unit: 'mm', default: 2.0 }
    ],
    calculator: ([spl]) => (spl / 2).toFixed(2) + " mm"
  },
  {
    id: 'dutyfactor',
    name: "Duty Factor",
    equation: "(PD / PRP) × 100",
    description: "Percentage of time the machine is actually transmitting sound.",
    domain: 'Physical',
    variables: [
      { name: 'pd', label: 'Pulse Duration', unit: 'µs', default: 1 },
      { name: 'prp', label: 'PRP', unit: 'µs', default: 1000 }
    ],
    calculator: ([pd, prp]) => ((pd / prp) * 100).toFixed(3) + " %"
  },
  {
    id: 'nyquist',
    name: "Nyquist Limit",
    equation: "PRF / 2",
    description: "The highest Doppler shift that can be measured without aliasing.",
    domain: 'Doppler',
    variables: [
      { name: 'prf', label: 'PRF', unit: 'kHz', default: 5 }
    ],
    calculator: ([prf]) => (prf / 2).toFixed(1) + " kHz"
  },
  {
    id: 'bernoulli',
    name: "Simplified Bernoulli",
    equation: "ΔP = 4v²",
    description: "Converts velocity into a pressure gradient. Essential for cardiac & vascular.",
    domain: 'Doppler',
    variables: [
      { name: 'v', label: 'Peak Velocity', unit: 'm/s', default: 1.0 }
    ],
    calculator: ([v]) => (4 * v * v).toFixed(1) + " mmHg"
  }
];

export const FormulaNavigator: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [calcValues, setCalcValues] = useState<number[]>(FORMULAS[0].variables.map(v => v.default));
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('spi_mastered_formulas');
    if (saved) setMasteredIds(new Set(JSON.parse(saved)));
  }, []);

  useEffect(() => {
    localStorage.setItem('spi_mastered_formulas', JSON.stringify([...masteredIds]));
  }, [masteredIds]);

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = FORMULAS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const current = FORMULAS[selectedIdx];
  const totalMastery = (masteredIds.size / FORMULAS.length) * 100;

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    setCalcValues(FORMULAS[idx].variables.map(v => v.default));
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-1000 h-[700px] flex flex-col relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.03)_0%,transparent_50%)] pointer-events-none" />
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between bg-slate-50/50 gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900 uppercase">Registry Quick-Ref</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">High-Yield Physics Formulas</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="hidden lg:block text-right">
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Formula Mastery</span>
              <div className="flex items-center gap-3">
                 <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${totalMastery}%` }} />
                 </div>
                 <span className="text-[10px] font-black text-slate-900">{masteredIds.size}/{FORMULAS.length}</span>
              </div>
           </div>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Search equations..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all w-64"
              />
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar List */}
        <div className="w-80 border-r border-slate-100 overflow-y-auto p-4 space-y-2 bg-slate-50/30">
          {filtered.map((f, i) => {
            const actualIdx = FORMULAS.findIndex(form => form.id === f.id);
            const active = selectedIdx === actualIdx;
            const isMastered = masteredIds.has(f.id);
            return (
              <button 
                key={f.id}
                onClick={() => handleSelect(actualIdx)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                  active ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-transparent hover:border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isMastered && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                  <div>
                    <span className={`block text-[8px] font-black uppercase tracking-widest mb-1 ${active ? 'text-indigo-400' : 'text-slate-400'}`}>{f.domain}</span>
                    <span className="text-xs font-black">{f.name}</span>
                  </div>
                </div>
                <ChevronRight size={14} className={`transition-transform ${active ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-10 overflow-y-auto space-y-10">
          <div className="flex justify-between items-start">
             <div className="space-y-6">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{current.name}</h2>
                 <div className="p-10 md:p-12 bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-dashed border-slate-700 flex items-center justify-center relative overflow-hidden group shadow-inner">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_100%] opacity-20" />
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700"><Layers size={120}/></div>
                    <motion.p 
                      key={current.equation}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-3xl md:text-5xl font-mono font-black text-indigo-400 tracking-widest relative z-10 drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]"
                    >
                      {current.equation}
                    </motion.p>
                 </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">{current.description}</p>
             </div>
             <button 
                onClick={() => toggleMastered(current.id)}
                className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
                   masteredIds.has(current.id) 
                   ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
                   : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600'
                }`}
             >
                {masteredIds.has(current.id) ? <CheckCircle2 size={16}/> : <Circle size={16}/>}
                {masteredIds.has(current.id) ? 'Memorized' : 'Mark Learned'}
             </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <Target size={14} className="text-indigo-600"/> Variable Inputs
                </h4>
                <div className="space-y-6">
                   {current.variables.map((v, i) => (
                     <div key={v.name} className="space-y-2">
                        <div className="flex justify-between items-end">
                           <label className="text-[10px] font-black text-slate-700 uppercase">{v.label} ({v.unit})</label>
                           <span className="text-xs font-black text-indigo-600">{calcValues[i]}</span>
                        </div>
                        <input 
                          type="range"
                          min={v.default / 4}
                          max={v.default * 4}
                          step={v.default / 20}
                          value={calcValues[i]}
                          onChange={(e) => {
                            const newVals = [...calcValues];
                            newVals[i] = parseFloat(e.target.value);
                            setCalcValues(newVals);
                          }}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <Zap size={32} className="text-amber-400 mx-auto mb-4 animate-pulse" />
                <span className="block text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Live Calculation</span>
                <p className="text-5xl font-black text-white tracking-tighter">{current.calculator(calcValues)}</p>
                <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-bold text-slate-500 uppercase">
                   <Info size={12}/> Based on ARDMS Physics Standards
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
