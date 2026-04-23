import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, X, Activity, ExternalLink, PenLine, 
  Lock, BookMarked, Brain, Network, Zap, 
  ChevronRight, Target, Layers, Sparkles,
  GitCommit, Cpu, Workflow, Lightbulb
} from 'lucide-react';
import { CachedLesson, Lesson } from '../types';

interface LogicSpineProps {
  bufferOpen: boolean;
  setBufferOpen: (open: boolean) => void;
  currentLesson: Lesson;
  cachedLesson: CachedLesson | null;
  currentBlockIndex: number;
  totalBlocks: number;
  registryPulse: { text: string, sources: any[] } | null;
  lessonNotes: Record<string, string>;
  setLessonNotes: (notes: Record<string, string>) => void;
  lessonKey: string;
}

export const LogicSpine: React.FC<LogicSpineProps> = ({
  bufferOpen,
  setBufferOpen,
  currentLesson,
  cachedLesson,
  currentBlockIndex,
  totalBlocks,
  registryPulse,
  lessonNotes,
  setLessonNotes,
  lessonKey
}) => {
  const [activeTab, setActiveTab] = useState<'pulse' | 'pathway' | 'margin' | 'locker'>('pulse');

  const progress = totalBlocks > 0 ? (currentBlockIndex / totalBlocks) * 100 : 0;

  // Mock logic nodes for now - in a real app, these could be extracted from the script
  const logicNodes = [
    { id: 1, title: 'Core Heuristic', description: 'The fundamental principle of this unit.', icon: Cpu },
    { id: 2, title: 'Neural Branching', description: 'How this concept connects to previous knowledge.', icon: Workflow },
    { id: 3, title: 'Logic Pivot', description: 'A critical shift in perspective required for mastery.', icon: GitCommit },
    { id: 4, title: 'Synthesis Peak', description: 'The ultimate realization of the lesson.', icon: Lightbulb },
  ];

  return (
    <aside className={`fixed right-0 inset-y-0 z-50 xl:relative bg-white border-l border-slate-100 transition-all duration-700 flex flex-col h-screen overflow-hidden shadow-2xl ${bufferOpen ? 'w-full sm:w-[450px] xl:w-[500px]' : 'w-0'}`}>
      {/* Header */}
      <div className="p-6 md:p-10 border-b flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
            <Database size={24}/>
          </div>
          <div>
            <h3 className="font-black text-xl uppercase tracking-tighter text-slate-950 italic leading-none">Logic Spine</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Neural Navigation System</p>
          </div>
        </div>
        <button 
          onClick={() => setBufferOpen(false)} 
          className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all"
        >
          <X size={24}/>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-2 bg-slate-50 border-b gap-1">
        {[
          { id: 'pulse', label: 'Pulse', icon: Activity },
          { id: 'pathway', label: 'Pathway', icon: Network },
          { id: 'margin', label: 'Margin', icon: PenLine },
          { id: 'locker', label: 'Locker', icon: Lock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <tab.icon size={18} />
            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-hide bg-slate-50/30">
        <AnimatePresence mode="wait">
          {activeTab === 'pulse' && (
            <motion.div
              key="pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <section className="bg-slate-950 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-emerald-500/20">
                <div className="absolute inset-0 neural-grid opacity-[0.05] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent animate-pulse" />
                <div className="scanline opacity-10" />
                
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-4">
                    <Activity size={20}/> Registry Pulse
                  </h4>
                  <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Live Sync</span>
                  </div>
                </div>

                {registryPulse ? (
                  <div className="space-y-6 prose prose-invert prose-sm italic font-bold leading-relaxed relative z-10">
                    {registryPulse.text.split('\n').map((line, i) => line.trim() ? (
                      <p key={i} className="mb-6 last:mb-0 text-slate-200">
                        <span className="text-emerald-500/40 mr-2">›</span> {line}
                      </p>
                    ) : null)}
                    
                    {registryPulse.sources && registryPulse.sources.length > 0 && (
                      <div className="mt-12 pt-10 border-t border-emerald-500/10">
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-500/60 mb-6">Verified Intelligence Sources</p>
                        <div className="flex flex-wrap gap-3">
                          {registryPulse.sources.map((source: any, i: number) => (
                            <a 
                              key={i} 
                              href={source.web?.uri} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-4 py-2 bg-emerald-500/5 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-emerald-500/20 transition-all border border-emerald-500/10 flex items-center gap-3 group/source"
                            >
                              <ExternalLink size={12} className="text-emerald-500 group-hover/source:rotate-45 transition-transform" /> 
                              <span className="text-slate-400 group-hover/source:text-white transition-colors">{source.web?.title || 'Source'}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8 py-10">
                    <div className="h-4 bg-emerald-900/30 rounded-full w-full animate-pulse"></div>
                    <div className="h-4 bg-emerald-900/30 rounded-full w-5/6 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-4 bg-emerald-900/30 rounded-full w-4/6 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {activeTab === 'pathway' && (
            <motion.div
              key="pathway"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Network size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Neural Pathway</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit Progression Map</p>
                  </div>
                </div>

                <div className="relative pl-8 space-y-12">
                  {/* Vertical Line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${progress}%` }}
                      className="w-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    />
                  </div>

                  {logicNodes.map((node, idx) => {
                    const isUnlocked = progress >= (idx + 1) * 25;
                    const isActive = progress >= idx * 25 && progress < (idx + 1) * 25;

                    return (
                      <div key={node.id} className="relative group">
                        <div className={`absolute -left-[25px] w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 ${
                          isUnlocked ? 'bg-indigo-600 border-indigo-600 scale-110' : 
                          isActive ? 'bg-white border-indigo-500 animate-pulse' : 
                          'bg-white border-slate-200'
                        }`}>
                          {isUnlocked && <Zap size={8} className="text-white absolute inset-0 m-auto" />}
                        </div>
                        
                        <div className={`transition-all duration-500 ${isUnlocked ? 'opacity-100' : 'opacity-40'}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <node.icon size={16} className={isUnlocked ? 'text-indigo-600' : 'text-slate-400'} />
                            <h5 className="text-xs font-black uppercase tracking-widest text-slate-900">{node.title}</h5>
                          </div>
                          <p className="text-[11px] font-bold text-slate-500 leading-relaxed">{node.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles size={12} /> Current Synthesis Depth
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-indigo-500"
                      />
                    </div>
                    <span className="text-xs font-black text-indigo-600">{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'margin' && (
            <motion.div
              key="margin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <section className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl">
                    <PenLine size={24}/>
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tighter uppercase italic text-slate-950">Scholar's Margin</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Neural Logging</p>
                  </div>
                </div>
                <textarea 
                  value={lessonNotes[lessonKey] || ''} 
                  onChange={(e) => setLessonNotes({...lessonNotes, [lessonKey]: e.target.value})}
                  placeholder="Log your Unit Mnemonics here..." 
                  className="w-full h-[400px] bg-white border-4 border-slate-100 rounded-[2rem] p-8 text-lg font-bold focus:outline-none focus:border-indigo-600 transition-all italic placeholder:text-slate-300 leading-relaxed shadow-sm" 
                />
              </section>
            </motion.div>
          )}

          {activeTab === 'locker' && (
            <motion.div
              key="locker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <section className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <BookMarked size={100}/>
                </div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                    <Lock size={20} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Intelligence Locker</h4>
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Unit Mnemonics</p>
                    {cachedLesson?.flashcards && cachedLesson.flashcards.length > 0 ? (
                      <div className="space-y-4">
                        {cachedLesson.flashcards.slice(0, 3).map((card, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm group/card">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black shrink-0 group-hover/card:bg-indigo-600 group-hover/card:text-white transition-colors">
                              {i + 1}
                            </div>
                            <p className="text-xs font-bold text-slate-600 leading-relaxed">{card.front}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-slate-400 italic">No mnemonics locked for this unit yet.</p>
                    )}
                  </div>

                  <button className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                    <Layers size={16} /> Access Full Vault
                  </button>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Status */}
      <div className="p-6 border-t bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Logic Synchronized</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-600">
            <span className="text-[10px] font-black uppercase tracking-widest italic">Unit {currentLesson.id_formatted}</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </aside>
  );
};
