
import React, { useState } from 'react';
/* Added Loader2 to imports */
import { RotateCw, ChevronRight, ChevronLeft, CheckCircle2, RotateCcw, Brain, Sparkles, X, Loader2 } from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardStudyProps {
  cards: Flashcard[];
  onClose: () => void;
}

export const FlashcardStudy: React.FC<FlashcardStudyProps> = ({ cards, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [masteredIndices, setMasteredIndices] = useState<Set<number>>(new Set());

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const markMastered = () => {
    if (!masteredIndices.has(currentIndex)) {
      setMasteredIndices(new Set([...masteredIndices, currentIndex]));
      setMasteredCount(prev => prev + 1);
    }
    handleNext();
  };

  if (cards.length === 0) return (
    <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-[3rem] border shadow-sm h-full">
      <Loader2 className="animate-spin text-indigo-600 mb-4" />
      <p className="font-black text-xs uppercase tracking-widest text-slate-400">Loading AI High-Yield Content...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 animate-in zoom-in-95 duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
               <Brain size={20} />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Recall Mode</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{cards.length} Cards in Deck</p>
            </div>
         </div>
         <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <X size={20}/>
         </button>
      </div>

      <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm flex-1 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
           <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div 
          className="group perspective-1000 w-full max-w-lg cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full aspect-[4/3] transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-slate-50 rounded-[2.5rem] border-4 border-slate-100 p-12 flex flex-col items-center justify-center text-center shadow-xl">
               <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8">Registry Term</div>
               <h4 className="text-3xl font-black text-slate-900 leading-tight">{currentCard.front}</h4>
               <div className="mt-12 text-slate-400 animate-bounce">
                  <RotateCw size={24} />
               </div>
            </div>
            
            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center text-white shadow-2xl">
               <div className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em] mb-8 opacity-70">Definition / Answer</div>
               <p className="text-xl font-bold leading-relaxed">{currentCard.back}</p>
               <div className="mt-12 text-indigo-300 opacity-50">
                  <Sparkles size={24} />
               </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-6">
           <button onClick={handlePrev} disabled={currentIndex === 0} className="p-5 rounded-full border-2 border-slate-100 hover:border-slate-300 transition-all disabled:opacity-20">
              <ChevronLeft size={24} />
           </button>
           <button 
              onClick={markMastered}
              className={`px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${
                masteredIndices.has(currentIndex) ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-200' : 'bg-slate-900 text-white shadow-xl hover:scale-105'
              }`}
           >
              {masteredIndices.has(currentIndex) ? <CheckCircle2 size={20}/> : <Brain size={20}/>}
              {masteredIndices.has(currentIndex) ? 'Mastered' : 'Mark Mastered'}
           </button>
           <button onClick={handleNext} disabled={currentIndex === cards.length - 1} className="p-5 rounded-full border-2 border-slate-100 hover:border-slate-300 transition-all disabled:opacity-20">
              <ChevronRight size={24} />
           </button>
        </div>

        <div className="mt-10 flex items-center gap-8">
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastered</span>
              <span className="text-2xl font-black text-emerald-500">{masteredCount}</span>
           </div>
           <div className="w-px h-8 bg-slate-100" />
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remaining</span>
              <span className="text-2xl font-black text-slate-700">{cards.length - masteredCount}</span>
           </div>
        </div>
      </div>

      <div className="flex justify-center">
         <button onClick={() => setCurrentIndex(0)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">
            <RotateCcw size={14}/> Reset Deck
         </button>
      </div>
    </div>
  );
};
