
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Zap, AlertCircle, CheckCircle2, Trophy, ArrowRight } from 'lucide-react';

interface DrillQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const DRILLS: Record<string, DrillQuestion[]> = {
  'default': [
    {
      question: "What is the standard speed of sound in soft tissue?",
      options: ["1,450 m/s", "1,540 m/s", "3,300 m/s", "1,540 mm/µs"],
      correct: 1,
      explanation: "1,540 m/s (or 1.54 mm/µs) is the assumed constant for soft tissue in diagnostic ultrasound."
    }
  ],
  'Math': [
    {
      question: "If a wave's intensity increases by 10 dB, what happens to the power?",
      options: ["Doubles", "Triples", "Increases by 10x", "Increases by 100x"],
      correct: 2,
      explanation: "A 10 dB increase corresponds to a tenfold increase in power/intensity."
    }
  ],
  'Waves': [
    {
      question: "If frequency increases, what happens to the period?",
      options: ["Increases", "Decreases", "Stays the same", "Doubles"],
      correct: 1,
      explanation: "Frequency and period are inversely related (T = 1/f)."
    }
  ],
  'Attenuation': [
    {
      question: "Which of the following contributes the MOST to attenuation in soft tissue?",
      options: ["Reflection", "Scattering", "Absorption", "Refraction"],
      correct: 2,
      explanation: "Absorption (conversion of sound to heat) is the dominant factor in attenuation."
    }
  ],
  'Pulsed': [
    {
      question: "What is the duty factor of a Continuous Wave (CW) transducer?",
      options: ["0.1%", "1%", "50%", "100%"],
      correct: 3,
      explanation: "CW is always 'on', so its duty factor is 100% (or 1.0)."
    }
  ],
  'Transducer': [
    {
      question: "Which component of the transducer reduces 'ringing' and shortens the pulse?",
      options: ["Matching Layer", "Backing Material", "PZT", "Acoustic Insulator"],
      correct: 1,
      explanation: "Backing material (damping) shortens the pulse length, improving axial resolution."
    }
  ],
  'Resolution': [
    {
      question: "Axial resolution is determined by which parameter?",
      options: ["Beam Diameter", "Pulse Duration", "Spatial Pulse Length", "Frame Rate"],
      correct: 2,
      explanation: "Axial Resolution = SPL / 2. Shorter pulses provide better axial resolution."
    }
  ],
  'Instrumentation': [
    {
      question: "Which receiver function is NOT adjustable by the sonographer?",
      options: ["Amplification", "Compensation", "Demodulation", "Rejection"],
      correct: 2,
      explanation: "Demodulation (rectification and smoothing) is an automatic process performed by the receiver."
    }
  ],
  'Doppler': [
    {
      question: "At what angle is the Doppler shift at its maximum?",
      options: ["0 degrees", "45 degrees", "90 degrees", "180 degrees"],
      correct: 0,
      explanation: "Cosine of 0 is 1, providing the maximum frequency shift."
    }
  ],
  'Artifacts': [
    {
      question: "Which artifact results from sound traveling at a speed other than 1,540 m/s?",
      options: ["Mirror Image", "Speed Error Artifact", "Reverberation", "Shadowing"],
      correct: 1,
      explanation: "Speed error occurs when the medium's speed differs from the assumed 1,540 m/s, causing reflectors to be placed at incorrect depths."
    }
  ],
  'Safety': [
    {
      question: "Which intensity is most relevant to the study of tissue heating (bioeffects)?",
      options: ["SPTP", "SATA", "SPTA", "SATR"],
      correct: 2,
      explanation: "SPTA (Spatial Peak Temporal Average) is the most important intensity in terms of thermal bioeffects."
    }
  ],
  'Harmonics': [
    {
      question: "Where in the ultrasound beam are harmonics primarily created?",
      options: ["Near field", "Far field", "Mid-field (Center of beam)", "Edges of the beam"],
      correct: 2,
      explanation: "Harmonics are created deep in the tissue (mid-field) and only along the high-intensity center of the beam."
    }
  ]
};

export const RegistryReadyDrill: React.FC<{ topic: string }> = ({ topic }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const questions = DRILLS[Object.keys(DRILLS).find(k => topic.includes(k)) || 'default'];
  const current = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === current.correct;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const next = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setIsCorrect(null);
    }
  };

  return (
    <div className="glass-panel p-10 md:p-16 rounded-[3rem] md:rounded-[5rem] border border-white/10 space-y-10 md:space-y-12 relative overflow-hidden shadow-4xl group/drill">
      <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      
      <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover/drill:opacity-[0.1] transition-opacity duration-1000 rotate-12">
        <ShieldCheck size={180} className="text-indigo-500" />
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <div className="p-4 bg-indigo-600 rounded-2xl md:rounded-3xl text-white shadow-2xl shadow-indigo-500/40 border border-white/20 group-hover/drill:scale-110 transition-transform duration-500">
          <Zap size={28} className="md:w-9 md:h-9" />
        </div>
        <div>
          <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Registry Ready Drill</h3>
          <div className="flex items-center gap-3">
            <span className="text-indigo-400 text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em]">Neural Verification Active</span>
            <div className="h-px w-12 bg-indigo-500/30" />
          </div>
        </div>
      </div>

      <div className="space-y-8 md:space-y-12 relative z-10">
        <div className="p-8 md:p-12 bg-slate-950/50 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
          <p className="text-xl md:text-3xl font-black text-white leading-tight italic tracking-tight">
            <span className="text-indigo-500 mr-4">Q.</span>
            {current.question}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`p-8 rounded-2xl md:rounded-3xl border-2 text-left transition-all duration-500 flex items-center justify-between group/opt relative overflow-hidden ${
                selected === i 
                  ? (isCorrect ? 'bg-emerald-500 border-emerald-400 text-white shadow-2xl shadow-emerald-500/20' : 'bg-rose-500 border-rose-400 text-white shadow-2xl shadow-rose-500/20')
                  : (selected !== null && i === current.correct ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]')
              }`}
            >
              <div className="relative z-10 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black group-hover/opt:bg-white/20 transition-colors">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-black text-lg md:text-xl tracking-tight italic">{opt}</span>
              </div>
              
              <div className="relative z-10">
                {selected === i && (
                  isCorrect ? <CheckCircle2 size={24} className="animate-in zoom-in" /> : <AlertCircle size={24} className="animate-in zoom-in" />
                )}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border-2 relative overflow-hidden ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'}`}
            >
              <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
              <div className="flex items-start gap-6 relative z-10">
                <div className={`p-3 rounded-xl ${isCorrect ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                  <Info size={24}/>
                </div>
                <div className="space-y-3">
                  <p className="font-black uppercase text-[11px] md:text-[13px] tracking-[0.4em]">{isCorrect ? 'Neural Alignment Confirmed' : 'Heuristic Correction Required'}</p>
                  <p className="text-lg md:text-2xl font-bold leading-relaxed italic text-white/90">{current.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selected !== null && (
          <div className="flex justify-end relative z-10">
            <button 
              onClick={next}
              className="flex items-center gap-4 px-10 py-6 bg-indigo-600 text-white rounded-full font-black uppercase tracking-widest text-[12px] hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 group/next"
            >
              {currentIdx < questions.length - 1 ? 'Next Neural Drill' : 'Synthesis Complete'} 
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Info = ({ size }: { size: number }) => <AlertCircle size={size} />;
