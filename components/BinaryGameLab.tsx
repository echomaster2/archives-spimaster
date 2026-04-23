
import React, { useState, useEffect } from 'react';
import { Cpu, RotateCcw, Zap, Trophy, Target, Grid, Binary, HelpCircle } from 'lucide-react';

export const BinaryGameLab: React.FC = () => {
  const [bits, setBits] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [target, setTarget] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const currentTotal = bits.reduce((acc, bit, idx) => acc + (bit * weights[idx]), 0);

  const generateNewTarget = () => {
    setTarget(Math.floor(Math.random() * 255) + 1);
    setBits([0, 0, 0, 0, 0, 0, 0, 0]);
    setIsCorrect(false);
  };

  useEffect(() => {
    generateNewTarget();
  }, []);

  useEffect(() => {
    if (currentTotal === target && target !== 0) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      setTimeout(() => {
        generateNewTarget();
      }, 1500);
    }
  }, [currentTotal]);

  const toggleBit = (idx: number) => {
    if (isCorrect) return;
    const newBits = [...bits];
    newBits[idx] = newBits[idx] === 0 ? 1 : 0;
    setBits(newBits);
  };

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Binary size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Cpu className="text-emerald-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Binary Mastery Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Digital Memory Challenge</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <Trophy size={18} className="text-amber-400"/>
                <div>
                   <span className="block text-[8px] font-black text-slate-500 uppercase">Correct Rounds</span>
                   <span className="text-lg font-black">{score}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Target Display */}
            <div className="bg-black rounded-[2.5rem] p-10 border-4 border-slate-800 text-center relative overflow-hidden group shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent"></div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4">Target Decimal Value</p>
               <h2 className={`text-8xl font-black tracking-tighter transition-all duration-300 ${isCorrect ? 'text-emerald-400 scale-110' : 'text-white'}`}>
                 {target}
               </h2>
               {isCorrect && (
                 <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-black uppercase text-xs animate-bounce">
                    <Zap size={14}/> Perfect Conversion!
                 </div>
               )}
            </div>

            {/* Bit Toggles */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
               {bits.map((bit, idx) => (
                 <div key={idx} className="flex flex-col items-center gap-3">
                    <button 
                      onClick={() => toggleBit(idx)}
                      className={`w-full aspect-square rounded-2xl border-4 transition-all flex items-center justify-center text-xl font-black ${
                        bit === 1 
                          ? 'bg-emerald-500 border-emerald-400 text-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                          : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'
                      }`}
                    >
                      {bit}
                    </button>
                    <div className="text-center">
                       <span className="block text-[9px] font-black text-slate-600 uppercase">Weight</span>
                       <span className="text-[10px] font-black text-slate-400">{weights[idx]}</span>
                    </div>
                 </div>
               ))}
            </div>

            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Sum:</span>
                  <span className="text-3xl font-black text-emerald-400 tracking-tighter">{currentTotal}</span>
               </div>
               <button onClick={generateNewTarget} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                  <RotateCcw size={20} className="text-slate-400"/>
               </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
               <div className="flex items-center gap-3 mb-6">
                  <HelpCircle size={20} className="text-indigo-400" />
                  <h4 className="text-lg font-black tracking-tight">The Binary Logic</h4>
               </div>
               <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">
                 Computers (Scan Converters) speak in bits. 8 bits make a <span className="text-white font-bold">Byte</span>. 
                 <span className="block mt-4">Each position is a power of 2, starting from the right (2<sup>0</sup>=1) to the left (2<sup>7</sup>=128).</span>
               </p>
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold py-2 border-b border-white/5">
                    <span className="text-slate-500 uppercase">8 Bits</span>
                    <span className="text-white uppercase">256 Shades</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold py-2 border-b border-white/5">
                    <span className="text-slate-500 uppercase">5 Bits</span>
                    <span className="text-white uppercase">32 Shades</span>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/20">
               <div className="flex items-center gap-3 mb-2">
                  <Zap className="text-indigo-200" size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Registry Fact</h4>
               </div>
               <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                 The number of shades of gray in a digital memory is <span className="font-black italic text-white underline">2 to the power of the number of bits</span>.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
