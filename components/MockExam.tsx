
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, 
  RotateCcw, Trophy, BookOpen, Brain, Zap, Target,
  ChevronRight, ChevronLeft, ShieldCheck, Activity
} from 'lucide-react';
import { spiQuestions, SPIQuestion } from '../data/spiQuestions';

interface MockExamProps {
  onComplete: (score: number, categoryScores: Record<string, number>) => void;
  onExit: () => void;
}

export const MockExam: React.FC<MockExamProps> = ({ onComplete, onExit }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 2 hours in seconds
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Timer logic
  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIdx: number) => {
    if (isFinished && !isReviewMode) return;
    setAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionIdx }));
  };

  const finishExam = () => {
    setIsFinished(true);
    const score = calculateScore();
    const categoryScores = calculateCategoryScores();
    onComplete(score, categoryScores);
  };

  const calculateScore = () => {
    let correct = 0;
    spiQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / spiQuestions.length) * 100);
  };

  const calculateCategoryScores = () => {
    const categoryStats: Record<string, { correct: number, total: number }> = {};
    
    spiQuestions.forEach((q, idx) => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { correct: 0, total: 0 };
      }
      categoryStats[q.category].total++;
      if (answers[idx] === q.correctAnswer) {
        categoryStats[q.category].correct++;
      }
    });

    const scores: Record<string, number> = {};
    Object.keys(categoryStats).forEach(cat => {
      scores[cat] = Math.round((categoryStats[cat].correct / categoryStats[cat].total) * 100);
    });
    return scores;
  };

  const currentQuestion = spiQuestions[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / spiQuestions.length) * 100;

  if (isFinished && !isReviewMode) {
    const score = calculateScore();
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-700">
        <div className="tech-card max-w-2xl w-full p-8 md:p-16 text-center space-y-8 border-b-[12px] border-indigo-600/20">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-4xl shadow-indigo-500/30">
            <Trophy size={48} className="text-white md:w-16 md:h-16" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter">Simulation Complete</h2>
            <p className="micro-label text-indigo-400">Neural Alignment Results</p>
          </div>
          
          <div className="flex items-baseline justify-center gap-4">
            <span className="text-7xl md:text-[10rem] font-black text-white drop-shadow-2xl glitch-text" data-text={score}>{score}</span>
            <span className="text-2xl md:text-5xl font-black opacity-40">PERCENT</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setIsReviewMode(true)}
              className="btn-secondary w-full"
            >
              <BookOpen size={20} /> Review Logic
            </button>
            <button 
              onClick={onExit}
              className="btn-primary w-full"
            >
              <ArrowRight size={20} /> Exit Matrix
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-12 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 tech-card p-6 md:p-10 rounded-[2.5rem] border-b-4 border-indigo-600/20">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter">SPI Mock Exam</h2>
            <p className="micro-label text-slate-500">Registry Stress-Test Simulation</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="micro-label">Time Remaining</span>
            <div className={`text-2xl md:text-4xl font-mono font-black ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-indigo-400'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          {!isReviewMode && (
            <button 
              onClick={() => { if(window.confirm('Are you sure you want to end the simulation?')) finishExam(); }}
              className="px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
            >
              End Session
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        />
      </div>

      {/* Question Area */}
      <div className="flex-1 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="tech-card p-8 md:p-16 min-h-[400px] flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                    {currentQuestion.category}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">Question {currentQuestionIdx + 1} of {spiQuestions.length}</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight">
                  {currentQuestion.question}
                </h3>
                
                <div className="grid gap-4">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = answers[currentQuestionIdx] === idx;
                    const isCorrect = currentQuestion.correctAnswer === idx;
                    const showSuccess = isReviewMode && isCorrect;
                    const showError = isReviewMode && isSelected && !isCorrect;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={isReviewMode}
                        className={`w-full p-6 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                          showSuccess ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                          showError ? 'bg-rose-500/20 border-rose-500 text-rose-400' :
                          isSelected ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' :
                          'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-sm md:text-lg font-bold">{option}</span>
                        {showSuccess && <CheckCircle2 size={20} />}
                        {showError && <AlertCircle size={20} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {isReviewMode && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 p-8 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/10 space-y-6"
                >
                  <div className="flex items-center gap-3 text-indigo-400">
                    <Brain size={24} />
                    <h4 className="micro-label">Neural Logic Reconstruction</h4>
                  </div>
                  <div className="lecture-content !text-base md:!text-lg italic opacity-80">
                    {currentQuestion.explanation}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center">
            <button 
              onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="btn-secondary"
            >
              <ChevronLeft size={20} /> Previous Unit
            </button>
            
            {currentQuestionIdx === spiQuestions.length - 1 && !isReviewMode ? (
              <button 
                onClick={finishExam}
                className="btn-primary"
              >
                Finalize Simulation <Zap size={20} />
              </button>
            ) : (
              <button 
                onClick={() => setCurrentQuestionIdx(prev => Math.min(spiQuestions.length - 1, prev + 1))}
                disabled={currentQuestionIdx === spiQuestions.length - 1}
                className="btn-primary"
              >
                Next Unit <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar / Question Grid */}
        <div className="space-y-8">
          <div className="tech-card p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-indigo-400" />
              <h4 className="micro-label">Neural Grid Status</h4>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {spiQuestions.map((_, idx) => {
                const isAnswered = answers[idx] !== undefined;
                const isCurrent = currentQuestionIdx === idx;
                const isCorrect = isReviewMode && answers[idx] === spiQuestions[idx].correctAnswer;
                const isWrong = isReviewMode && answers[idx] !== undefined && answers[idx] !== spiQuestions[idx].correctAnswer;

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`w-full aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all border ${
                      isCurrent ? 'border-indigo-500 bg-indigo-600 text-white scale-110 shadow-lg z-10' :
                      isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                      isWrong ? 'bg-rose-500/20 border-rose-500 text-rose-400' :
                      isAnswered ? 'bg-white/20 border-white/40 text-white' :
                      'bg-white/5 border-white/10 text-slate-500 hover:border-white/30'
                    }`}
                  >
                    {(idx + 1).toString().padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>

          {isReviewMode && (
            <button 
              onClick={onExit}
              className="btn-primary w-full py-6"
            >
              Exit Review Matrix <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
