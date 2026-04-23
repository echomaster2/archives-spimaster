
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, Search, Zap, Info, ArrowRight, 
  Wind, Droplet, Microscope, Layout, Sparkles,
  CheckCircle2, ChevronRight, Calculator, Activity
} from 'lucide-react';

type Step = 'scan' | 'isolate' | 'interrogate' | 'diagnose';

interface HeuristicResult {
  title: string;
  physics: string;
  clinical: string;
  mnemonic: string;
}

export const ArtifactHeuristic: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('scan');
  const [anomalyType, setAnomalyType] = useState<'bright' | 'dark' | 'shifted' | null>(null);
  const [mediumAbove, setMediumAbove] = useState<'gas' | 'fluid' | 'tissue' | 'stiff' | null>(null);

  const reset = () => {
    setCurrentStep('scan');
    setAnomalyType(null);
    setMediumAbove(null);
  };

  const getDiagnosis = (): HeuristicResult | null => {
    if (anomalyType === 'bright') {
      if (mediumAbove === 'gas') return {
        title: "Ring-Down Artifact",
        physics: "Resonance from gas bubbles creates a continuous ringing vibration rather than a single pulse return.",
        clinical: "Absolute reliable indicator of gas pockets. Often seen in bowel or emphysematous infections.",
        mnemonic: "Ringing = Ring-down"
      };
      if (mediumAbove === 'fluid') return {
        title: "Posterior Enhancement",
        physics: "Sound passes through low attenuating fluid virtually unchanged. The machine assumes high reflectivity and over-illuminates deeper tissue.",
        clinical: "Confirms a dark void is a harmless fluid-filled cyst rather than a solid mass.",
        mnemonic: "Enhancement = Liquid"
      };
      if (mediumAbove === 'stiff') return {
        title: "Comet Tail Artifact",
        physics: "Series of closely spaced reverberations from hard, dense materials where SPL is shorter than the reflector spacing.",
        clinical: "Confirms presence of metal (surgical clips) or calcium (gallstones).",
        mnemonic: "Cats = Comet Tail (Dense)"
      };
    }
    
    if (anomalyType === 'shifted') return {
      title: "Refraction Artifact",
      physics: "Bending of the beam at oblique angles between media. The machine assumes straight propagation and plots a 'ghost' image of the real anatomy.",
      clinical: "Common at muscle-fat interfaces. Can replicate structures like double embryos or duplicated organs.",
      mnemonic: "Refraction = Real shifted"
    };

    if (anomalyType === 'bright' && mediumAbove === 'tissue') return {
        title: "Reverberation",
        physics: "Sound bounces between two dense reflectors, creating equally spaced clones deeper on the display.",
        clinical: "Indicates high-impedance boundaries. Can obscure real pathology within the cloned path.",
        mnemonic: "Reckless = Reverberation"
    };

    return null;
  };

  const result = getDiagnosis();

  return (
    <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 shadow-4xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-50" />
      <div className="absolute inset-0 neural-grid opacity-5 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start gap-8 md:gap-16">
        <div className="flex-1 space-y-8">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                   <Layout size={20} className="text-amber-400" />
                </div>
                <h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-white uppercase italic tracking-tighter">Artifact <span className="text-amber-400">Heuristic</span></h3>
             </div>
             <p className="text-slate-500 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] leading-relaxed italic">
                From Abstract Chaos to Clinical Certainty. Use the systematic workflow to reveal truth.
             </p>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 'scan' && (
                <motion.div 
                  key="step-scan"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-[#080c14] md:p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                       <span className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black text-xs">1</span>
                       <h4 className="text-lg font-black uppercase italic text-white tracking-widest leading-none">Step 1: Systematic Scan</h4>
                    </div>
                    <p className="text-sm font-bold text-slate-400 leading-relaxed italic">"Scan the organ and isolate any anomaly. Don't look for the diagnosis yet, look for the deviation."</p>
                    <button 
                      onClick={() => setCurrentStep('isolate')}
                      className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3"
                    >
                      Anomaly Detected <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'isolate' && (
                <motion.div 
                  key="step-isolate"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-[#080c14] md:p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                       <span className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black text-xs">2</span>
                       <h4 className="text-lg font-black uppercase italic text-white tracking-widest leading-none">Step 2: Isolate Signature</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ActionCard 
                        active={anomalyType === 'bright'} 
                        onClick={() => { setAnomalyType('bright'); setCurrentStep('interrogate'); }} 
                        icon={<Sparkles />} label="Hyperechoic" sub="Bright Streak/Mass" 
                      />
                      <ActionCard 
                        active={anomalyType === 'shifted'} 
                        onClick={() => { setAnomalyType('shifted'); setCurrentStep('diagnose'); }} 
                        icon={<Activity />} label="Displaced" sub="Ghost Image" 
                      />
                      <ActionCard 
                        active={anomalyType === 'dark'} 
                        onClick={() => { setAnomalyType('dark'); setCurrentStep('diagnose'); }} 
                        icon={<AlertTriangle />} label="Shadow" sub="Dark Fallout" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'interrogate' && (
                <motion.div 
                  key="step-interrogate"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-[#080c14] md:p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                       <span className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black text-xs">3</span>
                       <h4 className="text-lg font-black uppercase italic text-white tracking-widest leading-none">Step 3: Interrogate Source</h4>
                    </div>
                    <p className="text-sm font-bold text-slate-400 leading-relaxed italic mb-6">"Interrogate the medium immediately ABOVE the bright anomaly."</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ActionCard 
                        active={mediumAbove === 'gas'} 
                        onClick={() => { setMediumAbove('gas'); setCurrentStep('diagnose'); }} 
                        icon={<Wind />} label="Gas Pocket" sub="Resonant Bubbles" 
                      />
                      <ActionCard 
                        active={mediumAbove === 'fluid'} 
                        onClick={() => { setMediumAbove('fluid'); setCurrentStep('diagnose'); }} 
                        icon={<Droplet />} label="Fluid/Cyst" sub="Low Attenuator" 
                      />
                      <ActionCard 
                        active={mediumAbove === 'stiff'} 
                        onClick={() => { setMediumAbove('stiff'); setCurrentStep('diagnose'); }} 
                        icon={<Microscope />} label="Metal/Calcium" sub="High Impedance" 
                      />
                      <ActionCard 
                        active={mediumAbove === 'tissue'} 
                        onClick={() => { setMediumAbove('tissue'); setCurrentStep('diagnose'); }} 
                        icon={<Calculator />} label="Standard Tissue" sub="Impedance Jump" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'diagnose' && (
                <motion.div 
                  key="step-diagnose"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-indigo-600 md:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-white/10 hardware-border">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-transparent to-transparent" />
                    <div className="relative z-10 space-y-8">
                       {result ? (
                         <>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="p-3 bg-white/20 rounded-2xl">
                                    <CheckCircle2 size={32} />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 leading-none mb-1">Diagnostic Fact</p>
                                    <h4 className="text-3xl font-black italic uppercase leading-none">{result.title}</h4>
                                 </div>
                              </div>
                              <div className="bg-black/20 px-4 py-2 rounded-xl text-[10px] font-mono border border-white/5">TYPE_ID: {result.title.toUpperCase().replace(/\s/g, '_')}</div>
                           </div>
                           
                           <div className="grid md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-200">The Physics</h5>
                                 <p className="text-sm font-bold leading-relaxed italic">{result.physics}</p>
                              </div>
                              <div className="space-y-3">
                                 <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Clinical Value</h5>
                                 <p className="text-sm font-bold leading-relaxed italic">{result.clinical}</p>
                              </div>
                           </div>

                           <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                                    Mnemonic: {result.mnemonic}
                                 </div>
                              </div>
                              <button onClick={reset} className="text-[10px] font-black uppercase tracking-widest hover:underline transition-all">Re-Start Workflow</button>
                           </div>
                         </>
                       ) : (
                         <div className="text-center py-10 space-y-4">
                            <AlertTriangle size={48} className="mx-auto text-amber-300" />
                            <h4 className="text-2xl font-black uppercase italic">Inconclusive Algorithm</h4>
                            <p className="text-indigo-100 font-bold max-w-sm mx-auto tracking-wide">"The reported signature doesn't match a primary artifact archetype. Re-interrogate the medium."</p>
                            <button onClick={reset} className="btn-secondary py-3 px-8 mt-4">Try Again</button>
                         </div>
                       )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="w-full md:w-80 space-y-6">
           <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><BookOpen size={40} className="text-white"/></div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-6 italic border-b border-amber-500/20 pb-4">Specialist Mnemonic</h4>
              <div className="space-y-4">
                {[
                  { k: 'R', l: 'Reverberation', d: 'Reckless' },
                  { k: 'C', l: 'Comet Tail', d: 'Cats' },
                  { k: 'R', l: 'Refraction', d: 'Ruin' },
                  { k: 'E', l: 'Enhancement', d: 'Echocardiograms' },
                ].map(m => (
                  <div key={m.l} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600/30 rounded-xl flex items-center justify-center font-black text-lg text-indigo-400 border border-indigo-500/20 italic">{m.k}</div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 leading-none">{m.d}</p>
                      <p className="text-sm font-black text-white italic tracking-tight">{m.l}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="p-6 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <div className="flex gap-4">
                 <Info className="text-amber-500 shrink-0" size={20} />
                 <p className="text-[10px] font-bold text-amber-100/70 leading-relaxed uppercase tracking-widest">
                   Machine Assumption: Sound travels at 1540m/s in a straight line. Artifacts prove the patient's facts by breaking these rules.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ActionCard: React.FC<{ icon: React.ReactNode, label: string, sub: string, active: boolean, onClick: () => void }> = ({ icon, label, sub, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 group ${
      active ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl' : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/20'
    }`}
  >
    <div className={`p-3 rounded-2xl w-fit ${active ? 'bg-white/20' : 'bg-white/5 border border-white/5 group-hover:bg-indigo-500/20'}`}>
       {React.cloneElement(icon as any, { size: 24, className: active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400' })}
    </div>
    <div>
      <p className={`text-xs font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-200'}`}>{label}</p>
      <p className={`text-[9px] font-bold uppercase tracking-widest ${active ? 'text-indigo-100' : 'text-slate-500'}`}>{sub}</p>
    </div>
  </button>
);

const BookOpen = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z"/></svg>
);
