
import React, { useState, useMemo } from 'react';
import { Waves, Zap, Target, Activity, Info, Sparkles, MoveRight, ArrowDownRight, Ruler } from 'lucide-react';

export const RefractionLab: React.FC = () => {
  const [incidentAngle, setIncidentAngle] = useState(30);
  const [v1, setV1] = useState(1540); // Soft tissue
  const [v2, setV2] = useState(3500); // Bone

  const refractionData = useMemo(() => {
    const sinTheta1 = Math.sin(incidentAngle * (Math.PI / 180));
    const sinTheta2 = (v2 / v1) * sinTheta1;
    
    let theta2 = 0;
    let isTIR = false; // Total Internal Reflection

    if (sinTheta2 > 1) {
      isTIR = true;
      theta2 = 90;
    } else {
      theta2 = Math.asin(sinTheta2) * (180 / Math.PI);
    }

    const direction = v2 > v1 ? "Away from Normal" : v2 < v1 ? "Toward Normal" : "No Refraction";
    const color = v2 > v1 ? "text-rose-400" : v2 < v1 ? "text-emerald-400" : "text-slate-400";

    return {
      theta2: theta2.toFixed(1),
      direction,
      color,
      isTIR,
      ratio: (v2 / v1).toFixed(2)
    };
  }, [incidentAngle, v1, v2]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <ArrowDownRight size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Ruler className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Refraction (Snell's) Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Propagation Speed & Bending Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Incident (θ1)</span>
              <span className="text-xl font-black text-white">{incidentAngle}°</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Refracted (θ2)</span>
              <span className={`text-xl font-black ${refractionData.color}`}>{refractionData.theta2}°</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Ray-Trace Simulation */}
            <div className="bg-black rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center group">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {/* Boundary */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/20 z-10"></div>
              {/* Normal Line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-white/20"></div>

              <svg className="absolute inset-0 w-full h-full z-20 overflow-visible">
                 {/* Incident Ray */}
                 <line 
                   x1="50%" y1="0" x2="50%" y2="50%" 
                   stroke="#fff" strokeWidth="4"
                   style={{ transform: `rotate(${incidentAngle}deg)`, transformOrigin: '50% 50%' }}
                 />
                 {/* Refracted Ray */}
                 <line 
                   x1="50%" y1="50%" x2="50%" y2="100%" 
                   stroke={refractionData.isTIR ? "#f43f5e" : "#6366f1"} 
                   strokeWidth="4"
                   className="transition-all duration-500"
                   style={{ 
                     transform: `rotate(${180 - parseFloat(refractionData.theta2)}deg)`, 
                     transformOrigin: '50% 50%',
                     opacity: refractionData.isTIR ? 0.3 : 1
                   }}
                 />
              </svg>

              {refractionData.isTIR && (
                <div className="absolute bottom-12 bg-rose-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-2xl animate-pulse z-30">
                  Critical Angle Reached: TIR
                </div>
              )}

              <div className="absolute top-4 left-6 text-[8px] font-black text-slate-500 uppercase">Medium 1 (v={v1}m/s)</div>
              <div className="absolute bottom-4 left-6 text-[8px] font-black text-slate-500 uppercase">Medium 2 (v={v2}m/s)</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident θ</label>
                   <span className="text-xs font-black">{incidentAngle}°</span>
                </div>
                <input 
                  type="range" min="0" max="80" step="5"
                  value={incidentAngle}
                  onChange={(e) => setIncidentAngle(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">v2 speed</label>
                   <span className="text-xs font-black">{v2} m/s</span>
                </div>
                <input 
                  type="range" min="300" max="4000" step="100"
                  value={v2}
                  onChange={(e) => setV2(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg`}>
                    <Target size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">The Bending Direction</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Refraction only occurs if there is <span className="text-white font-bold underline">Oblique Incidence</span> (angle ≠ 0) AND a <span className="text-white font-bold underline">Speed Mismatch</span>.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-2 text-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Resultant Path</span>
                  <p className={`text-lg font-black uppercase italic ${refractionData.color}`}>{refractionData.direction}</p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Rules</h5>
                {/* Fixed θ1 and θ2 parsing error by using string literal inside brackets to prevent them from being interpreted as JSX tags */}
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                  {"If v2 > v1, θ2 > θ1 (Away from normal). If v2 < v1, θ2 < θ1 (Toward normal)."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
