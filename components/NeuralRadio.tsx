
import React from 'react';
import { motion } from 'motion/react';
import { X, Music, Sparkles, ExternalLink } from 'lucide-react';

interface NeuralRadioProps {
  onClose: () => void;
}

export const NeuralRadio: React.FC<NeuralRadioProps> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-4xl max-w-2xl w-full relative"
    >
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Music size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tighter italic uppercase text-white">Neural Radio</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SPI Physics Stream</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-8 space-y-6 relative z-10">
        <div className="aspect-video w-full bg-black/40 rounded-3xl border border-white/5 overflow-hidden relative group">
          <iframe 
            src="https://suno.com/embed/playlist/aa733366-2053-47ad-8697-a4ef7447caec" 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-2">
            <span className="micro-label">Atmosphere</span>
            <p className="text-sm font-bold text-slate-300 italic">"Physics-driven melodies to synchronize your neural pathways."</p>
          </div>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-2">
            <span className="micro-label">Source</span>
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-indigo-400 uppercase tracking-widest">Suno AI</p>
              <a 
                href="https://suno.com/playlist/aa733366-2053-47ad-8697-a4ef7447caec" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="p-6 bg-indigo-600/10 rounded-3xl border border-indigo-500/20 flex items-center gap-4">
          <Sparkles className="text-indigo-400 shrink-0" size={20} />
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] leading-relaxed">
            Optimized for deep focus and registry synchronization.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
