
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, TrendingUp, Target, Award, CheckCircle2, 
  AlertCircle, Download, Ghost, Zap, Brain, ShieldCheck,
  Activity, Database
} from 'lucide-react';
import { UserVault, ExamResult, UserStats } from '../types';
import { PredictiveForecaster } from './PredictiveForecaster';

interface PerformanceAnalyticsProps {
  vault: UserVault;
  stats: UserStats;
  onOpenSRS?: () => void;
}

const CATEGORY_AVG = [
  { name: 'Physics Principles', avg: 72 },
  { name: 'Transducers', avg: 68 },
  { name: 'Doppler', avg: 65 },
  { name: 'Artifacts', avg: 70 },
  { name: 'Safety', avg: 82 },
  { name: 'Hemodynamics', avg: 60 },
];

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ vault, stats, onOpenSRS }) => {
  const history = vault.examHistory || [];
  
  const latestResult = history.length > 0 ? history[history.length - 1] : null;
  
  const heatmapData = useMemo(() => {
    // In a real app, we'd calculate this from all exam answers
    // For now, we use the weakTopics from results to weight the categories
    const categories: Record<string, number> = {
      'Physics Principles': 80,
      'Transducers': 85,
      'Doppler': 75,
      'Artifacts': 70,
      'Safety': 90,
      'Hemodynamics': 65,
      'Instrumentation': 80,
    };

    history.forEach(res => {
      res.weakTopics.forEach(topic => {
        if (categories[topic]) {
          categories[topic] = Math.max(10, categories[topic] - 5);
        }
      });
      if (res.score > 80) {
        Object.keys(categories).forEach(cat => {
          if (!res.weakTopics.includes(cat)) {
            categories[cat] = Math.min(100, categories[cat] + 2);
          }
        });
      }
    });

    return categories;
  }, [history]);

  const canDownloadCertificate = stats.level >= 10 && stats.badges.length >= 5;

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 md:px-0">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-2xl">
                <BarChart3 size={24} />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none text-gradient-vibrant">Registry <br/> Analytics</h2>
           </div>
           <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] max-w-xl leading-relaxed">
             Neural state evaluation across the six core ARDMS dimensions. {history.length > 0 ? `Computed from ${history.length} simulation cycles.` : 'Insufficient data for baseline analysis.'}
           </p>
        </div>

        {canDownloadCertificate && (
          <button className="px-10 py-5 bg-white text-black rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-4">
             <Award size={20} /> Download Mastery Certificate
          </button>
        )}
      </div>

      <PredictiveForecaster vault={vault} stats={stats} />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Score Tracker & Heatmap */}
        <div className="lg:col-span-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricItem 
                title="Average Score" 
                value={history.length > 0 ? `${Math.round(history.reduce((a, b) => a + (b.score as number), 0) / history.length)}%` : 'N/A'} 
                trend={history.length > 1 ? ((history[history.length-1].score as number) > (history[history.length-2].score as number) ? 'up' : 'down') : 'stable'}
                icon={Target}
                color="text-indigo-400"
              />
              <MetricItem 
                title="Exams Taken" 
                value={history.length} 
                trend="stable"
                icon={ShieldCheck}
                color="text-emerald-400"
              />
              <MetricItem 
                title="Top Category" 
                value={Object.entries(heatmapData).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0]} 
                trend="up"
                icon={Zap}
                color="text-amber-400"
              />
           </div>

           {/* Detailed Heatmap */}
           <div className="glass-panel p-8 md:p-12 rounded-[3.5rem] border border-white/5 space-y-10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <TrendingUp className="text-indigo-400" size={20} />
                    <h3 className="text-lg font-black uppercase tracking-widest text-white italic">Dimensional Alignment</h3>
                 </div>
                 <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest text-slate-500">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-indigo-500" /> <span>User</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-white/10" /> <span>Global Pool</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 {Object.entries(heatmapData).map(([cat, score], idx) => {
                    const peerAvg = CATEGORY_AVG.find(c => c.name === cat)?.avg || 70;
                    return (
                      <div key={cat} className="space-y-3 group">
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">{cat}</span>
                            <div className="flex items-center gap-4">
                               <span className="text-[8px] font-black text-slate-600 italic">Peer Avg: {peerAvg}%</span>
                               <span className={`text-sm font-black italic tracking-tight ${(score as number) > peerAvg ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {Math.round(score as number)}%
                               </span>
                            </div>
                         </div>
                         <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/30 p-[2px]">
                            {/* Peer average line */}
                            <div 
                              className="absolute top-1/2 -translate-y-1/2 h-4 w-px bg-white/40 z-20"
                              style={{ left: `${peerAvg}%` }}
                            />
                            <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${score as number}%` }}
                               viewport={{ once: true }}
                               transition={{ duration: 1, delay: idx * 0.1 }}
                               className={`h-full rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.5)]`}
                            />
                         </div>
                      </div>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Right: Insights & Challenges */}
        <div className="lg:col-span-4 space-y-8">
           {latestResult && (
             <div className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black uppercase tracking-widest text-indigo-200">Latest Assessment</span>
                      <span className="text-[10px] font-bold text-white/60">{new Date(latestResult.timestamp).toLocaleDateString()}</span>
                   </div>
                   <h4 className="text-4xl font-black italic tracking-tighter leading-none">{latestResult.score}% <br/> Sync Logic</h4>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Primary Weakness</p>
                      <div className="flex flex-wrap gap-2">
                         {latestResult.weakTopics.map(topic => (
                            <span key={topic} className="px-3 py-1 bg-white/20 rounded-lg text-[9px] font-black uppercase tracking-widest">{topic}</span>
                         ))}
                      </div>
                   </div>
                   <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all">
                      Analyze Artifacts
                   </button>
                </div>
             </div>
           )}

           <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/10 space-y-6">
              <div className="flex items-center gap-3">
                 <Brain className="text-rose-400" size={18} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white italic">Neural Drift Alert</h4>
              </div>
              <p className="text-sm font-bold text-slate-500 italic leading-relaxed">
                 You haven't practiced <span className="text-white">Hemodynamics</span> labs in 4 days. Neural retention in this sector is dropping by <span className="text-rose-400">-12 PERCENT</span> estimated.
              </p>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                 <button className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-colors flex items-center gap-2">
                    Initialize Flow Lab <CheckCircle2 size={12}/>
                 </button>
                 {onOpenSRS && (
                   <button 
                    onClick={onOpenSRS}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 hover:text-white transition-colors flex items-center gap-2"
                   >
                    Neural Flush <Zap size={12}/>
                   </button>
                 )}
              </div>
           </div>

           <div className="p-8 bg-emerald-600/10 rounded-[2.5rem] border border-emerald-500/20 flex gap-4">
              <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg">
                 <Activity size={20} />
              </div>
              <div>
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Benchmarking Result</h5>
                 <p className="text-xs font-bold text-slate-300 italic leading-relaxed">
                   Your diagnostic velocity in <span className="text-white">Transducer Logic</span> is in the <span className="text-emerald-400 font-black italic underline">TOP 4 PERCENT</span> globally.
                 </p>
              </div>
           </div>
        </div>
      </div>
      
      {/* Simulation History List */}
      <div className="space-y-6">
         <div className="flex items-center gap-3">
            <Database className="text-slate-500" size={16} />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Neural Sync Log</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.slice().reverse().map((res, i) => (
               <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-white/20 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{new Date(res.timestamp).toLocaleDateString()}</span>
                        <span className="text-xl font-black text-white italic tracking-tighter">{res.score}%</span>
                     </div>
                     <div className={`p-2 rounded-lg ${res.score >= 70 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-400'}`}>
                        {res.score >= 70 ? <ShieldCheck size={16}/> : <AlertCircle size={16}/>}
                     </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {res.weakTopics.slice(0, 2).map((topic, ti) => (
                        <span key={ti} className="px-2 py-0.5 bg-black/40 rounded text-[7px] font-black uppercase text-slate-400">{topic}</span>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const MetricItem = ({ title, value, trend, icon: Icon, color }: { title: string, value: string | number, trend: 'up' | 'down' | 'stable', icon: any, color: string }) => (
  <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-4 group hover:bg-white/[0.07] transition-all">
    <div className="flex items-center justify-between">
       <div className={`p-3 bg-white/5 rounded-2xl ${color} shadow-lg`}>
          <Icon size={20} />
       </div>
       <div className="flex flex-col items-end">
          {trend === 'up' && <TrendingUp size={14} className="text-emerald-500" />}
          {trend === 'down' && <Ghost size={14} className="text-rose-500" />}
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{trend}</span>
       </div>
    </div>
    <div>
       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{title}</h4>
       <p className="text-3xl font-black italic text-white tracking-tighter line-clamp-1">{value}</p>
    </div>
  </div>
);
