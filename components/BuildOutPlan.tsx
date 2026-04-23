import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Layers, Zap, Target, Users, CheckCircle2, Clock, ArrowRight, Sparkles, ShieldCheck, Activity, Database } from 'lucide-react';

const phases = [
  {
    title: "Phase 1: Foundation & Core Logic",
    status: "Completed",
    icon: Database,
    color: "bg-emerald-500",
    items: [
      "AI-driven Masterclass generation with [BLOCK] architecture",
      "Core Physics Labs (Waves, Doppler, Transducers, Artifacts)",
      "Study Roadmap & Progress Tracking system",
      "AI Tutor & Live Audio Interaction (Harvey Persona)",
      "User Vault for notes and mnemonic persistence"
    ]
  },
  {
    title: "Phase 2: Immersive Learning & Visuals",
    status: "Completed",
    icon: Sparkles,
    color: "bg-indigo-500",
    items: [
      "Dynamic SVG Diagrams generated per lesson context",
      "Expanded Content: Clinical Case Studies & Registry Traps",
      "Bento-style Dashboard with dynamic Mastery Radar",
      "Cinematic Animated Intros & Transitions",
      "Glassmorphism UI refinements and editorial typography"
    ]
  },
  {
    title: "Phase 3: Advanced Interactivity & Labs",
    status: "Completed",
    icon: Zap,
    color: "bg-amber-500",
    items: [
      "Interactive Transducer Lab: Real-time beam steering",
      "Doppler Audio Simulation: Hear the shift in real-time",
      "Artifact Sandbox: Intentionally create/resolve artifacts",
      "Physics Calculator: Solve complex equations with logic",
      "Haptic Feedback integration for mobile users"
    ]
  },
  {
    title: "Phase 4: Registry Readiness & Analytics",
    status: "Completed",
    icon: Target,
    color: "bg-rose-500",
    items: [
      "Mock Registry Exam: v2.0 with category tracking",
      "Weakness Heatmap: Integrated conceptually in Analytics",
      "Neural SRS: Spaced Repetition flashcard logic",
      "Registry Trend Analysis via Neural Optimizer",
      "Performance Benchmarking against global averages"
    ]
  },
  {
    title: "Phase 5: Community & Collaboration",
    status: "In Progress",
    icon: Users,
    color: "bg-purple-500",
    items: [
      "Global Leaderboards & Neural Ranking system (Live)",
      "Shared Logic Pool: Community-shared extractions (Live)",
      "Collaborative Study Groups with Topic Context (Live)",
      "Neural Radio: Synchronized study atmosphere (Live)",
      "Expert Q&A Integration: AI-moderated expert logic"
    ]
  },
  {
    title: "Phase 6: Clinical Resonance & Predictive AI",
    status: "Planned",
    icon: Rocket,
    color: "bg-cyan-500",
    items: [
      "Predictive Analytics: AI-forecasted Registry pass rates",
      "Virtual Clinical Rotations: Multi-path diagnostic cases",
      "VR/AR Logic Bridges: Hand-gesture ultrasound simulation",
      "Career Sync: Automated profile export for recruitment",
      "Real-time Logic Duels: 1v1 competitive physics sprints"
    ]
  }
];

interface BuildOutPlanProps {
  onStartLearning?: () => void;
  onViewRoadmap?: () => void;
}

export const BuildOutPlan: React.FC<BuildOutPlanProps> = ({ onStartLearning, onViewRoadmap }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-0 space-y-16 md:space-y-24">
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-600 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl"
        >
          <Rocket size={16} /> Strategic Roadmap
        </motion.div>
        <h1 className="text-4xl md:text-8xl font-black tracking-tighter italic uppercase text-white leading-none text-gradient">
          The Evolution <br/> of Mastery
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto uppercase text-[10px] md:text-xs tracking-widest leading-relaxed">
          Building the world's most sophisticated AI-driven platform for Sonography Principles & Instrumentation.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2 hidden sm:block"></div>
        
        <div className="space-y-12 md:space-y-32">
          {phases.map((phase, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="absolute left-8 md:left-1/2 w-12 h-12 rounded-full bg-black border border-white/10 md:-translate-x-1/2 flex items-center justify-center z-10 shadow-xl hidden sm:flex">
                <phase.icon size={20} className="text-white" />
              </div>

              <div className="w-full md:w-1/2 space-y-6">
                <div className={`p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] glass-panel border border-white/5 shadow-2xl hover:border-white/20 transition-all group relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 ${phase.color} opacity-5 blur-3xl -mr-16 -mt-16`} />
                  
                  <div className="flex items-center justify-between mb-8">
                    <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white ${phase.color}`}>
                      {phase.status}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phase 0{idx + 1}</span>
                  </div>

                  <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic text-white mb-8 leading-tight group-hover:text-indigo-400 transition-colors">
                    {phase.title}
                  </h3>

                  <ul className="space-y-4">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-400 font-medium text-xs md:text-sm uppercase tracking-widest">
                        <CheckCircle2 size={18} className={phase.status === 'Completed' ? 'text-emerald-500' : 'text-white/10'} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="hidden md:block w-1/2"></div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-[3rem] md:rounded-[5rem] p-12 md:p-24 text-white text-center space-y-12 relative overflow-hidden border-b-[12px] md:border-b-[24px] border-black/40">
        <div className="absolute inset-0 bg-indigo-600 opacity-10 blur-[120px] -translate-y-1/2"></div>
        <div className="relative z-10 space-y-8">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase italic text-gradient">Ready to Begin?</h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto uppercase text-[10px] md:text-xs tracking-widest leading-relaxed">
            The path to registry mastery is not a sprint, but a systematic deconstruction of physics logic.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStartLearning}
              className="px-12 py-6 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-all"
            >
              Start Learning
            </button>
            <button 
              onClick={onViewRoadmap}
              className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
            >
              View Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
