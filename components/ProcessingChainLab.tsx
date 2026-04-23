
import React, { useState, useMemo } from 'react';
import { Layers, Zap, Target, Activity, Info, Sparkles, Filter, Layout, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface SystemFunction {
  id: string;
  name: string;
  category: 'pre' | 'post';
  desc: string;
}

const SYSTEM_FUNCTIONS: SystemFunction[] = [
  { id: 'tgc', name: 'TGC', category: 'pre', desc: 'Compensation happens before memory.' },
  { id: 'writezoom', name: 'Write Zoom', category: 'pre', desc: 'Rescans a specific area before storage.' },
  { id: 'persistence', name: 'Persistence', category: 'pre', desc: 'Frame averaging before image storage.' },
  { id: 'readzoom', name: 'Read Zoom', category: 'post', desc: 'Magnifies pixels after storage.' },
  { id: 'bcolor', name: 'B-Color', category: 'post', desc: 'Adding color maps to frozen images.' },
  { id: 'blackwhite', name: 'Black/White Inversion', category: 'post', desc: 'Flipping gray scale after storage.' },
  { id: 'edgedetect', name: 'Edge Enhancement', category: 'pre', desc: 'Sharpens boundaries before storage.' },
  { id: '3drendering', name: '3D Rendering', category: 'post', desc: 'Volume construction from stored data.' },
  { id: 'dynamicrange', name: 'Compression', category: 'pre', desc: 'Receiver function before storage.' }
];

export const ProcessingChainLab: React.FC = () => {
  const [items, setItems] = useState<SystemFunction[]>(() => [...SYSTEM_FUNCTIONS].sort(() => Math.random() - 0.5));
  const [preBin, setPreBin] = useState<SystemFunction[]>([]);
  const [postBin, setPostBin] = useState<SystemFunction[]>([]);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  const reset = () => {
    setItems([...SYSTEM_FUNCTIONS].sort(() => Math.random() - 0.5));
    setPreBin([]);
    setPostBin([]);
    setScore({ correct: 0, wrong: 0 });
  };

  const sortItem = (item: SystemFunction, target: 'pre' | 'post') => {
    if (item.category === target) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
      if (target === 'pre') setPreBin(p => [...p, item]);
      else setPostBin(p => [...p, item]);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
      // Temporary vibration or shake effect would go here
    }
  };

  const currentItem = items[0];

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Layers size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Filter className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">System Processing Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Pre vs Post-Processing Mastery</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-emerald-500/20 px-6 py-3 rounded-2xl border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-400"/>
                <span className="text-xl font-black text-emerald-400">{score.correct}</span>
             </div>
             <div className="bg-rose-500/20 px-6 py-3 rounded-2xl border border-rose-500/30 flex items-center gap-3">
                <XCircle size={18} className="text-rose-400"/>
                <span className="text-xl font-black text-rose-400">{score.wrong}</span>
             </div>
             <button onClick={reset} className="p-4 hover:bg-white/10 rounded-2xl transition-all border border-white/10">
                <RotateCcw size={20} className="text-slate-400"/>
             </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Bin 1: Pre */}
          <div className="space-y-6">
             <div className="p-8 bg-indigo-900/20 rounded-[2.5rem] border-2 border-dashed border-indigo-500/30 text-center min-h-[400px] flex flex-col items-center">
                <h4 className="text-lg font-black text-indigo-400 uppercase tracking-widest mb-6">Pre-Processing</h4>
                <p className="text-[9px] text-slate-500 uppercase font-black mb-8 italic">Happens BEFORE Image Freeze / Storage</p>
                <div className="space-y-3 w-full">
                   {preBin.map(item => (
                     <div key={item.id} className="p-4 bg-indigo-600 text-white rounded-2xl font-black text-xs animate-in zoom-in duration-300">
                        {item.name}
                     </div>
                   ))}
                </div>
                {currentItem && (
                  <button 
                    onClick={() => sortItem(currentItem, 'pre')}
                    className="mt-auto w-full py-4 bg-indigo-500/10 hover:bg-indigo-500/30 border border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase transition-all"
                  >
                    Sort Left
                  </button>
                )}
             </div>
          </div>

          {/* Current Card */}
          <div className="flex flex-col items-center justify-center pt-20">
             {currentItem ? (
               <div className="w-full bg-white rounded-[2.5rem] p-10 text-center shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8 block">Classify Function</span>
                  <h2 className="text-4xl font-black text-slate-900 mb-4">{currentItem.name}</h2>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed mb-10 italic">"Does this happen to raw data or stored data?"</p>
                  <div className="flex gap-4">
                     <button onClick={() => sortItem(currentItem, 'pre')} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl hover:scale-105 transition-all">Pre</button>
                     <button onClick={() => sortItem(currentItem, 'post')} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl hover:scale-105 transition-all">Post</button>
                  </div>
               </div>
             ) : (
               <div className="text-center py-20">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                     <Sparkles size={40} className="text-white"/>
                  </div>
                  <h3 className="text-2xl font-black italic">Chain Complete!</h3>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">Intelligence Synced</p>
                  <button onClick={reset} className="mt-8 px-10 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Master Again</button>
               </div>
             )}
          </div>

          {/* Bin 2: Post */}
          <div className="space-y-6">
             <div className="p-8 bg-emerald-900/20 rounded-[2.5rem] border-2 border-dashed border-emerald-500/30 text-center min-h-[400px] flex flex-col items-center">
                <h4 className="text-lg font-black text-emerald-400 uppercase tracking-widest mb-6">Post-Processing</h4>
                <p className="text-[9px] text-slate-500 uppercase font-black mb-8 italic">Happens AFTER Image Freeze / Storage</p>
                <div className="space-y-3 w-full">
                   {postBin.map(item => (
                     <div key={item.id} className="p-4 bg-emerald-600 text-white rounded-2xl font-black text-xs animate-in zoom-in duration-300">
                        {item.name}
                     </div>
                   ))}
                </div>
                {currentItem && (
                  <button 
                    onClick={() => sortItem(currentItem, 'post')}
                    className="mt-auto w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/30 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase transition-all"
                  >
                    Sort Right
                  </button>
                )}
             </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-slate-800 rounded-[2.5rem] border border-white/5">
           <div className="flex items-center gap-4 mb-4">
              <Info className="text-amber-500" size={24} />
              <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Registry Gold: The Memory Boundary</h5>
           </div>
           <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
             "If you can perform the function on a <span className="text-white font-bold underline">FROZEN</span> image, it is <span className="text-emerald-400 font-black uppercase">Post-Processing</span>. If you must be actively scanning to change it, it is <span className="text-indigo-400 font-black uppercase">Pre-Processing</span>."
           </p>
        </div>
      </div>
    </div>
  );
};
