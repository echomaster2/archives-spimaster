
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, AlertTriangle, Zap, Search, Info, X, Loader2, Sparkles, Database } from 'lucide-react';
import { getArtifactDetails } from '../services/geminiService';

const ARTIFACTS = [
  { name: "Reverberation", icon: "Waves", short: "Multiple equally spaced echoes." },
  { name: "Mirror Image", icon: "Copy", short: "False copy deeper than true reflector." },
  { name: "Comet Tail", icon: "Zap", short: "Solid bright line pointing downward." },
  { name: "Shadowing", icon: "Moon", short: "Anechoic region behind high attenuator." },
  { name: "Enhancement", icon: "Sun", short: "Hyperechoic region behind low attenuator." },
  { name: "Edge Shadowing", icon: "Scissors", short: "Shadowing from curved surfaces." },
  { name: "Side Lobes", icon: "Activity", short: "False anatomy created by energy outside main axis." },
  { name: "Speed Error", icon: "Gauge", short: "Step-off appearance due to velocity change." }
];

export const ArtifactExplorer: React.FC = () => {
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async (name: string) => {
    setSelectedArtifact(name);
    setLoading(true);
    setDetails(null);
    try {
      const data = await getArtifactDetails(name);
      setDetails(data || "Information unavailable.");
    } catch (e) {
      setDetails("Error fetching artifact physics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-100">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none text-gradient-vibrant">Artifact Image Lab</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">Visual distortions and the machine assumptions that fail.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-3 px-6 py-4 bg-amber-50 text-amber-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-200 shadow-xl shadow-amber-500/5 h-fit">
            <div className="p-2 bg-amber-500 rounded-lg text-white shadow-lg shadow-amber-500/20"><AlertTriangle size={16} /></div>
            <span>15-20% Registry Weight</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 bg-indigo-50 text-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-200 shadow-xl shadow-indigo-500/5 h-fit font-mono">
            <span>R_C_R_E Mnemonic</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {ARTIFACTS.map((a, idx) => (
          <motion.button
            key={a.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => fetchDetails(a.name)}
            className={`p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border-2 transition-all text-left group hover:scale-[1.02] relative overflow-hidden ${
              selectedArtifact === a.name ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl' : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm'
            }`}
          >
            {selectedArtifact === a.name && (
              <motion.div 
                layoutId="active-bg"
                className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700"
              />
            )}
            <div className="relative z-10">
              <div className={`p-3 md:p-4 rounded-2xl md:rounded-3xl w-fit mb-4 md:mb-6 transition-all ${
                selectedArtifact === a.name ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
              }`}>
                <Database size={20} className="md:w-6 md:h-6" />
              </div>
              <h4 className="font-black text-xs md:text-sm mb-2 uppercase tracking-widest leading-tight">{a.name}</h4>
              <p className={`text-[9px] md:text-[10px] font-bold leading-relaxed ${
                selectedArtifact === a.name ? 'text-indigo-100' : 'text-slate-400'
              }`}>{a.short}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="p-8 md:p-12 glass-panel rounded-[3rem] md:rounded-[4rem] border border-slate-100 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-50" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-slate-900 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center border-4 border-white shadow-2xl relative">
                <div className="font-black text-4xl md:text-6xl text-white italic">RCRE</div>
                <div className="absolute -bottom-4 right-0 p-3 bg-amber-500 rounded-2xl text-white shadow-lg"><Zap size={24} /></div>
            </div>
            <div className="flex-1 space-y-6">
                <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-slate-900">Neural Heuristic: <span className="text-indigo-600">Artifact Logic</span></h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { l: 'Reckless', a: 'Reverberation' },
                    { l: 'Cats', a: 'Comet Tail' },
                    { l: 'Ruin', a: 'Refraction' },
                    { l: 'Echocardiograms', a: 'Enhancement' },
                  ].map(m => (
                    <div key={m.a} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">{m.l}</p>
                       <p className="text-xs font-bold text-slate-500 uppercase">{m.a}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-widest max-w-2xl bg-amber-50 p-4 rounded-xl border border-amber-100 italic">
                  "Artifacts are predictable computer errors. By deconstructing the error, we identify the exact patient tissue facts."
                </p>
            </div>
         </div>
      </div>

      {selectedArtifact && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-500">
           <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-indigo-600 rounded-xl">
                    <Sparkles size={18} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black tracking-tight">{selectedArtifact} Physics Briefing</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">AI Deep Dive</p>
                 </div>
              </div>
              <button onClick={() => setSelectedArtifact(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X size={20} />
              </button>
           </div>
           
           <div className="p-10 relative min-h-[400px]">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                   <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Deconstructing Sonographic Logic...</p>
                </div>
              ) : (
                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:font-medium prose-p:text-slate-600">
                   {details?.split('\n').map((line, idx) => {
                     if (line.match(/^\d\./)) return <h4 key={idx} className="text-xl mt-8 mb-4 border-l-4 border-indigo-600 pl-4">{line.substring(2)}</h4>;
                     if (line.trim().startsWith('-') || line.trim().startsWith('*')) return <li key={idx} className="text-sm my-2 text-slate-600 font-bold ml-4">{line.replace(/^[-*]\s*/, '')}</li>;
                     return <p key={idx} className="text-sm leading-relaxed mb-4">{line}</p>;
                   })}
                   <div className="mt-12 p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
                      <div className="p-3 bg-amber-500 rounded-2xl text-white shrink-0 h-fit">
                         <Zap size={24} />
                      </div>
                      <div>
                         <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 mb-2">MasterClass Note</h5>
                         <p className="text-xs font-bold text-amber-900 italic">
                           Always assume sound travels in a straight line, at exactly 1540m/s. Artifacts happen when these assumptions are wrong.
                         </p>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
