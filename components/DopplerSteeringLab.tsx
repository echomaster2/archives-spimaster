
import React, { useState, useMemo } from 'react';
import { Target, Zap, Activity, Info, Sparkles, MoveRight, Maximize2, MousePointer2 } from 'lucide-react';

export const DopplerSteeringLab: React.FC = () => {
  const [boxSteer, setBoxSteer] = useState(0); // -20 to 20
  const [angleCorrect, setAngleCorrect] = useState(0); // 0 to 90
  const vesselAngle = 10; // Vessel is slanted 10 degrees

  const dopplerData = useMemo(() => {
    // Effective Insonation Angle = (90 - boxSteer) - (90 - vesselAngle) ??? 
    // Simplified: Angle between beam and vessel
    const incidentAngle = Math.abs(boxSteer - vesselAngle);
    const cosTheta = Math.cos(incidentAngle * (Math.PI / 180));
    const velocityError = Math.abs(incidentAngle - angleCorrect);
    
    return {
      incidentAngle,
      cos: cosTheta.toFixed(2),
      isOptimal: incidentAngle <= 60,
      isMisaligned: velocityError > 2,
      calculatedVel: (100 * (Math.cos(angleCorrect * Math.PI/180) / cosTheta)).toFixed(0)
    };
  }, [boxSteer, angleCorrect]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Target size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MousePointer2 className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Doppler Steering Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Linear Array Angle Mastery</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Incident Angle</span>
              <span className={`text-xl font-black ${dopplerData.incidentAngle > 60 ? 'text-rose-500' : 'text-emerald-400'}`}>
                {dopplerData.incidentAngle}°
              </span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Cos(θ) Factor</span>
              <span className="text-xl font-black text-indigo-400">{dopplerData.cos}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Scan Area */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner group flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              
              {/* Vessel */}
              <div 
                className="w-[120%] h-12 bg-rose-900/20 border-y-2 border-rose-500/20 relative transition-transform duration-500"
                style={{ transform: `rotate(${vesselAngle}deg)` }}
              >
                 <div className="flex w-full h-full animate-flow-move opacity-40">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="w-4 h-1 bg-rose-500 rounded-full mx-10 my-auto"></div>
                    ))}
                 </div>
              </div>

              {/* Doppler Beam (Steered Box) */}
              <div 
                className="absolute w-24 h-48 border-2 border-indigo-400/50 bg-indigo-500/10 transition-all duration-300 flex flex-col items-center"
                style={{ 
                  transform: `skewX(${boxSteer}deg)`,
                  top: '10%'
                }}
              >
                 <div className="w-full h-px bg-indigo-400/30 mb-8"></div>
                 {/* Angle Correct Cursor */}
                 <div 
                  className={`w-1 h-20 bg-white shadow-xl transition-all duration-300 relative ${dopplerData.isMisaligned ? 'opacity-30' : 'opacity-100'}`}
                  style={{ transform: `rotate(${angleCorrect - boxSteer}deg)` }}
                 >
                    <div className="absolute top-0 -left-1 w-3 h-3 bg-white rounded-full"></div>
                    <div className="absolute bottom-0 -left-1 w-3 h-3 bg-white rounded-full"></div>
                 </div>
                 <span className="text-[6px] font-black text-white/40 uppercase mt-4">Steered Sample Box</span>
              </div>

              {dopplerData.incidentAngle > 60 && (
                <div className="absolute top-4 right-6 bg-rose-600 text-white px-2 py-1 rounded text-[8px] font-black uppercase shadow-xl animate-pulse">
                   Poor Doppler Sensitivity
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Box Steer</label>
                   <span className="text-xs font-black text-indigo-400">{boxSteer}°</span>
                </div>
                <input 
                  type="range" min="-20" max="20" step="10"
                  value={boxSteer}
                  onChange={(e) => setBoxSteer(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Angle Correct</label>
                   <span className="text-xs font-black text-white">{angleCorrect}°</span>
                </div>
                <input 
                  type="range" min="0" max="80" step="2"
                  value={angleCorrect}
                  onChange={(e) => setAngleCorrect(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg`}>
                    <Activity size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Cosine Factor</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Insonation angle must be <span className="text-white font-bold">60° or less</span> for accurate velocity calculations. Angle correction tells the machine the flow direction so it can divide the shift by the cosine.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Actual Flow</span>
                    <span className="text-white">100 cm/s</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Calculated Vel</span>
                    <span className="text-indigo-400">{dopplerData.calculatedVel} cm/s</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Rules</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  "Angle correct must always be parallel to the vessel wall. Never exceed 60 degrees."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes flow-move {
          from { transform: translateX(-100px); }
          to { transform: translateX(400px); }
        }
        .animate-flow-move {
          animation: flow-move 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
