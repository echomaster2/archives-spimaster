
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, Zap, Activity, Info, Sparkles, 
  ImageIcon, CheckCircle2, XCircle, AlertCircle, 
  HelpCircle, ArrowRight, Brain, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { NeuralPreceptor } from './NeuralPreceptor';

interface DailyChallenge {
  id: string;
  title: string;
  problem: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  domain: string;
}

const CHALLENGES: DailyChallenge[] = [
  {
    id: 'day1',
    title: "The Brewster Angle",
    problem: "When ultrasound strikes a boundary between two media at a specific angle, all sound is refracted and none is reflected. This is known as the critical angle. But what happens if the pulse strikes at exactly 90 degrees and the impedances are identical?",
    options: [
      "Total reflection occurs",
      "Total transmission occurs (no reflection)",
      "Refraction occurs at the interface",
      "The pulse is absorbed by the first medium"
    ],
    correctIdx: 1,
    explanation: "If the incident angle is 90° (normal incidence) and the impedances are identical, no reflection occurs. 100% of the intensities are transmitted.",
    domain: "Acoustic Impedance"
  },
  {
    id: 'day2',
    title: "The PRF Paradox",
    problem: "You increase the imaging depth from 5cm to 10cm. What happens to the Pulse Repetition Frequency (PRF)?",
    options: [
      "It doubles",
      "It remains unchanged",
      "It decreases",
      "It increases slightly"
    ],
    correctIdx: 2,
    explanation: "PRF is inversely related to depth. Increasing depth increases the Pulse Repetition Period (PRP), which decreases the PRF.",
    domain: "Pulsed Wave Physics"
  }
];

interface RegistryDailyChallengeProps {
  onSuccess?: (xp: number, coins: number) => void;
}

export const RegistryDailyChallenge: React.FC<RegistryDailyChallengeProps> = ({ onSuccess }) => {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPreceptorOpen, setIsPreceptorOpen] = useState(false);

  useEffect(() => {
    // Simple logic to pick a challenge based on the day
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % CHALLENGES.length;
    setChallenge(CHALLENGES[dayOfYear]);
    
    // Check if already answered today
    const lastAnswered = localStorage.getItem('last_daily_challenge_answered');
    const today = new Date().toDateString();
    if (lastAnswered === today) {
      setIsAnswered(true);
    }
  }, []);

  const handleVerify = () => {
    if (selected === null) return;
    setShowResult(true);
    if (selected === challenge?.correctIdx) {
      onSuccess?.(50, 10);
    } else {
      toast.error("Heuristic Mismatch. Check the physics logic.", { icon: <AlertCircle className="text-rose-400" /> });
    }
    localStorage.setItem('last_daily_challenge_answered', new Date().toDateString());
  };

  if (!challenge) return null;

  return (
    <div className="tech-card rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 border border-white/5 relative overflow-hidden group">
      <div className="absolute inset-0 atmosphere opacity-10" />
      <div className="absolute inset-0 neural-grid opacity-[0.05]" />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">
        <div className="flex-1 space-y-6 md:space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-600 rounded-2xl md:rounded-3xl shadow-xl shadow-amber-500/20 text-white">
              <Target size={24} className="md:w-8 md:h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Challenge</span>
              </div>
              <h3 className="text-xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Daily <br className="hidden md:block"/> registry pulse</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 md:p-8 bg-white/5 rounded-3xl border border-white/10 relative group-hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-4">
                 <Brain size={14} className="text-indigo-400" />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{challenge.domain}</span>
              </div>
              <p className="text-sm md:text-lg font-bold text-slate-200 leading-relaxed italic">
                 "{challenge.problem}"
              </p>
            </div>

            {!isAnswered ? (
              <div className="grid gap-2.5 md:gap-3">
                {challenge.options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => !showResult && setSelected(i)}
                    disabled={showResult}
                    className={`w-full p-4 md:p-6 rounded-2xl md:rounded-3xl text-left text-[10px] md:text-sm font-black transition-all border-2 flex items-center justify-between ${
                      selected === i 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                    } ${showResult && i === challenge.correctIdx ? 'border-emerald-500 bg-emerald-900/20 text-emerald-400' : ''}`}
                  >
                    <span>{opt}</span>
                    {selected === i && <Zap size={14} />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-emerald-900/10 border border-emerald-500/20 rounded-[2.5rem] text-center space-y-4">
                 <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
                 <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Challenge Completed</h4>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your neural pathways are optimized for today.</p>
                 <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-white/10 transition-all">View Archive</button>
              </div>
            )}

            {!showResult && selected !== null && !isAnswered && (
              <button 
                onClick={handleVerify}
                className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Verify Solution Matrix
              </button>
            )}
          </div>
        </div>

        {showResult && (
          <div className="w-full md:w-[350px] space-y-6 animate-in slide-in-from-right duration-700">
             <div className={`p-8 rounded-[2.5rem] border-4 ${selected === challenge.correctIdx ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-rose-900/20 border-rose-500/30'}`}>
                <div className="flex items-center gap-4 mb-6">
                   <div className={`p-3 rounded-2xl text-white shadow-lg ${selected === challenge.correctIdx ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                      {selected === challenge.correctIdx ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Physics Sync</h4>
                      <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">{selected === challenge.correctIdx ? 'Successful' : 'Sync Error'}</p>
                   </div>
                </div>
                <p className="text-xs md:text-sm font-medium text-slate-300 leading-relaxed italic mb-8">
                   {challenge.explanation}
                </p>
                <div className="flex items-center gap-3 p-4 bg-black/40 rounded-2xl border border-white/5">
                   <Clock size={16} className="text-amber-500" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next Pulse in 22h 14m</span>
                </div>
                <button 
                  onClick={() => setIsPreceptorOpen(true)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/10"
                >
                   <Brain size={14} /> Consult Harvey
                </button>
             </div>

             <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white overflow-hidden relative group/deep">
                <div className="absolute inset-0 neural-grid opacity-20" />
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-2 relative z-10">Deep Dive</h4>
                <p className="text-lg font-black italic uppercase leading-none mb-6 relative z-10">Master the interaction of media</p>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group-hover/deep:gap-4 transition-all relative z-10">
                   Go to unit <ArrowRight size={14} />
                </button>
                <Sparkles size={100} className="absolute -bottom-10 -right-10 text-white/10 group-hover/deep:scale-125 transition-transform" />
             </div>
          </div>
        )}
      </div>

      <NeuralPreceptor 
        isOpen={isPreceptorOpen} 
        onClose={() => setIsPreceptorOpen(false)} 
        context={`Registry Daily Challenge. Question: ${challenge.problem}. Domain: ${challenge.domain}. Correct Answer: ${challenge.options[challenge.correctIdx]}.`}
        initialMessage={`Neural pulse received. I'm HARVEY. You're analyzing the physics of ${challenge.domain}. This ${challenge.title} challenge requires a deep grasp of wave behavior. What sector needs stabilization?`}
      />
    </div>
  );
};
