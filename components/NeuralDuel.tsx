
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Shield, Sword, Trophy, User, Ghost, 
  Timer, Brain, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { spiQuestions } from '../data/spiQuestions';

interface NeuralDuelProps {
  onExit: () => void;
  onVictory: (xp: number) => void;
}

export const NeuralDuel: React.FC<NeuralDuelProps> = ({ onExit, onVictory }) => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [timeLeft, setTimeLeft] = useState(10);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<typeof spiQuestions>([]);

  const opponentName = "Shadow Master V4";
  const opponentAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=ShadowMaster`;

  const startDuel = () => {
    // Pick 10 random questions
    const shuffled = [...spiQuestions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 10));
    setGameState('playing');
    setTimeLeft(12);
  };

  const handleAnswer = (idx: number) => {
    if (gameState !== 'playing') return;
    
    const correct = selectedQuestions[currentQuestionIdx].correctAnswer === idx;
    
    if (correct) {
      const damage = Math.round(20 + (timeLeft * 2)); // Speed bonus
      setOpponentHp(prev => Math.max(0, prev - damage));
      setPlayerScore(prev => prev + 1);
      addLog(`You hit Shadow for ${damage} Neural Damage!`);
    } else {
      setPlayerHp(prev => Math.max(0, prev - 15));
      addLog(`Misfire! Your neural link suffered feedback.`);
    }

    nextTurn();
  };

  const nextTurn = useCallback(() => {
    if (currentQuestionIdx >= selectedQuestions.length - 1 || playerHp <= 0 || opponentHp <= 0) {
      setGameState('result');
      if (playerHp > opponentHp) onVictory(500);
      return;
    }
    
    setCurrentQuestionIdx(prev => prev + 1);
    setTimeLeft(12);
    
    // Opponent "Thinking" simulation
    setTimeout(() => {
      const opponentCorrect = Math.random() > 0.3; // 70% accuracy
      if (opponentCorrect) {
        const dmg = 15 + Math.floor(Math.random() * 10);
        setPlayerHp(h => Math.max(0, h - dmg));
        addLog(`${opponentName} channeled a frequency spike for ${dmg} damage.`);
      } else {
        addLog(`${opponentName} failed to synchronize.`);
      }
    }, 1500);
  }, [currentQuestionIdx, selectedQuestions, playerHp, opponentHp, onVictory]);

  const addLog = (msg: string) => {
    setBattleLog(prev => [msg, ...prev].slice(0, 3));
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setPlayerHp(prev => Math.max(0, prev - 10));
      addLog("Time dilation! You lost HP.");
      nextTurn();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState, nextTurn]);

  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="tech-card p-12 max-w-2xl w-full text-center space-y-8 border-b-[20px] border-rose-600/20">
           <div className="flex justify-center -space-x-6">
              <div className="w-24 h-24 rounded-full bg-indigo-600 border-4 border-slate-950 flex items-center justify-center shadow-2xl relative z-10">
                 <User size={40} className="text-white" />
              </div>
              <div className="w-24 h-24 rounded-full bg-rose-600 border-4 border-slate-950 flex items-center justify-center shadow-2xl">
                 <Sword size={40} className="text-white" />
              </div>
           </div>
           <div className="space-y-2">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">Neural Duel</h2>
              <p className="micro-label text-rose-400">PvE Shadow Simulation Module</p>
           </div>
           <p className="text-slate-400 font-bold leading-relaxed italic">
             Answer SPI questions faster than your shadow to deplete their neural integrity. Precision and velocity are your only weapons.
           </p>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={onExit} className="btn-secondary">Retreat</button>
              <button onClick={startDuel} className="btn-primary !bg-rose-600 hover:!bg-rose-500">Initiate Combat</button>
           </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    const victory = playerHp > opponentHp;
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className={`tech-card p-16 max-w-2xl w-full text-center space-y-10 border-b-[20px] ${victory ? 'border-emerald-600/20' : 'border-rose-600/20'}`}>
           <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-4xl ${victory ? 'bg-emerald-600 shadow-emerald-500/30' : 'bg-rose-600 shadow-rose-500/30'}`}>
              {victory ? <Trophy size={64} className="text-white" /> : <XCircle size={64} className="text-white" />}
           </div>
           <div className="space-y-4">
              <h3 className="text-6xl font-black italic uppercase tracking-tighter text-white">{victory ? 'Victory' : 'Defeat'}</h3>
              <p className="micro-label text-slate-500">Neural Sync Terminated</p>
           </div>
           <div className="flex justify-center gap-12">
              <div className="text-center">
                 <p className="text-4xl font-black text-white italic">{playerScore}/10</p>
                 <p className="micro-label opacity-40">Precision</p>
              </div>
              <div className="text-center">
                 <p className="text-4xl font-black text-indigo-400 italic">+{victory ? 500 : 50} XP</p>
                 <p className="micro-label opacity-40">Neural Gain</p>
              </div>
           </div>
           <button onClick={onExit} className="btn-primary w-full">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  const q = selectedQuestions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12 space-y-12 overflow-hidden flex flex-col">
       {/* Combat HUD */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-slate-900/50 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <span className="text-2xl font-black italic text-rose-500">VS</span>
             </div>
          </div>
          
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                   <User size={32} />
                </div>
                <div>
                   <h4 className="text-xl font-black italic tracking-tighter">You</h4>
                   <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Level {Math.floor(playerHp/20)} Integrity</p>
                </div>
             </div>
             <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                <motion.div animate={{ width: `${playerHp}%` }} className="h-full bg-emerald-500 rounded-full" />
             </div>
          </div>

          <div className="flex flex-col items-center justify-center py-4 lg:py-0">
             <div className={`w-24 h-24 rounded-full border-8 ${timeLeft < 5 ? 'border-rose-600 animate-pulse' : 'border-indigo-600'} flex items-center justify-center relative`}>
                <span className="text-4xl font-black italic">{timeLeft}</span>
                <p className="absolute -bottom-6 micro-label">Timer Focus</p>
             </div>
          </div>

          <div className="space-y-4 text-right">
             <div className="flex items-center gap-4 justify-end">
                <div>
                   <h4 className="text-xl font-black italic tracking-tighter">{opponentName}</h4>
                   <p className="text-[10px] font-black uppercase text-rose-400 tracking-widest">Elite Bot Protocol</p>
                </div>
                <div className="w-16 h-16 bg-rose-600 rounded-2xl overflow-hidden shadow-lg border border-white/20">
                   <img src={opponentAvatar} alt="Opponent" className="w-full h-full object-cover" />
                </div>
             </div>
             <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                <motion.div animate={{ width: `${opponentHp}%` }} className="h-full bg-rose-500 rounded-full" />
             </div>
          </div>
       </div>

       {/* Question / Battle Log */}
       <div className="flex-1 grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
             <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQuestionIdx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-900 border border-white/10 rounded-[3.5rem] p-8 md:p-16 min-h-[400px] flex flex-col justify-center gap-10 shadow-4xl relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                      <Zap size={200} />
                   </div>
                   
                   <div className="space-y-10 relative z-10 text-center">
                      <h3 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter">
                         {q?.question}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                         {q?.options.map((opt, i) => (
                            <button
                               key={i}
                               onClick={() => handleAnswer(i)}
                               className="p-8 bg-white/5 border-2 border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-indigo-500 transition-all font-black text-xs md:text-lg uppercase tracking-tight text-slate-300 hover:text-white group"
                            >
                               {opt}
                            </button>
                         ))}
                      </div>
                   </div>
                </motion.div>
             </AnimatePresence>
          </div>

          <div className="space-y-6">
             <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col gap-6">
                <div className="flex items-center gap-2">
                   <Sword size={16} className="text-rose-500" />
                   <h5 className="micro-label">Battle Feed</h5>
                </div>
                <div className="space-y-4 flex-1">
                   {battleLog.map((log, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i} 
                        className="p-4 bg-white/5 rounded-2xl border border-white/5"
                      >
                         <p className="text-[10px] font-bold text-slate-400 italic leading-relaxed">{log}</p>
                      </motion.div>
                   ))}
                </div>
                <div className="p-6 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                   <p className="text-[8px] font-black uppercase tracking-[0.2em] text-rose-400 mb-1">Incoming Logic</p>
                   <p className="text-xs font-bold text-white italic">{"'Shadow' is calibrating... 1.5s until strike."}</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
