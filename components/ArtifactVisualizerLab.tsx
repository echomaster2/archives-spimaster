
import React, { useState, useMemo } from 'react';
import { AlertTriangle, Zap, Target, Activity, Info, Sparkles, Layers, Search, Eye } from 'lucide-react';

type ArtifactType = 'mirror' | 'speed-error' | 'refraction';

export const ArtifactVisualizerLab: React.FC = () => {
  const [activeArtifact, setActiveArtifact] = useState<ArtifactType>('mirror');
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0); // For speed error

  const artifactInfo = {
    mirror: {
      title: "Mirror Image Artifact",
      assumption: "Sound travels directly to a reflector and back.",
      physics: "Sound reflects off a strong specular reflector (Diaphragm) before hitting the target. The machine assumes a straight path, placing a second 'mirror' image deeper.",
      fix: "Change scanning angle."
    },
    'speed-error': {
      title: "Speed Error (Step-off)",
      assumption: "Sound travels at exactly 1,540 m/s.",
      physics: "Sound travels through media with different speeds. Faster media place echoes too shallow; slower media place them too deep.",
      fix: "Recognize tissue boundaries."
    },
    refraction: {
      title: "Refraction (Edge Shadowing)",
      assumption: "Sound travels in a straight line.",
      physics: "Sound bends at an oblique interface between media with different speeds. This results in missing echoes (shadows) or misplacement.",
      fix: "Scan from a perpendicular angle."
    }
  };

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <AlertTriangle size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Eye className="text-amber-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Visual Artifact Simulator</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Broken Assumption Visualization</p>
          </div>
          
          <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10">
            {(['mirror', 'speed-error', 'refraction'] as ArtifactType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveArtifact(type)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeArtifact === type ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-10">
            {/* Visual Ray-Tracing Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner group flex items-center justify-center">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {activeArtifact === 'mirror' && (
                <div className="relative w-full h-full p-8 flex flex-col items-center">
                   <div className="w-16 h-8 bg-indigo-600 rounded-lg absolute top-0 z-20 shadow-lg"></div>
                   {/* Main Beam path */}
                   <svg className="w-full h-full relative z-10">
                      {/* Diaphragm (Mirror) */}
                      <line x1="10%" y1="60%" x2="90%" y2="60%" stroke="white" strokeWidth="4" strokeDasharray="8" />
                      <text x="15%" y="55%" fill="white" fontSize="10" className="font-black uppercase tracking-widest">Mirror (Diaphragm)</text>
                      
                      {/* Real Reflector */}
                      <circle cx="50%" cy="40%" r="8" fill="#10b981" />
                      <text x="55%" y="40%" fill="#10b981" fontSize="10" className="font-black uppercase">Real</text>

                      {/* Mirror Echo */}
                      <circle cx="50%" cy="80%" r="8" fill="#f43f5e" className="animate-pulse" />
                      <text x="55%" y="80%" fill="#f43f5e" fontSize="10" className="font-black uppercase">Artifact</text>

                      {/* Path lines */}
                      <path d="M 50% 10 L 50% 60 L 50% 40 L 50% 60 L 50% 10" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" className="animate-dash" />
                   </svg>
                </div>
              )}

              {activeArtifact === 'speed-error' && (
                <div className="relative w-full h-full p-8 flex flex-col items-center">
                   <div className="w-16 h-8 bg-indigo-600 rounded-lg absolute top-0 z-20 shadow-lg"></div>
                   <svg className="w-full h-full relative z-10">
                      {/* Interface */}
                      <rect x="0" y="50%" width="100%" height="50%" fill="rgba(255,255,255,0.05)" />
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="2" opacity="0.2" />
                      
                      {/* Real Target */}
                      <circle cx="50%" cy="70%" r="8" fill="#10b981" />
                      
                      {/* Artifact Target (moves based on speed) */}
                      <circle 
                        cx="50%" 
                        cy={`${70 - (speedMultiplier - 1) * 40}%`} 
                        r="8" 
                        fill="#f43f5e" 
                        className="animate-pulse transition-all duration-500" 
                      />

                      <text x="10%" y="45%" fill="white" fontSize="10" className="font-black uppercase opacity-40">Soft Tissue (1540)</text>
                      <text x="10%" y="55%" fill="white" fontSize="10" className="font-black uppercase opacity-40">Media ({(speedMultiplier * 1540).toFixed(0)})</text>
                   </svg>
                   
                   <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 bg-black/60 p-4 rounded-2xl border border-white/10">
                      <span className="text-[8px] font-black uppercase text-slate-500">Speed Multiplier</span>
                      <input 
                        type="range" min="0.5" max="1.5" step="0.1" 
                        value={speedMultiplier} 
                        onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                   </div>
                </div>
              )}

              {activeArtifact === 'refraction' && (
                <div className="relative w-full h-full p-8 flex flex-col items-center">
                   <div className="w-16 h-8 bg-indigo-600 rounded-lg absolute top-0 z-20 shadow-lg"></div>
                   <svg className="w-full h-full relative z-10">
                      {/* Interface at angle */}
                      <line x1="0" y1="30%" x2="100%" y2="70%" stroke="white" strokeWidth="2" opacity="0.3" />
                      
                      {/* Refracted Beam */}
                      <path d="M 50% 5 L 50% 50 L 70% 90" fill="none" stroke="#6366f1" strokeWidth="3" />
                      
                      {/* Machine's Assumption (Straight) */}
                      <line x1="50%" y1="50%" x2="50%" y2="90%" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4" opacity="0.5" />
                      
                      {/* Misplaced Reflector */}
                      <circle cx="70%" cy="90%" r="8" fill="#10b981" />
                      <circle cx="50%" cy="90%" r="8" fill="#f43f5e" className="animate-pulse" />
                   </svg>
                   <div className="absolute top-4 left-6 bg-rose-600 text-white px-2 py-1 rounded text-[8px] font-black uppercase">Lateral Misplacement</div>
                </div>
              )}
            </div>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 flex gap-4">
               <div className="p-3 bg-indigo-600/20 rounded-2xl shrink-0 h-fit">
                  <Activity size={24} className="text-indigo-400" />
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Assumption Broken</h4>
                  <p className="text-sm font-medium text-slate-300 leading-relaxed italic">"{artifactInfo[activeArtifact].assumption}"</p>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
               <h4 className="text-xl font-black mb-4 tracking-tight">{artifactInfo[activeArtifact].title}</h4>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">{artifactInfo[activeArtifact].physics}</p>
               
               <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
                  <Zap size={18} className="text-emerald-500" />
                  <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Clinical Fix: {artifactInfo[activeArtifact].fix}</p>
               </div>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/20">
               <div className="flex items-center gap-3 mb-4">
                  <Layers className="text-indigo-200" size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Registry Gold</h4>
               </div>
               <p className="text-xs font-medium text-indigo-100 leading-relaxed">
                 Artifacts are not always bad! <span className="font-black italic">Enhancement</span> and <span className="font-black italic">Shadowing</span> provide diagnostic information about tissue composition.
               </p>
            </div>
            
            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Pro Tip</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Refraction only happens with <span className="text-white">oblique incidence</span> and <span className="text-white">mismatching speeds</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        .animate-dash {
          stroke-dasharray: 5;
          animation: dash 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
