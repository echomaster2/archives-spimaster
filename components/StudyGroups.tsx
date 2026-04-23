
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, MessageSquare, Zap, Globe, 
  Lock, ArrowRight, ShieldCheck, 
  Sparkles, Database, Activity,
  Layers, Brain, ChevronLeft, LayoutDashboard, Radio,
  Clock, Play, Flame, Send
} from 'lucide-react';
import { toast } from 'sonner';
import { CommunityExtractions } from './CommunityExtractions';

interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  members: number;
  activityLevel: 'High' | 'Medium' | 'Low';
  isPrivate: boolean;
  intensity: number; // 0-100
}

const INITIAL_GROUPS: StudyGroup[] = [
  { id: '1', name: 'Doppler Knights', topic: 'Hemodynamics', members: 124, activityLevel: 'High', isPrivate: false, intensity: 85 },
  { id: '2', name: 'Artifact Hunters', topic: 'Imaging Errors', members: 89, activityLevel: 'Medium', isPrivate: false, intensity: 60 },
  { id: '3', name: 'Transducer Techs', topic: 'Instrumentation', members: 56, activityLevel: 'Low', isPrivate: false, intensity: 45 },
  { id: '4', name: 'The ALARA Vanguard', topic: 'Safety & Bioeffects', members: 210, activityLevel: 'High', isPrivate: true, intensity: 92 },
  { id: '5', name: 'Wave Theory Core', topic: 'Basic Physics', members: 342, activityLevel: 'High', isPrivate: false, intensity: 78 },
];

interface StudyGroupsProps {
  user: any;
}

export const StudyGroups: React.FC<StudyGroupsProps> = ({ user }) => {
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [isAtmosphereSynced, setIsAtmosphereSynced] = useState(false);
  const [sessionCountdown, setSessionCountdown] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    if (sessionCountdown !== null && sessionCountdown > 0) {
      const timer = setTimeout(() => setSessionCountdown(sessionCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (sessionCountdown === 0) {
      toast.success('Neural Focus Session Initialized!', {
        icon: <Zap className="text-amber-500" />
      });
      setSessionCountdown(null);
    }
  }, [sessionCountdown]);

  const startFocusSession = () => {
    setSessionCountdown(30);
    toast.info('Focus Session Scheduled for all nodes');
  };

  if (selectedGroup) {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-40">
        <div className="flex items-center justify-between">
           <button 
             onClick={() => setSelectedGroup(null)}
             className="px-6 py-3 glass-panel rounded-2xl flex items-center gap-3 text-slate-400 hover:text-white transition-all group"
           >
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Network
           </button>
           <div className="flex items-center gap-4 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl relative overflow-hidden">
              {isAtmosphereSynced && (
                 <motion.div 
                   initial={{ x: '-100%' }}
                   animate={{ x: '100%' }}
                   transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   className="absolute inset-0 bg-indigo-400/10 pointer-events-none"
                 />
              )}
              <div className={`w-2 h-2 rounded-full ${isAtmosphereSynced ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]' : 'bg-emerald-500'} animate-pulse`} />
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest leading-none">
                 {isAtmosphereSynced ? 'Atmosphere Synced' : `Synapse Active: ${selectedGroup.name}`}
              </span>
           </div>
        </div>

        <div className="tech-card p-12 md:p-20 rounded-[4rem] text-white overflow-hidden relative hardware-border">
           <div className="absolute inset-0 neural-grid opacity-10" />
           <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-10">
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <Zap className="text-amber-400" size={24} />
                       <h4 className="micro-label">Resource Pool</h4>
                    </div>
                    <h2 className="text-5xl md:text-[6rem] lg:text-[8rem] font-display font-black italic uppercase tracking-tighter leading-[0.8] text-gradient-vibrant">
                       {selectedGroup.name}
                    </h2>
                 </div>
                 <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg italic opacity-80">
                    Collaborative workspace for {selectedGroup.topic} mastery. Share mnemonics, solve edge cases, and sync logic.
                 </p>
                 <div className="flex flex-wrap gap-4">
                    <div className="glass-panel px-6 py-4 rounded-2xl border border-white/5">
                       <p className="text-2xl font-black text-white italic">{selectedGroup.members}</p>
                       <p className="micro-label opacity-40">Active Nodes</p>
                    </div>
                    <div className="glass-panel px-6 py-4 rounded-2xl border border-white/5">
                       <p className="text-2xl font-black text-indigo-400 italic">#{selectedGroup.id}92</p>
                       <p className="micro-label opacity-40">Net Rank</p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsAtmosphereSynced(!isAtmosphereSynced);
                        if (!isAtmosphereSynced) {
                          toast.success('Neural Atmosphere Synchronized', {
                            icon: <Radio className="text-indigo-400" />
                          });
                        }
                      }}
                       className={`px-6 py-4 rounded-2xl border transition-all flex flex-col justify-center items-center ${isAtmosphereSynced ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                    >
                       <Radio size={20} className={isAtmosphereSynced ? 'animate-pulse' : ''} />
                       <p className="micro-label !text-[8px] mt-1">{isAtmosphereSynced ? 'Synced' : 'Sync Atmosphere'}</p>
                    </button>
                 </div>
              </div>
              
              <div className="relative">
                 <div className="glass-panel p-8 rounded-[3rem] border border-white/10 relative overflow-hidden bg-slate-950/40 backdrop-blur-3xl">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                          <Clock className="text-indigo-400" size={18} />
                          <h4 className="micro-label">Focus Session</h4>
                       </div>
                       {sessionCountdown !== null && (
                         <div className="px-4 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-[10px] font-black text-amber-500 animate-pulse">
                           SYNCING... {sessionCountdown}s
                         </div>
                       )}
                    </div>
                    
                    <div className="space-y-6">
                       <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-6">
                          <div className="p-4 bg-indigo-500/20 rounded-full text-indigo-400">
                             <Flame size={24} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none mb-2">Current Active Sprint</p>
                             <h5 className="text-xl font-black text-white italic uppercase tracking-tighter">Fast Fourier Transform Labs</h5>
                          </div>
                       </div>
                       
                       <button 
                        onClick={startFocusSession}
                        disabled={sessionCountdown !== null}
                        className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                       >
                          <Play size={16} fill="currentColor" /> Initialize Synchronized Focus
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                        <LayoutDashboard size={20} />
                    </div>
                    <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Topic Extraction Pool</h3>
                </div>
                <CommunityExtractions user={user} topic={selectedGroup.topic} />
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-600 rounded-2xl text-white">
                        <MessageSquare size={20} />
                    </div>
                    <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Neural Whisper</h3>
                </div>

                <div className="tech-card h-[500px] rounded-[3rem] flex flex-col p-8 border border-white/5 hardware-border relative overflow-hidden bg-slate-950/40">
                   <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                      {[
                        { u: 'Alex_Sonos', m: "Need a mnemonic for Reynolds' Number!", t: '2m' },
                        { u: 'SarahDiagnostics', m: "Think 'LAM' for laminar flow - Low, Always, Measured", t: '1m', isAi: true },
                        { u: 'Tech_Lead', m: "Starting the Doppler Equation sprint in 5 mins", t: 'Now' }
                      ].map((chat, i) => (
                        <div key={i} className={`flex flex-col gap-2 ${chat.u === 'SarahDiagnostics' ? 'items-end' : 'items-start'}`}>
                           <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-black uppercase tracking-widest ${chat.u === 'SarahDiagnostics' ? 'text-indigo-400' : 'text-slate-500'}`}>{chat.u}</span>
                              <span className="text-[8px] text-slate-700">{chat.t}</span>
                           </div>
                           <div className={`px-5 py-3 rounded-2xl text-xs font-medium max-w-[80%] ${chat.u === 'SarahDiagnostics' ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'}`}>
                              {chat.m}
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="mt-8 relative">
                      <input 
                        type="text" 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Transmit logic..."
                        className="w-full bg-[#080c14] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 italic"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-indigo-400 hover:text-white transition-colors">
                        <Send size={18} />
                      </button>
                   </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 md:px-0 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-600 rounded-[2rem] text-white shadow-2xl">
                 <Users size={32} />
              </div>
              <h2 className="text-4xl md:text-[7rem] lg:text-[9rem] font-display font-black italic text-white uppercase tracking-tighter leading-[0.8] transition-all text-gradient-vibrant">
                 Study <br/> Groups
              </h2>
           </div>
           <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] max-w-xl opacity-60">
              Synchronized logic pools for collaborative ultrasound mastery. Join the global sonography neural net.
           </p>
        </div>
        
        <div className="flex gap-4">
           <div className="text-center px-8 border-r border-white/10">
              <p className="text-3xl font-black text-indigo-400 italic">2.4k</p>
              <p className="micro-label opacity-40">Active Nodes</p>
           </div>
           <div className="text-center px-8">
              <p className="text-3xl font-black text-emerald-400 italic">14</p>
              <p className="micro-label opacity-40">Open Sprints</p>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {INITIAL_GROUPS.map((group, idx) => (
          <motion.div 
            key={group.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative"
          >
            <div className={`absolute -inset-1 bg-gradient-to-r ${group.intensity > 80 ? 'from-rose-500 to-indigo-600' : 'from-indigo-600 to-emerald-500'} rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition duration-1000`} />
            <div className="relative glass-card p-10 rounded-[3rem] border border-white/5 space-y-8 flex flex-col h-full bg-slate-950/80 backdrop-blur-3xl shadow-2xl hover:translate-y-[-8px] transition-all duration-500 overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000">
                  <Brain size={120} />
               </div>

               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                        {group.isPrivate ? <Lock size={12} className="text-rose-400" /> : <Globe size={12} className="text-indigo-400" />}
                        <span className="micro-label !py-0 opacity-60 group-hover:opacity-100 transition-opacity">{group.topic}</span>
                     </div>
                     <h4 className="text-2xl md:text-4xl font-display font-black italic text-white uppercase tracking-tighter leading-none">{group.name}</h4>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${group.activityLevel === 'High' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                     {group.activityLevel} PULSE
                  </div>
               </div>

               <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Neural Intensity</span>
                        <span className={group.intensity > 80 ? 'text-rose-400' : 'text-indigo-400'}>{group.intensity}%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${group.intensity}%` }}
                           className={`h-full rounded-full ${group.intensity > 80 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                        />
                     </div>
                  </div>

                  <div className="flex items-center gap-6">
                     <div className="flex -space-x-3">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden shadow-lg">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${group.id}-${i}`} alt="Member" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                           +{group.members - 3}
                        </div>
                     </div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active nodes</p>
                  </div>
               </div>

               <button 
                onClick={() => setSelectedGroup(group)}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
               >
                  Sync Neural Net <ArrowRight size={16} />
               </button>
            </div>
          </motion.div>
        ))}

        {/* Custom Group Creation */}
        <div className="p-10 rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-6 group hover:border-indigo-500/20 transition-colors">
           <div className="p-6 bg-white/5 rounded-full text-slate-600 group-hover:scale-110 group-hover:text-indigo-500 transition-all">
              <Layers size={40} />
           </div>
           <div className="space-y-1">
              <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Forge Sub-Net</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Create a Private Collaborative Pool</p>
           </div>
           <button className="px-8 py-3 bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
              Initialize Protocol
           </button>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-[4rem] border border-white/5 p-12 space-y-10 hardware-border relative overflow-hidden">
         <div className="absolute inset-0 atmosphere opacity-10 pointer-events-none" />
         <div className="flex items-center gap-6">
            <div className="p-3 bg-rose-600 rounded-2xl text-white">
               <Activity size={24} />
            </div>
            <div>
               <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Global Synapse Feed</h3>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Real-time transmissions across the network</p>
            </div>
         </div>

         <CommunityExtractions user={user} />
      </div>
    </div>
  );
};
