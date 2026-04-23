
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, Activity, Target, ShieldAlert,
  Brain, Sparkles, Clock, ArrowRight,
  CheckCircle2, AlertCircle, HeartPulse,
  User, Search, Zap, Trophy, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { NeuralPreceptor } from './NeuralPreceptor';

interface CaseStudy {
  id: string;
  patient: {
    name: string;
    age: number;
    indication: string;
    targetOrgan: string;
  };
  challenge: {
    question: string;
    type: 'physics' | 'clinical' | 'instrumentation';
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  finding: string;
}

const SHIFT_CASES: CaseStudy[] = [
  {
    id: 'rot_1',
    patient: { name: 'Elias Thorne', age: 74, indication: 'Lower extremity swelling, suspected DVT.', targetOrgan: 'Femoral Vein' },
    challenge: {
      question: "You're having trouble compressing the vein at the popliteal crease. What action optimizes the scan logic?",
      type: 'physics',
      options: ['Increase PRF Scale', 'Optimize focal zone to vessel depth', 'Decrease Dynamic Range', 'Switch to 12MHz probe'],
      correctIndex: 1,
      explanation: 'Axial and lateral resolution are critical for vessel wall visualization. Aligning the focal zone ensures the highest acoustic clarity at the depth of interest.'
    },
    finding: "Vein is non-compressible with internal echoes (clot noted)."
  },
  {
    id: 'rot_2',
    patient: { name: 'Amara Vance', age: 31, indication: 'Right upper quadrant pain after fatty meal.', targetOrgan: 'Gallbladder' },
    challenge: {
      question: "A posterior shadow is seen but is faint. How do you confirm it's a true acoustic shadow from a stone?",
      type: 'physics',
      options: ['Switch to a lower frequency', 'Decrease TGC in the far field', 'Increase harmonic frequency', 'Change angle of incidence'],
      correctIndex: 2,
      explanation: 'Harmonic imaging improves lateral resolution and reduces grating lobes, making posterior acoustic shadowing much more distinct and resolving artifactual echoes.'
    },
    finding: "Multiple mobile echogenic foci with distinct shadowing."
  },
  {
    id: 'rot_3',
    patient: { name: 'Leo Martinez', age: 58, indication: 'High grade carotid stenosis follow-up.', targetOrgan: 'Carotid Artery' },
    challenge: {
      question: "The spectral Doppler waveform shows aliasing at the peak. Which 'Knobology' fix is prioritized?",
      type: 'instrumentation',
      options: ['Decrease Baseline', 'Increase PRF (Scale)', 'Increase Doppler Gain', 'Decrease Doppler Frequency'],
      correctIndex: 1,
      explanation: 'Aliasing occurs when the Doppler shift exceeds the Nyquist limit (PRF/2). Increasing the PRF raises the limit to accommodate the high-velocity jet.'
    },
    finding: "Peak systolic velocity measures 280 cm/s."
  }
];

export const VirtualClinicalRotation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'scanning' | 'summary'>('intro');
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [isPreceptorOpen, setIsPreceptorOpen] = useState(false);

  const activeCase = SHIFT_CASES[activeCaseIdx];

  const handleAnswer = (idx: number) => {
    const isCorrect = idx === activeCase.challenge.correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
      toast.success('Logical Alignment Confirmed', { icon: <ShieldCheck className="text-emerald-500" /> });
    } else {
      toast.error('Diagnostic Slip Detected', { icon: <AlertCircle className="text-rose-500" /> });
    }
    
    setAnswers([...answers, idx]);

    if (activeCaseIdx < SHIFT_CASES.length - 1) {
      setActiveCaseIdx(activeCaseIdx + 1);
    } else {
      setCurrentStep('summary');
    }
  };

  const getShiftTime = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (currentStep === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in zoom-in duration-700 h-full min-h-[600px]">
        <div className="p-10 bg-indigo-600 rounded-full shadow-[0_0_50px_rgba(99,102,241,0.4)] relative">
          <Stethoscope className="text-white w-20 h-20" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-white/20 rounded-full"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-display font-black text-white italic uppercase tracking-tighter">Clinical <br/> Rotation</h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
             Initialize high-throughput clinical mode. Handle 3 urgent cases under pressure.
          </p>
        </div>
        <button 
          onClick={() => setCurrentStep('scanning')}
          className="px-12 py-6 bg-white text-black rounded-[2rem] font-black uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-4xl flex items-center gap-4"
        >
          Begin Shift <ArrowRight />
        </button>
      </div>
    );
  }

  if (currentStep === 'summary') {
    const percentage = Math.round((score / SHIFT_CASES.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-12 animate-in fade-in duration-1000">
         <div className="text-center space-y-4">
            <Trophy className="text-yellow-400 w-24 h-24 mx-auto drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]" />
            <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter">Shift Complete</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance Metrics Stabilized</p>
         </div>

         <div className="grid md:grid-cols-2 gap-8 w-full max-w-2xl">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-4">
               <h3 className="text-6xl font-black text-indigo-400 italic">{percentage}%</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Diagnostic Accuracy</p>
            </div>
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-4">
               <h3 className="text-6xl font-black text-white italic">{getShiftTime()}</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Acquisition Velocity</p>
            </div>
         </div>

         <div className="p-10 bg-indigo-600 rounded-[3rem] w-full max-w-2xl text-center space-y-6 shadow-4xl">
            <div className="flex items-center justify-center gap-3">
               <Brain className="text-white" size={24} />
               <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Neural Impact</h4>
            </div>
            <p className="text-sm font-bold text-indigo-100 italic leading-relaxed">
               {percentage === 100 
                 ? "Perfect clinical sync. Your registry readiness has increased by +2 points in all sectors."
                 : "Significant logic confirmed. Review the 'Artifact Physics' lab to optimize your next rotation."}
            </p>
            <button 
              onClick={() => {
                setActiveCaseIdx(0);
                setAnswers([]);
                setScore(0);
                setCurrentStep('intro');
              }}
              className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-50"
            >
               Reset Shift Protocol
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in slide-in-from-right-12 duration-700">
      {/* Shift Header */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
               <Clock className="text-slate-500" size={24} />
            </div>
            <div>
               <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">Shift in Progress</h4>
               <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Case {activeCaseIdx + 1} of {SHIFT_CASES.length}</p>
            </div>
         </div>
         <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setIsPreceptorOpen(true)}
              className="px-4 py-2 bg-emerald-600/10 border border-emerald-600/30 text-emerald-500 rounded-xl flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all group"
            >
              <Brain size={14} className="group-hover:scale-110 transition-transform" />
              <span className="text-[8px] font-black uppercase tracking-widest">Consult Preceptor</span>
            </button>

            <div className="flex items-center gap-3">
               {[...Array(SHIFT_CASES.length)].map((_, i) => (
                 <div 
                   key={i} 
                   className={`w-3 h-3 rounded-full transition-all ${i === activeCaseIdx ? 'bg-indigo-500 scale-125 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : i < activeCaseIdx ? 'bg-emerald-500' : 'bg-white/10'}`} 
                 />
               ))}
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
         {/* Live Scenario */}
         <div className="lg:col-span-12">
            <div className="tech-card p-10 md:p-16 rounded-[4rem] bg-slate-900 border border-white/5 relative overflow-hidden group">
               <div className="absolute inset-0 neural-grid opacity-[0.05]" />
               <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000">
                  <Stethoscope size={200} />
               </div>

               <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-3xl">
                     <User size={48} />
                  </div>
                  <div className="space-y-8 flex-1">
                     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                           <h3 className="text-3xl md:text-5xl font-display font-black text-white italic uppercase tracking-tighter">{activeCase.patient.name} <span className="opacity-20 font-light">(AGE: {activeCase.patient.age})</span></h3>
                           <div className="flex items-center gap-4">
                              <span className="px-4 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-400 font-black uppercase text-[8px] tracking-widest">
                                 {activeCase.patient.targetOrgan}
                              </span>
                              <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black uppercase text-[8px] tracking-widest flex items-center gap-2">
                                 <Activity size={10} /> Active Acquisition
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 bg-black/40 border border-white/5 rounded-[2rem] space-y-4">
                           <h5 className="flex items-center gap-3 text-[9px] font-black text-rose-400 uppercase tracking-widest italic">
                              <ShieldAlert size={14} /> Clinical Indication
                           </h5>
                           <p className="text-sm font-bold text-slate-300 italic leading-relaxed">
                              "{activeCase.patient.indication}"
                           </p>
                        </div>
                        <div className="p-8 bg-black/40 border border-white/5 rounded-[2rem] space-y-4">
                           <h5 className="flex items-center gap-3 text-[9px] font-black text-emerald-400 uppercase tracking-widest italic">
                              <Search size={14} /> Sonographic Finding
                           </h5>
                           <p className="text-sm font-bold text-slate-300 italic leading-relaxed">
                              "{activeCase.finding}"
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Logic Challenge */}
         <div className="lg:col-span-12">
            <div className="space-y-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <Brain className="text-indigo-400" size={20} />
                     <h4 className="micro-label">Registry Logic Challenge</h4>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-tight max-w-3xl">
                     {activeCase.challenge.question}
                  </h3>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  {activeCase.challenge.options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(i)}
                      className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-left hover:bg-white/10 hover:border-indigo-500/50 transition-all group"
                    >
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600 font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             {String.fromCharCode(65 + i)}
                          </div>
                          <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{opt}</span>
                       </div>
                    </motion.button>
                  ))}
               </div>

               <div className="p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] flex items-center gap-6">
                  <div className="p-4 bg-indigo-600/10 rounded-2xl text-indigo-400">
                     <Zap size={24} className="animate-pulse" />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                     Registry Tip: <span className="text-indigo-300">Always optimize focus and transducer frequency before interpreting specific pathology labels. Knobology is the foundation of diagnostic truth.</span>
                  </p>
               </div>
            </div>
         </div>
      </div>
      <NeuralPreceptor 
        isOpen={isPreceptorOpen} 
        onClose={() => setIsPreceptorOpen(false)} 
        context={`Virtual Clinical Rotation Shift. Current Case: ${JSON.stringify(activeCase)}. User is in the middle of a high-pressure shift.`}
        initialMessage={`Neural link established. This shift is intense, but I'm here. You're analyzing ${activeCase.patient.name}. Any physics bottlenecks or clinical logic gaps you need deconstructed?`}
      />
    </div>
  );
};
