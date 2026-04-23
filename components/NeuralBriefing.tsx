
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, ShieldAlert, Brain, Sparkles, Activity, CheckCircle2, ChevronRight, Loader2, Target } from 'lucide-react';

interface NeuralBriefingProps {
  onClose: () => void;
  onNavigateToLesson: (moduleId: number, lessonId: number) => void;
}

export const NeuralBriefing: React.FC<NeuralBriefingProps> = ({ onClose, onNavigateToLesson }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // The video path provided by the user upload
  const videoSrc = "user_upload_0.mp4"; 

  const handleStartBriefing = () => {
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    setShowAssessment(true);
  };

  const checkAnswer = () => {
    const val = parseFloat(userAnswer);
    // Calculation: 
    // Wavelength = 1.54 / 2.5 = 0.616
    // SPL = 2 * 0.616 = 1.232
    // Resolution = SPL / 2 = 0.616
    if (Math.abs(val - 0.616) < 0.01) {
      setFeedback({ 
        correct: true, 
        message: "Neural Synchronization Successful. LARRD resolution at 2.5MHz with 2 cycles is 0.616mm. Since the gap is 1.0mm, the structures will be resolved. Clinical accuracy verified." 
      });
    } else {
      setFeedback({ 
        correct: false, 
        message: "Acoustic Mismatch. Re-calculate using the SPL/2 formula for a 2-cycle pulse at 2.5MHz." 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto">
      <div className="max-w-5xl w-full bg-slate-900 border border-white/10 rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-4xl relative flex flex-col md:flex-row min-h-[600px]">
        <button onClick={onClose} className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all z-50 border border-white/10">
          <X size={24} />
        </button>

        {/* Video Side */}
        <div className="flex-1 bg-black relative flex items-center justify-center">
          {!isPlaying ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-8">
              <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-4xl animate-pulse">
                <ShieldAlert size={48} className="text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Neural <br/><span className="text-gradient">Diagnostic</span> Briefing</h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                  "Transitioning from abstract physics to clinical operational rules in Axial Resolution."
                </p>
              </div>
              <button 
                onClick={handleStartBriefing}
                className="px-12 py-6 bg-white text-slate-900 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-4 group"
              >
                Initialize Transmission <Play size={18} fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="w-full h-full relative group">
              <video 
                ref={videoRef}
                src={videoSrc}
                autoPlay 
                controls
                onEnded={handleVideoEnd}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-8 left-8 p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Neural Link</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interaction Side */}
        <div className="w-full md:w-[400px] border-l border-white/10 p-8 md:p-12 flex flex-col gap-8 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <Brain className="text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none">Subject</h3>
              <p className="text-white font-black text-lg uppercase italic tracking-tight">Range Resolution Logic</p>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Target size={14} className="text-indigo-400" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Goal</span>
              </div>
              <p className="text-sm font-bold text-slate-300 italic leading-relaxed">
                "Solve the axial resolution constraint for a 2.5MHz probe to predict if cyst blur will occur."
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!showAssessment ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Frequency</p>
                      <p className="text-white font-black">2.5 MHz</p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Cyst Gap</p>
                      <p className="text-white font-black">1.0 mm</p>
                    </div>
                  </div>
                  <div className="p-6 bg-indigo-600/10 rounded-[2rem] border border-indigo-500/20 flex items-center gap-4">
                    <Loader2 size={24} className="text-indigo-400 animate-spin" />
                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-relaxed">
                      Awaiting completion of diagnostic video for assessment activation...
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Range Resolution (mm)</label>
                    <input 
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="0.000"
                      className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-mono focus:border-indigo-600 focus:outline-none transition-all"
                    />
                    <button 
                      onClick={checkAnswer}
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl"
                    >
                      Verify Neural Proof
                    </button>
                  </div>

                  {feedback && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-6 rounded-3xl border ${feedback.correct ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
                    >
                      <div className="flex items-start gap-3">
                        {feedback.correct ? <CheckCircle2 size={18} className="shrink-0" /> : <ShieldAlert size={18} className="shrink-0" />}
                        <p className="text-[11px] font-bold leading-relaxed">{feedback.message}</p>
                      </div>
                      {feedback.correct && (
                        <button 
                          onClick={() => onNavigateToLesson(5, 0)} // Navigate to Module 6 (index 5), Lesson 1 (index 0)
                          className="mt-6 flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:gap-3 transition-all"
                        >
                          Deep Dive: Axial Res (LARRD) <ChevronRight size={14}/>
                        </button>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between group">
             <div className="flex items-center gap-3">
                <Activity size={16} className="text-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Briefing Status: {showAssessment ? 'Complete' : 'Pending'}</span>
             </div>
             <Sparkles size={16} className="text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
