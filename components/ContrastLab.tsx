
import React, { useState, useMemo } from 'react';
import { Droplet, Zap, AlertTriangle, Info, Sparkles, Thermometer, Radio, Activity } from 'lucide-react';

export const ContrastLab: React.FC = () => {
  const [mi, setMi] = useState(0.5); // Mechanical Index

  const behavior = useMemo(() => {
    if (mi < 0.1) return { mode: "None", text: "Low MI: Bubbles oscillate linearly. Backscatter is weak.", color: "text-slate-400", harmonic: "None" };
    if (mi >= 0.1 && mi < 0.7) return { mode: "Non-Linear", text: "Optimal MI: Bubbles resonate and produce harmonics without bursting.", color: "text-emerald-400", harmonic: "High" };
    return { mode: "Bursting", text: "High MI: Bubbles rupture. Extreme non-linear behavior (Transient Cavitation).", color: "text-rose-500", harmonic: "Unstable" };
  }, [mi]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Droplet size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Contrast Agent Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Microbubble Resonance & Mechanical Index</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Current MI</span>
              <span className={`text-xl font-black ${behavior.color}`}>{mi.toFixed(2)}</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Harmonic Signal</span>
              <span className={`text-xl font-black ${behavior.color}`}>{behavior.harmonic}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Bubble Simulation */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8">
              
              <div className="relative">
                {/* The Microbubble */}
                {mi < 0.7 ? (
                  <div 
                    className={`rounded-full border-2 border-indigo-400/50 bg-indigo-500/20 transition-all duration-100 shadow-[0_0_40px_rgba(99,102,241,0.3)]`}
                    style={{ 
                      width: '120px', 
                      height: '120px',
                      animation: mi > 0.1 ? `pulse-bubble ${0.5 / mi}s infinite alternate ease-in-out` : 'none'
                    }}
                  >
                    <div className="absolute inset-0 bg-white/5 rounded-full m-4 blur-sm"></div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 w-32 justify-center">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Zap className="text-rose-500 animate-pulse" size={48} />
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Acoustic Bubble Response: {behavior.mode}
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Output Power (MI Controller)</label>
                  <span className={`text-xs font-black ${behavior.color}`}>{mi.toFixed(2)}</span>
               </div>
               <input 
                  type="range" min="0.05" max="1.5" step="0.01"
                  value={mi}
                  onChange={(e) => setMi(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Activity size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Non-Linear Bubble</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 {behavior.text}
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2 text-center">Resonance Fact</p>
                  <p className="text-xs text-slate-300 leading-relaxed text-center italic">
                    Bubbles expand <span className="text-indigo-400 font-bold">MORE</span> than they contract. This non-linear movement creates strong harmonics.
                  </p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <AlertTriangle size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Formula: MI</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  MI = Peak Rarefactional Pressure / √Frequency
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-emerald-900/20 rounded-[2rem] border border-emerald-500/20">
               <p className="text-xs font-bold text-emerald-100/80 leading-relaxed">
                 Optimal contrast imaging requires <span className="underline">low frequency</span> and <span className="underline">mid-range power</span> to maximize the Mechanical Index without bursting bubbles.
               </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse-bubble {
          from { transform: scale(0.9); }
          to { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};
