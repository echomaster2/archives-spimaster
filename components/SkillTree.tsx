
import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, Zap, Coins, Flame, Star, TrendingUp, 
  CheckCircle2, Target, Brain, Rocket, ShieldCheck,
  User, BarChart3, TreePine, Lock, Sparkles, Waves,
  Microwave, Microscope, Wind, Activity, Database,
  ArrowRight, Search, Trophy
} from 'lucide-react';
import { UserStats } from '../types';

interface SkillNode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  cost: number;
  dependencies: string[];
  module: string;
}

const SKILL_NODES: SkillNode[] = [
  // Physics Track
  { id: 'wave_basics', title: 'Wave Theory', description: 'Master the fundamental physics of acoustic waves.', icon: <Waves />, cost: 0, dependencies: [], module: 'Physics Core' },
  { id: 'attenuation_prowess', title: 'Attenuation Prowess', description: 'Master absorption, reflection, and scattering dynamics.', icon: <Zap />, cost: 400, dependencies: ['wave_basics'], module: 'Physics Core' },
  { id: 'resolution_mastery', title: 'Resolution Matrix', description: 'Understand the axial, lateral, and elevational resolution limits.', icon: <Target />, cost: 800, dependencies: ['attenuation_prowess'], module: 'Physics Core' },
  
  // Doppler Track
  { id: 'doppler_basics', title: 'Doppler Shift', description: 'Understand frequency shifts and flow directionality.', icon: <Activity />, cost: 500, dependencies: ['wave_basics'], module: 'Vascular' },
  { id: 'aliasing_shield', title: 'Aliasing Shield', description: 'Techniques to stabilize high-velocity flow signatures.', icon: <ShieldCheck />, cost: 1000, dependencies: ['doppler_basics'], module: 'Vascular' },
  { id: 'hemo_dynamics', title: 'Hemodynamics', description: 'Master laminar vs turbulent flow and Bernoulli principles.', icon: <Wind />, cost: 1500, dependencies: ['aliasing_shield'], module: 'Vascular' },

  // Hardware Track
  { id: 'transducer_design', title: 'Transducer Design', description: 'Master the construction of piezoelectric elements.', icon: <Microwave />, cost: 500, dependencies: ['wave_basics'], module: 'Hardware' },
  { id: 'beam_steering', title: 'Beam Steering', description: 'Master vector, linear, and phased array steering.', icon: <ArrowRight />, cost: 1200, dependencies: ['transducer_design'], module: 'Hardware' },
  { id: 'digital_memory', title: 'Bit Logic', description: 'Master scan converters and digital storage resolution.', icon: <Database />, cost: 1800, dependencies: ['beam_steering'], module: 'Hardware' },

  // Clinical Track
  { id: 'patient_sim_alpha', title: 'Clinical Logic I', description: 'Unlock basic abdominal aortic and GB assessments.', icon: <User />, cost: 700, dependencies: ['wave_basics'], module: 'Clinical' },
  { id: 'pathological_recognition', title: 'Pathology Hunter', description: 'Isolate pathologies from artifacts in complex cases.', icon: <Search />, cost: 1400, dependencies: ['patient_sim_alpha'], module: 'Clinical' },
  { id: 'registry_alignment', title: 'Registry Sync', description: 'Final alignment for the SPI high-yield logic.', icon: <Trophy />, cost: 3000, dependencies: ['pathological_recognition', 'hemo_dynamics'], module: 'Clinical' },
];

interface SkillTreeProps {
  stats: UserStats;
  onUnlock: (nodeId: string, cost: number) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ stats, onUnlock }) => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20 px-4 md:px-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <TreePine size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gradient">Neural Skill Tree</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Unlock Advanced Competencies</p>
          </div>
        </div>
        <div className="flex items-center gap-2 glass-panel px-6 py-3 rounded-3xl border border-amber-500/30 shadow-sm">
          <Coins size={20} className="text-amber-400" />
          <span className="text-xl font-black text-amber-400 italic">{stats.coins.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {SKILL_NODES.map((node) => {
          const isUnlocked = stats.skillTree[node.id];
          const canUnlock = node.dependencies.every(dep => stats.skillTree[dep]) && stats.coins >= node.cost;
          const isLocked = !isUnlocked && !canUnlock;

          return (
            <div 
              key={node.id}
              className={`p-8 rounded-[2.5rem] border transition-all relative group
                ${isUnlocked ? 'glass-panel border-indigo-500 shadow-2xl scale-100' : 
                  canUnlock ? 'glass-card border-white/10 hover:border-indigo-400 shadow-lg cursor-pointer' : 
                  'bg-white/5 border-white/5 opacity-40 grayscale'}`}
              onClick={() => !isUnlocked && canUnlock && onUnlock(node.id, node.cost)}
            >
              {isUnlocked && (
                <div className="absolute top-4 right-4 p-2 bg-emerald-500 text-white rounded-xl shadow-lg">
                  <CheckCircle2 size={16} />
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110
                  ${isUnlocked ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-white/10 text-slate-500'}`}>
                  {node.icon}
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{node.module}</span>
                  <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none text-slate-100">{node.title}</h4>
                </div>
              </div>

              <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">{node.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prerequisites</span>
                  <div className="flex gap-1 mt-1">
                    {node.dependencies.length > 0 ? node.dependencies.map(dep => (
                      <div key={dep} className={`w-2 h-2 rounded-full ${stats.skillTree[dep] ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                    )) : <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">None</span>}
                  </div>
                </div>
                
                {!isUnlocked && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border
                    ${canUnlock ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                    <Coins size={14} />
                    <span className="text-sm font-black italic">{node.cost}</span>
                  </div>
                )}
              </div>

              {isLocked && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-[2.5rem] flex items-center justify-center">
                  <div className="p-4 glass-panel rounded-2xl shadow-xl border border-white/10">
                    <Lock size={24} className="text-slate-600" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
