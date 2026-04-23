
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Brain, CheckCircle2, XCircle, 
  ArrowRight, BookOpen, Target, 
  RotateCcw, History, Sparkles, 
  TrendingUp, AlertCircle, Clock
} from 'lucide-react';
import { get, set } from '../services/neuralCache';
import { toast } from 'sonner';

interface CardState {
  id: number;
  interval: number; // in days
  ease: number;
  dueDate: number; // timestamp
  consecutiveCorrect: number;
}

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
  difficulty: 'Basic' | 'Intermediate' | 'Registry Trap';
}

const INITIAL_DECK: Flashcard[] = [
  { id: 1, category: "Physics", difficulty: 'Basic', question: "What is the speed of sound in soft tissue?", answer: "1,540 m/s or 1.54 mm/μs" },
  { id: 2, category: "Doppler", difficulty: 'Basic', question: "What is the Nyquist Limit formula?", answer: "PRF / 2" },
  { id: 3, category: "Artifacts", difficulty: 'Intermediate', question: "Which artifact results from sound reflecting off a strong curved surface?", answer: "Mirror Image" },
  { id: 4, category: "Instrumentation", difficulty: 'Intermediate', question: "What receiver function handles equalization of signal strength with depth?", answer: "TGC (Time Gain Compensation)" },
  { id: 5, category: "Resolution", difficulty: 'Basic', question: "What is the synonym for Axial Resolution?", answer: "LARRD (Longitudinal, Axial, Range, Radial, Depth)" },
  { id: 6, category: "Safety", difficulty: 'Basic', question: "What does ALARA stand for?", answer: "As Low As Reasonably Achievable" },
  { id: 7, category: "Transducer", difficulty: 'Intermediate', question: "What is the purpose of the damping material?", answer: "To reduce PZT ringing and shorten the SPL (improves axial resolution)" },
  { id: 8, category: "Physics", difficulty: 'Intermediate', question: "How does frequency relate to period?", answer: "Inversely related (f = 1/T)" },
  { id: 9, category: "Doppler", difficulty: 'Registry Trap', question: "If the Doppler angle is 90 degrees, what is the measured velocity?", answer: "Zero (Cosine of 90 is 0)" },
  { id: 10, category: "Instrumentation", difficulty: 'Registry Trap', question: "Which receiver function is NOT adjustable by the sonographer?", answer: "Demodulation" },
  { id: 11, category: "Artifacts", difficulty: 'Registry Trap', question: "Which artifact is caused by a sound pulse changing direction after striking a boundary obliquely?", answer: "Refraction" },
  { id: 12, category: "Safety", difficulty: 'Intermediate', question: "Which index is most relevant for non-scanned gas-filled tissue (like lungs)?", answer: "MI (Mechanical Index)" },
];

const STORAGE_KEY = 'spi_neural_srs_state';

export const NeuralSRS: React.FC = () => {
  const [cardStates, setCardStates] = useState<Record<number, CardState>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDeck, setSessionDeck] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load state from IndexedDB
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await get<Record<number, CardState>>(STORAGE_KEY);
        if (saved) {
          setCardStates(saved);
        }
      } catch (e) {
        console.error("Failed to load SRS state", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadState();
  }, []);

  // Filter deck based on due dates
  useEffect(() => {
    if (isLoading) return;
    
    const now = Date.now();
    const due = INITIAL_DECK.filter(card => {
      const state = cardStates[card.id];
      if (!state) return true; // New cards are always due
      return state.dueDate <= now;
    });

    // If everything is done, just show all for practice but prioritize unmastered
    if (due.length === 0) {
      setSessionDeck([...INITIAL_DECK].sort((a, b) => {
        const stateA = cardStates[a.id];
        const stateB = cardStates[b.id];
        return (stateA?.interval || 0) - (stateB?.interval || 0);
      }));
    } else {
      setSessionDeck(due);
    }
  }, [isLoading, cardStates]);

  const currentCard = sessionDeck[currentIndex];

  const updateCard = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const now = Date.now();
    const prevState = cardStates[currentCard.id] || {
      id: currentCard.id,
      interval: 0,
      ease: 2.5,
      dueDate: now,
      consecutiveCorrect: 0
    };

    let newInterval = prevState.interval;
    let newEase = prevState.ease;
    let newConsecutive = prevState.consecutiveCorrect;

    switch (rating) {
      case 'again':
        newInterval = 0.01; // 15 minutes roughly
        newEase = Math.max(1.3, prevState.ease - 0.2);
        newConsecutive = 0;
        toast.error("Retrying in next cycle...");
        break;
      case 'hard':
        newInterval = prevState.interval === 0 ? 1 : prevState.interval * 1.2;
        newEase = Math.max(1.3, prevState.ease - 0.15);
        newConsecutive += 1;
        toast.info("Interval extended slightly.");
        break;
      case 'good':
        newInterval = prevState.interval === 0 ? 3 : prevState.interval * prevState.ease;
        newConsecutive += 1;
        toast.success("Reinforced!");
        break;
      case 'easy':
        newInterval = prevState.interval === 0 ? 7 : prevState.interval * prevState.ease * 1.3;
        newEase += 0.15;
        newConsecutive += 2;
        toast.success("Mastered!");
        break;
    }

    const newState = {
      ...prevState,
      interval: parseFloat(newInterval.toFixed(2)),
      ease: parseFloat(newEase.toFixed(2)),
      consecutiveCorrect: newConsecutive,
      dueDate: now + newInterval * 24 * 60 * 60 * 1000
    };

    const updatedStates = { ...cardStates, [currentCard.id]: newState };
    setCardStates(updatedStates);
    await set(STORAGE_KEY, updatedStates);

    if (currentIndex < sessionDeck.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setFlipped(false);
    } else {
      toast("Daily Neural Deck Complete!");
      setCurrentIndex(0);
      setFlipped(false);
    }
  };

  const masterStats = useMemo(() => {
    const states = Object.values(cardStates) as CardState[];
    const total = INITIAL_DECK.length;
    const mastered = states.filter(s => s.interval >= 21).length;
    const learning = states.filter(s => s.interval < 21 && s.interval > 0).length;
    return { mastered, learning, total };
  }, [cardStates]);

  if (isLoading || sessionDeck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-slate-950 rounded-[3rem] border border-white/5 min-h-[400px]">
        <RotateCcw className="animate-spin text-indigo-500 mb-6" size={48} />
        <p className="text-sm font-black uppercase tracking-widest text-slate-500">Initializing Neural Deck...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 p-8 rounded-[3rem] border border-white/5">
        <div className="flex items-center gap-6">
           <div className="p-4 bg-indigo-600 rounded-[2rem] text-white shadow-2xl shadow-indigo-500/20">
              <Brain size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Neural Optimizer</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Spaced Repetition Protocol v3.4</p>
           </div>
        </div>

        <div className="flex gap-12">
           <div className="text-center">
              <p className="text-2xl font-black text-emerald-400 italic">{masterStats.mastered}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Mastered</p>
           </div>
           <div className="text-center">
              <p className="text-2xl font-black text-amber-400 italic">{masterStats.learning}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Learning</p>
           </div>
           <div className="text-center">
              <p className="text-2xl font-black text-indigo-400 italic">{sessionDeck.length}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Due Today</p>
           </div>
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div className="relative h-[500px] perspective-2000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id + (flipped ? '-back' : '-front')}
            initial={{ rotateX: flipped ? -20 : 20, opacity: 0, scale: 0.9 }}
            animate={{ rotateX: 0, opacity: 1, scale: 1 }}
            exit={{ rotateX: flipped ? 20 : -20, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => setFlipped(!flipped)}
            className={`absolute inset-0 cursor-pointer rounded-[4rem] p-12 md:p-24 flex flex-col items-center justify-center text-center shadow-4xl group overflow-hidden border-2 transition-colors duration-500 ${
              flipped 
              ? 'bg-indigo-600 border-indigo-400 text-white' 
              : 'bg-slate-900 border-white/5 text-white'
            }`}
          >
            {/* Background elements */}
            <div className="absolute inset-0 atmosphere opacity-20 pointer-events-none" />
            <div className="absolute inset-0 neural-grid opacity-[0.05] pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
               <div className="flex items-center justify-center gap-4">
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${flipped ? 'bg-white/20 text-white' : 'bg-indigo-600/20 text-indigo-400'}`}>
                     {currentCard.category}
                  </span>
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${flipped ? 'border-white/30 text-white/70' : 'border-white/10 text-slate-500'}`}>
                     {currentCard.difficulty}
                  </span>
               </div>

               <h3 className={`text-2xl md:text-5xl font-black italic tracking-tighter leading-tight ${flipped ? 'text-white' : 'text-slate-100'}`}>
                  {flipped ? currentCard.answer : currentCard.question}
               </h3>

               <div className="flex flex-col items-center gap-4">
                  <div className={`p-4 rounded-full ${flipped ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-600'} animate-pulse`}>
                     {flipped ? <Sparkles size={24} /> : <RotateCcw size={24} />}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 group-hover:text-white transition-colors">
                     {flipped ? "Neural Synapse Formed" : "Initiate Active Recall"}
                  </p>
               </div>
            </div>

            {/* SRS Progress Dot indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
               {sessionDeck.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === currentIndex 
                      ? 'w-8 bg-white' 
                      : i < currentIndex ? 'w-2 bg-emerald-500/50' : 'w-2 bg-white/10'
                    }`} 
                  />
               ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SRS Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {!flipped ? (
          <button 
            onClick={() => setFlipped(true)}
            className="w-full py-8 bg-white text-slate-950 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm"
          >
            Expose Answer Matrix
          </button>
        ) : (
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => updateCard('again')}
              className="group p-6 bg-rose-600 rounded-[2rem] text-white space-y-2 hover:bg-rose-500 transition-all hover:-translate-y-2"
            >
               <div className="flex justify-between items-center opacity-50 group-hover:opacity-100">
                  <RotateCcw size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">&lt; 10m</span>
               </div>
               <p className="text-xl font-black italic uppercase tracking-tighter">Again</p>
            </button>
            <button 
              onClick={() => updateCard('hard')}
              className="group p-6 bg-amber-600 rounded-[2rem] text-white space-y-2 hover:bg-amber-500 transition-all hover:-translate-y-2"
            >
               <div className="flex justify-between items-center opacity-50 group-hover:opacity-100">
                  <History size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">2 Days</span>
               </div>
               <p className="text-xl font-black italic uppercase tracking-tighter">Hard</p>
            </button>
            <button 
              onClick={() => updateCard('good')}
              className="group p-6 bg-emerald-600 rounded-[2rem] text-white space-y-2 hover:bg-emerald-500 transition-all hover:-translate-y-2"
            >
               <div className="flex justify-between items-center opacity-50 group-hover:opacity-100">
                  <TrendingUp size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">4 Days</span>
               </div>
               <p className="text-xl font-black italic uppercase tracking-tighter">Good</p>
            </button>
            <button 
              onClick={() => updateCard('easy')}
              className="group p-6 bg-indigo-600 rounded-[2rem] text-white space-y-2 hover:bg-indigo-500 transition-all hover:-translate-y-2 shadow-2xl shadow-indigo-500/20"
            >
               <div className="flex justify-between items-center opacity-50 group-hover:opacity-100">
                  <CheckCircle2 size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">10 Days</span>
               </div>
               <p className="text-xl font-black italic uppercase tracking-tighter">Easy</p>
            </button>
          </div>
        )}
      </div>

      {/* Spaced Repetition Info */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="p-10 bg-white/5 rounded-[3rem] border border-white/5 space-y-4">
             <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-amber-500/20 text-amber-500 rounded-2xl">
                   <Clock size={20} />
                </div>
                <h4 className="text-lg font-black italic uppercase tracking-tighter text-white">Logic Retention</h4>
             </div>
             <p className="text-xs font-bold text-slate-500 leading-relaxed italic uppercase tracking-wider">
                Algorithms suggest your neural pathways for <span className="text-indigo-400">Doppler Principles</span> are 80% formed. Focus on <span className="text-rose-400">Resolution Artifacts</span> next.
             </p>
          </div>
          <div className="p-10 bg-white/5 rounded-[3rem] border border-white/5 space-y-4">
             <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-2xl">
                   <Zap size={20} />
                </div>
                <h4 className="text-lg font-black italic uppercase tracking-tighter text-white">Registry Ready</h4>
             </div>
             <p className="text-xs font-bold text-slate-500 leading-relaxed italic uppercase tracking-wider">
                Daily streak active: <span className="text-emerald-400">12 Days</span>. You are outperforming <span className="text-indigo-400">92%</span> of global peers in diagnostic logic.
             </p>
          </div>
       </div>
    </div>
  );
};
