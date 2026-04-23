
import React from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  title: string;
  moduleTitle: string;
  weight: string;
}

export const AnimatedLessonHeader: React.FC<HeaderProps> = ({ title, moduleTitle, weight }) => {
  return (
    <div className="relative w-full py-16 md:py-24 overflow-hidden rounded-[3rem] bg-slate-950 border border-white/5 shadow-2xl mb-12">
      <div className="absolute inset-0 atmosphere opacity-30" />
      <div className="absolute inset-0 neural-grid opacity-[0.05]" />
      
      {/* Decorative Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-600 rounded-full blur-[100px]"
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.15, 0.05],
          x: [0, -40, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-emerald-600 rounded-full blur-[120px]"
      />

      <div className="relative z-10 px-8 md:px-16 space-y-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl">
            <Zap className="text-indigo-400" size={20} />
          </div>
          <div className="space-y-1">
            <h5 className="micro-label !text-indigo-400/80">{moduleTitle}</h5>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Registry Weight: {weight}</span>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <ShieldCheck className="text-emerald-500" size={12} />
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-display font-black italic tracking-tighter uppercase leading-[0.85] text-white"
          >
            {title.split(' ').map((word, i) => (
              <span key={i} className={i % 2 === 1 ? 'text-gradient' : ''}>
                {word}{' '}
              </span>
            ))}
          </motion.h1>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-indigo-500 to-transparent rounded-full"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap gap-4 pt-4"
        >
          <Badge icon={Sparkles} label="Registry Critical" color="text-amber-400" />
          <Badge icon={Activity} label="Clinical Application" color="text-emerald-400" />
        </motion.div>
      </div>

      {/* Floating UI Decorative Elements */}
      <div className="absolute top-12 right-12 hidden lg:flex flex-col gap-4">
         <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-2 w-48">
            <div className="flex justify-between items-center">
               <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Neural Retention</span>
               <span className="text-[10px] font-black text-emerald-400">92%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  className="h-full bg-emerald-500"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

const Badge = ({ icon: Icon, label, color }: { icon: any, label: string, color: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
    <Icon className={color} size={14} />
    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
  </div>
);
