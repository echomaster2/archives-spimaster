
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, RotateCcw, Brain, CheckCircle2, XCircle, ArrowRight, BookOpen, Target } from 'lucide-react';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const DECK: Flashcard[] = [
  { id: 1, category: "Physics", question: "What is the speed of sound in soft tissue?", answer: "1,540 m/s or 1.54 mm/μs" },
  { id: 2, category: "Doppler", question: "What is the Nyquist Limit formula?", answer: "PRF / 2" },
  { id: 3, category: "Artifacts", question: "Which artifact results from sound reflecting off a strong curved surface?", answer: "Mirror Image" },
  { id: 4, category: "Instrumentation", question: "What receiver function handles equalization of signal strength with depth?", answer: "TGC (Time Gain Compensation)" },
  { id: 5, category: "Resolution", question: "What is the synonym for Axial Resolution?", answer: "LARRD (Longitudinal, Axial, Range, Radial, Depth)" },
  { id: 6, category: "Safety", question: "What does ALARA stand for?", answer: "As Low As Reasonably Achievable" },
  { id: 7, category: "Transducer", question: "What is the purpose of the damping material?", answer: "To reduce PZT ringing and shorten the SPL (improves axial resolution)" },
];

export const FlashcardSystem: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const card = DECK[currentIdx];

  const handleNext = (mastered: boolean) => {
    if (mastered) setMasteredCount(prev => prev + 1);
    
    if (currentIdx < DECK.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setFlipped(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setFlipped(false);
    setMasteredCount(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white border border-white/5 text-center space-y-8 animate-in zoom-in duration-700">
        <div className="p-6 bg-emerald-600 rounded-[2rem] shadow-2xl shadow-emerald-500/20 inline-block">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Deck Synchronized</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Neural Retention: {Math.round((masteredCount / DECK.length) * 100)}%</p>
        </div>
        <button 
          onClick={handleReset}
          className="px-10 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all"
        >
          Re-Initialize Deck
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-12 py-8">
      <div className="flex items-center justify-between px-4">
         <div className="flex items-center gap-3">
            <Zap className="text-indigo-400" size={18} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Neural Flashcards</h3>
         </div>
         <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
            Unit {currentIdx + 1} / {DECK.length}
         </span>
      </div>

      <div 
        className="relative h-[400px] cursor-pointer group"
        onClick={() => setFlipped(!flipped)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={flipped ? 'back' : 'front'}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`absolute inset-0 rounded-[3rem] border-2 p-12 flex flex-col items-center justify-center text-center shadow-2xl backface-hidden ${
              flipped 
              ? 'bg-indigo-600 border-indigo-400 text-white' 
              : 'bg-slate-900/50 border-white/10 text-white backdrop-blur-xl'
            }`}
          >
            <div className="absolute top-8 left-8 opacity-20">
               {flipped ? <Target size={60} /> : <BookOpen size={60} />}
            </div>

            <span className={`text-[8px] font-black uppercase tracking-[0.4em] mb-6 px-3 py-1 rounded-full ${flipped ? 'bg-white/20 text-white' : 'bg-indigo-600/20 text-indigo-400'}`}>
               {card.category}
            </span>

            <h4 className={`text-2xl font-black italic tracking-tight leading-relaxed ${flipped ? 'text-white' : 'text-slate-100'}`}>
               {flipped ? card.answer : card.question}
            </h4>

            <div className="absolute bottom-10 left-0 right-0 text-center">
               <p className="text-[8px] font-black uppercase tracking-[0.6em] text-slate-500 group-hover:text-white/40 transition-colors">
                  {flipped ? "Neural Target Acquired" : "Click to Pulse Logic"}
               </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
         <button 
            onClick={(e) => { e.stopPropagation(); handleNext(false); }}
            className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:bg-rose-500 hover:text-white hover:border-rose-400 transition-all font-black uppercase text-[10px] tracking-widest"
          >
            <XCircle size={16} /> Needs Work
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(true); }}
            className="flex-1 py-5 bg-indigo-600 rounded-2xl flex items-center justify-center gap-3 text-white hover:bg-emerald-600 transition-all font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-950/40"
          >
            <Brain size={16} /> Mastered
          </button>
      </div>

      <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 flex gap-4 items-start">
         <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500 shrink-0">
            <Zap size={16} />
         </div>
         <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
            Studies show that immediate recall within <span className="text-white">7 seconds</span> increases long-term neural retention by up to <span className="text-white">40%</span>.
         </p>
      </div>
    </div>
  );
};
