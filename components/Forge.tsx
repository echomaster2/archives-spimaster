
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Brain, Sparkles, Send, Loader2, Database,
  ArrowRight, ShieldCheck, Microscope, Calculator,
  Activity, Radio
} from 'lucide-react';
import { generateForgeArtifact } from '../services/geminiService';
import { toast } from 'sonner';

interface ForgeProps {
  onSaveArtifact: (artifact: any) => void;
}

export const Forge: React.FC<ForgeProps> = ({ onSaveArtifact }) => {
  const [prompt, setPrompt] = useState('');
  const [isForging, setIsForging] = useState(false);
  const [craftedArtifact, setCraftedArtifact] = useState<any>(null);

  const handleForge = async () => {
    if (!prompt.trim()) return;
    
    setIsForging(true);
    try {
      const result = await generateForgeArtifact(prompt);
      setCraftedArtifact(result);
      toast.success('Neural Artifact Forged Successfully!', {
         icon: <Zap className="text-amber-500" />
      });
    } catch (error) {
      console.error(error);
      toast.error('Forge Unstable: Calibration Failed');
    } finally {
      setIsForging(false);
    }
  };

  const saveArtifact = () => {
    if (!craftedArtifact) return;
    onSaveArtifact(craftedArtifact);
    setCraftedArtifact(null); // Clear after saving
    toast.success('Artifact Persisted to Archives');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 md:space-y-20 pb-40 px-4 md:px-0">
      {/* Header */}
      <section className="space-y-6 md:space-y-12">
        <div className="flex items-center gap-4 text-amber-500">
           <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <Zap size={24} />
           </div>
           <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] italic">Neural Forge v1.0</span>
        </div>
        <h1 className="text-5xl md:text-9xl font-black tracking-tighter italic uppercase leading-none">
          The <span className="text-gradient">Forge</span>
        </h1>
        <p className="text-slate-500 font-bold max-w-2xl uppercase text-[10px] md:text-sm tracking-[0.3em] leading-relaxed italic border-l-2 border-amber-500/20 pl-8">
          "Extracting clinical truth from abstract physics. Input any concept, and the Forge will synthesize a registry-optimized tactical artifact."
        </p>
      </section>

      {/* Input Area */}
      <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
        <div className="glass-panel p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-4xl relative overflow-hidden group">
          <div className="absolute inset-0 scanline opacity-5" />
          <div className="space-y-8 relative z-10">
            <div className="space-y-2">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Neural Input</h3>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Target specific concepts (e.g., "Nyquist Limit", "Snell's Law")</p>
            </div>
            
            <div className="relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the clinical chaos to synchronize..."
                className="w-full bg-[#080c14] border border-white/10 rounded-3xl p-8 md:p-10 font-black italic text-lg md:text-2xl text-white placeholder:text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all min-h-[300px] md:min-h-[400px] resize-none scrollbar-hide"
              />
              <div className="absolute bottom-6 right-6">
                 <button 
                  onClick={handleForge}
                  disabled={isForging || !prompt.trim()}
                  className="p-6 md:p-8 bg-amber-600 text-white rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale group"
                 >
                   {isForging ? <Loader2 size={32} className="animate-spin" /> : <Send size={32} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />}
                 </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
               {['Nyquist Limit', 'Aliasing', 'LARRD', 'PZT', 'Impedance'].map(tag => (
                 <button 
                  key={tag} 
                  onClick={() => setPrompt(tag)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-amber-500/10 hover:border-amber-500/30 transition-all"
                 >
                   #{tag}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Output/Artifact Area */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {!craftedArtifact && !isForging && (
              <motion.div 
                key="empty-forge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-8 p-12 border-2 border-dashed border-white/5 rounded-[4rem]"
              >
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-slate-800">
                   <Zap size={48} />
                </div>
                <div className="space-y-2">
                   <h4 className="text-xl font-black uppercase italic tracking-tighter text-slate-700">Forge Idle</h4>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800">Waiting for cognitive input</p>
                </div>
              </motion.div>
            )}

            {isForging && (
              <motion.div 
                key="forging"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-12"
              >
                 <div className="relative">
                    <div className="w-32 h-32 md:w-48 md:h-48 border-[12px] md:border-[20px] border-amber-500/20 border-t-amber-500 rounded-full animate-spin shadow-4xl" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 animate-pulse" size={64} />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white animate-pulse">Forging Neural Links</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/60">Calibrating Diagnostic Logic...</p>
                 </div>
              </motion.div>
            )}

            {craftedArtifact && !isForging && (
              <motion.div 
                key="artifact"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="tech-card p-10 md:p-16 rounded-[4rem] border-b-[24px] border-amber-900/40 relative overflow-hidden group/artifact">
                   <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-50" />
                   <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover/artifact:scale-110 transition-transform duration-[2000ms]">
                      <Sparkles size={200} className="text-amber-500" />
                   </div>
                   
                   <div className="relative z-10 space-y-12">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
                               <ShieldCheck size={24} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 leading-none mb-1">Synthesized Result</p>
                               <h3 className="text-4xl font-black italic uppercase leading-none">{craftedArtifact.title}</h3>
                            </div>
                         </div>
                         <div className="px-4 py-2 bg-black/40 rounded-xl border border-white/10 font-mono text-[9px] uppercase tracking-widest">
                           ID: {Math.random().toString(36).substring(7).toUpperCase()}
                         </div>
                      </div>

                      <div className="grid gap-10">
                         <ArtifactSection 
                            title="The Core Heuristic" 
                            icon={<Brain size={16} />} 
                            text={craftedArtifact.heuristic} 
                            color="text-amber-400"
                         />
                         <ArtifactSection 
                            title="Registry Anchor" 
                            icon={<Microscope size={16} />} 
                            text={craftedArtifact.anchor}
                            color="text-indigo-400"
                         />
                         <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 italic">Mnemonic Lock</h5>
                            <p className="text-lg md:text-2xl font-black text-white italic tracking-tighter">"{craftedArtifact.mnemonic}"</p>
                         </div>
                      </div>

                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                         <button onClick={() => setCraftedArtifact(null)} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Discard Artifact</button>
                         <button 
                          onClick={saveArtifact}
                          className="px-8 py-3 bg-amber-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-700 transition-all shadow-xl flex items-center gap-2"
                         >
                           Save to Archives <ArrowRight size={14} />
                         </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ArtifactSection = ({ title, icon, text, color }: any) => (
  <div className="space-y-4">
    <h4 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${color}`}>
       {icon} {title}
    </h4>
    <p className="text-sm md:text-lg font-bold text-slate-300 leading-relaxed italic pl-7 border-l border-white/10">
       {text}
    </p>
  </div>
);
