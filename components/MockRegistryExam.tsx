
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, AlertCircle, ArrowRight, CheckCircle2, XCircle, Brain, Target, ShieldCheck, HelpCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const EXAM_QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Physics",
    question: "If the density of a medium increases, but the stiffness remains the same, what happens to the speed of sound?",
    options: ["Increases", "Decreases", "Stays the same", "Doubles"],
    correct: 1,
    explanation: "Speed of sound is inversely related to density. If density increases, speed decreases."
  },
  {
    id: 2,
    category: "Doppler",
    question: "Which of the following would be an appropriate choice for a wall filter setting in a cardiac Doppler exam?",
    options: ["10 Hz", "25 Hz", "100 Hz", "500 Hz"],
    correct: 3,
    explanation: "Cardiac wall filters are typically higher (e.g., 200-800 Hz) to eliminate strong, low-frequency echoes from moving heart walls."
  },
  {
    id: 3,
    category: "Instrumentation",
    question: "Which component of the receiver is responsible for reducing the dynamic range of the incoming signal?",
    options: ["Amplification", "Compensation", "Compression", "Demodulation"],
    correct: 2,
    explanation: "Compression (also called Log Compression) reduces the dynamic range by shrinking the difference between the strongest and weakest signals."
  },
  {
    id: 4,
    category: "Resolution",
    question: "Lateral resolution is PRIMARILY determined by which factor?",
    options: ["Pulse duration", "Beam diameter", "Damping material", "Spatial pulse length"],
    correct: 1,
    explanation: "Lateral Resolution = Beam Diameter. It is Narrowest at the focal point."
  },
  {
    id: 5,
    category: "Artifacts",
    question: "Which artifact results from sound traveling at a speed significantly SLOWER than 1,540 m/s?",
    options: ["Mirror Image", "Propagation Speed Error", "Aliasing", "Reverberation"],
    correct: 1,
    explanation: "Speed error occurs when the medium's speed differs from 1,540 m/s. Slower speeds result in reflectors being placed too deep."
  },
  {
    id: 6,
    category: "Safety",
    question: "The ALARA principle primarily concerns which of the following?",
    options: ["Increasing frequency", "Minimizing exposure time", "Maximizing contrast", "Optimizing PRF"],
    correct: 1,
    explanation: "As Low As Reasonably Achievable (ALARA) focuses on minimizing output power and exposure time to reduce potential bioeffects."
  },
  {
    id: 7,
    category: "Physics",
    question: "Which frequency will result in the SHORTEST wavelength in soft tissue?",
    options: ["2.0 MHz", "5.0 MHz", "7.5 MHz", "12.0 MHz"],
    correct: 3,
    explanation: "Frequency and wavelength are inversely related (λ = c/f). Higher frequency = shorter wavelength."
  },
  {
    id: 8,
    category: "Transducer",
    question: "What is the purpose of the matching layer in an ultrasound transducer?",
    options: ["To reduce ringing", "To increase current", "To reduce impedance mismatch", "To focus the beam"],
    correct: 2,
    explanation: "The matching layer (typically 1/4 wavelength thick) reduces the impedance mismatch between PZT and skin, increasing transmission."
  },
  {
    id: 9,
    category: "Hemodynamics",
    question: "In a stenotic vessel, where is the pressure the LOWEST?",
    options: ["Proximal to the stenosis", "At the narrowest part (venna contracta)", "Distal to the stenosis", "In the pre-stenotic zone"],
    correct: 1,
    explanation: "According to Bernoulli's principle, as velocity increases at the stenosis, pressure must decrease to maintain total energy."
  },
  {
    id: 10,
    category: "Artifacts",
    question: "Which artifact is characterized by a series of closely spaced reflections parallel to the sound beam's main axis?",
    options: ["Comet tail", "Shadowing", "Refraction", "Enhancement"],
    correct: 0,
    explanation: "Comet tail (or ring-down) artifact is a form of reverberation caused by small reflectors like gas bubbles or surgical clips."
  }
];

interface MockRegistryExamProps {
  onComplete?: (score: number) => void;
}

export const MockRegistryExam: React.FC<MockRegistryExamProps> = ({ onComplete }) => {
  const [examStarted, setExamStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes for expanded demo
  const [resultsShown, setResultsShown] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && !resultsShown && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !resultsShown) {
      finishExam();
    }
    return () => clearInterval(timer);
  }, [examStarted, resultsShown, timeLeft]);

  const finishExam = () => {
    let correctCount = 0;
    EXAM_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });
    const finalScore = (correctCount / EXAM_QUESTIONS.length) * 100;
    setResultsShown(true);
    toast.info("Exam submitted! Analyzing neural retention...");
    onComplete?.(finalScore);
  };

  const { score, categoryScores } = useMemo(() => {
    let correctCount = 0;
    const catStats: Record<string, { total: number, correct: number }> = {};

    EXAM_QUESTIONS.forEach(q => {
      if (!catStats[q.category]) catStats[q.category] = { total: 0, correct: 0 };
      catStats[q.category].total++;
      if (userAnswers[q.id] === q.correct) {
        correctCount++;
        catStats[q.category].correct++;
      }
    });

    return { 
      score: (correctCount / EXAM_QUESTIONS.length) * 100,
      categoryScores: Object.entries(catStats).map(([name, stats]) => ({
        name,
        percentage: (stats.correct / stats.total) * 100
      }))
    };
  }, [userAnswers, resultsShown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setExamStarted(true);
    setCurrentIdx(0);
    setUserAnswers({});
    setTimeLeft(1800);
    setResultsShown(false);
  };

  if (!examStarted) {
    return (
      <div className="bg-slate-950 rounded-[3rem] p-12 text-white shadow-2xl border border-white/5 flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-700">
         <div className="p-6 bg-indigo-600 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20">
            <Trophy size={64} className="text-white" />
         </div>
         <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">Mock Registry Exam</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em]">ARDMS SPI Simulation Environment (v2.0)</p>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-8">
            {[
               { icon: Timer, label: "30 Minute Clock", color: "text-amber-500" },
               { icon: Brain, label: "Cross-Domain Log", color: "text-indigo-400" },
               { icon: Target, label: "Weighted Scaling", color: "text-emerald-400" },
               { icon: ShieldCheck, label: "Pass/Fail Logic", color: "text-rose-400" }
            ].map(item => (
               <div key={item.label} className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                  <item.icon size={24} className={item.color} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item.label}</p>
               </div>
            ))}
         </div>

         <div className="pt-8">
            <button 
               onClick={handleStart}
               className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-2xl hover:scale-105 flex items-center gap-4"
            >
               Initialize Examination <Zap size={20} />
            </button>
            <p className="mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-50 italic">"Registry mastery is 50% physics and 50% reading the question twice."</p>
         </div>
      </div>
    );
  }

  if (resultsShown) {
    return (
      <div className="bg-slate-950 rounded-[3rem] p-12 text-white shadow-2xl border border-white/5 space-y-12 animate-in zoom-in duration-700 max-w-6xl mx-auto">
         <div className="text-center space-y-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Neuro-Performance Summary</h2>
            <div className="flex items-center justify-center gap-6 pt-4">
               <div className="text-center">
                  <p className="text-5xl font-black text-indigo-400 italic">{Math.round(score)}%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 pt-2">Final Neural Grade</p>
               </div>
               <div className="h-16 w-px bg-white/10" />
               <div className="text-center">
                  <p className="text-5xl font-black text-emerald-400 italic">{score >= 75 ? 'PASS' : 'FAIL'}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 pt-2">Registry Readiness</p>
               </div>
            </div>
         </div>

         {/* Category Breakdown */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryScores.map(cat => (
               <div key={cat.name} className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{cat.name}</span>
                     <span className={`text-xs font-black ${cat.percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>{Math.round(cat.percentage)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        className={`h-full ${cat.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                     />
                  </div>
               </div>
            ))}
         </div>

         <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 sticky top-0 bg-slate-950 py-2">Full Heuristic Review</h3>
            {EXAM_QUESTIONS.map((q, idx) => (
               <div key={q.id} className={`p-8 rounded-[2rem] border ${userAnswers[q.id] === q.correct ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                  <div className="flex justify-between items-start gap-4 mb-4">
                     <p className="text-sm font-bold leading-relaxed">{q.question}</p>
                     <span className="shrink-0 px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-500">{q.category}</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-stretch gap-4 text-xs font-mono">
                     <div className={`p-4 rounded-xl font-bold flex-1 border ${userAnswers[q.id] === q.correct ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-rose-500/30 text-rose-400 bg-rose-500/10'}`}>
                        <span className="opacity-40 block mb-1">USER_INPUT:</span>
                        {q.options[userAnswers[q.id]] || 'NULL_SELECTION'}
                     </div>
                     <div className="p-4 rounded-xl font-bold flex-1 border border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                        <span className="opacity-40 block mb-1">REGISTRY_LOGIC:</span>
                        {q.options[q.correct]}
                     </div>
                  </div>
                  <div className="mt-6 flex items-start gap-3 p-5 bg-white/5 rounded-2xl text-[11px] font-medium text-slate-400 italic leading-relaxed">
                     <Brain size={16} className="text-indigo-400 shrink-0" />
                     {q.explanation}
                  </div>
               </div>
            ))}
         </div>

         <div className="flex justify-center pt-8">
            <button 
               onClick={handleStart}
               className="px-12 py-5 bg-white text-slate-950 font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl active:scale-95"
            >
               Re-Synchronize Logic
            </button>
         </div>
      </div>
    );
  }

  const q = EXAM_QUESTIONS[currentIdx];

  return (
    <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl border border-white/5 space-y-10 animate-in slide-in-from-bottom duration-500 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
               <Brain size={24} />
            </div>
            <div>
               <h4 className="text-xl font-black italic tracking-tighter uppercase">Registry Sandbox</h4>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subject: {q.category}</p>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="text-right">
               <p className="text-2xl font-black italic text-rose-500">{formatTime(timeLeft)}</p>
               <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">System Uptime</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-right">
               <p className="text-2xl font-black italic text-indigo-400">{currentIdx + 1}/{EXAM_QUESTIONS.length}</p>
               <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">Unit Stream</p>
            </div>
         </div>
      </div>

      <div className="space-y-8 min-h-[300px]">
         <div className="flex gap-6 items-start">
            <HelpCircle size={32} className="text-slate-700 shrink-0" />
            <h3 className="text-2xl font-black leading-tight tracking-tight">{q.question}</h3>
         </div>

         <div className="grid gap-4">
            {q.options.map((opt, i) => (
               <button 
                  key={i}
                  onClick={() => setUserAnswers(prev => ({...prev, [q.id]: i}))}
                  className={`p-6 rounded-2xl text-left font-bold transition-all border-2 flex justify-between items-center group ${
                     userAnswers[q.id] === i 
                     ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl scale-[1.01]' 
                     : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                  }`}
               >
                  <span className="text-sm">{opt}</span>
                  {userAnswers[q.id] === i ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-white/10 group-hover:border-white/30" />}
               </button>
            ))}
         </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex justify-between items-center">
         <button 
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            className="px-8 py-3 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all disabled:opacity-30"
         >
            Previous Unit
         </button>
         
         {currentIdx === EXAM_QUESTIONS.length - 1 ? (
            <button 
               onClick={finishExam}
               className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 transition-all"
            >
               Finalize Sequence <ShieldCheck size={20} />
            </button>
         ) : (
            <button 
               onClick={() => setCurrentIdx(prev => prev + 1)}
               className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 transition-all"
            >
               Synchronize Next <ArrowRight size={20} />
            </button>
         )}
      </div>
    </div>
  );
};
