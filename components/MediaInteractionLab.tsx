
import React, { useState, useMemo } from 'react';
import { Waves, Zap, Target, Activity, Info, Sparkles, ArrowDownRight, Maximize2 } from 'lucide-react';

export const MediaInteractionLab: React.FC = () => {
  const [z1, setZ1] = useState(1.5); // MRayls
  const [z2, setZ2] = useState(1.6); // MRayls
  const [v1, setV1] = useState(1540); // m/s
  const [v2, setV2] = useState(1600); // m/s
  const [incidentAngle, setIncidentAngle] = useState(30); // degrees

  const interactionData = useMemo(() => {
    // Reflection Coefficient (IRC) = [(Z2-Z1)/(Z2+Z1)]^2
    const irc = Math.pow((z2 - z1) / (z2 + z1), 2) * 100;
    
    // Snell's Law (Refraction): sin(theta2) = (v2/v1) * sin(theta1)
    const sinTheta1 = Math.sin(incidentAngle * (Math.PI / 180));
    const sinTheta2 = (v2 / v1) * sinTheta1;
    let refractedAngle = 0;
    let isTIR = false; // Total Internal Reflection

    if (sinTheta2 > 1) {
      isTIR = true;
      refractedAngle = 90;
    } else {
      refractedAngle = Math.asin(sinTheta2) * (180 / Math.PI);
    }

    return {
      irc: irc.toFixed(2),
      itc: (100 - irc).toFixed(2),
      refractedAngle: refractedAngle.toFixed(1),
      refractionDirection: v2 > v1 ? 'Away from normal' : v2 < v1 ? 'Toward normal' : 'None',
      isTIR
    };
  }, [z1, z2, v1, v2, incidentAngle]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-bottom-6 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Waves size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-orange-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">Acoustic Boundary Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Reflection & Snell's Law Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Reflection (IRC)</span>
              <span className="text-xl font-black text-orange-400">{interactionData.irc}%</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Refracted Angle</span>
              <span className={`text-xl font-black ${v1 !== v2 ? 'text-indigo-400' : 'text-slate-500'}`}>
                {interactionData.refractedAngle}°
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Boundary Visualization */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner group">
              {/* Boundary Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/20 z-10"></div>
              
              {/* Labels */}
              <div className="absolute top-4 left-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Medium 1 (V1={v1})</div>
              <div className="absolute bottom-4 left-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Medium 2 (V2={v2})</div>

              {/* Normal Line (Vertical) */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-white/10"></div>

              {/* Beam Path SVG */}
              <svg className="absolute inset-0 w-full h-full z-20 overflow-visible">
                 {/* Incident Beam */}
                 <line 
                   x1="50%" y1="0" 
                   x2="50%" y2="50%" 
                   stroke="#f97316" strokeWidth="4"
                   className="transition-all duration-300"
                   style={{ transform: `rotate(${incidentAngle}deg)`, transformOrigin: '50% 50%' }}
                 />
                 
                 {/* Reflected Beam */}
                 <line 
                   x1="50%" y1="50%" 
                   x2="50%" y2="0" 
                   stroke="#f97316" strokeWidth="2" strokeDasharray="4"
                   className="transition-all duration-300"
                   style={{ transform: `rotate(${-incidentAngle}deg)`, transformOrigin: '50% 50%', opacity: parseFloat(interactionData.irc)/100 + 0.1 }}
                 />

                 {/* Refracted Beam */}
                 <line 
                   x1="50%" y1="50%" 
                   x2="50%" y2="100%" 
                   stroke="#6366f1" strokeWidth="4"
                   className="transition-all duration-300"
                   style={{ 
                     transform: `rotate(${180 - parseFloat(interactionData.refractedAngle)}deg)`, 
                     transformOrigin: '50% 50%',
                     opacity: interactionData.isTIR ? 0 : 0.8
                   }}
                 />
              </svg>

              {interactionData.isTIR && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-2xl animate-pulse z-30">
                  Critical Angle: Total Internal Reflection
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Impedance Z1</label>
                   <span className="text-xs font-black text-orange-400">{z1} MRayls</span>
                </div>
                <input 
                  type="range" min="0.5" max="3" step="0.1"
                  value={z1}
                  onChange={(e) => setZ1(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Impedance Z2</label>
                   <span className="text-xs font-black text-orange-400">{z2} MRayls</span>
                </div>
                <input 
                  type="range" min="0.5" max="3" step="0.1"
                  value={z2}
                  onChange={(e) => setZ2(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Speed V1</label>
                   <span className="text-xs font-black text-indigo-400">{v1} m/s</span>
                </div>
                <input 
                  type="range" min="300" max="4000" step="100"
                  value={v1}
                  onChange={(e) => setV1(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Speed V2</label>
                   <span className="text-xs font-black text-indigo-400">{v2} m/s</span>
                </div>
                <input 
                  type="range" min="300" max="4000" step="100"
                  value={v2}
                  onChange={(e) => setV2(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
            
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident Angle</label>
                   <span className="text-xs font-black text-white">{incidentAngle}°</span>
                </div>
                <input 
                  type="range" min="0" max="80" step="5"
                  value={incidentAngle}
                  onChange={(e) => setIncidentAngle(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
                />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-orange-500/10 to-transparent rounded-[2.5rem] border border-orange-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-orange-600 rounded-xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Reflection Logic</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Reflection occurs only with <span className="text-orange-400 font-bold">Perpendicular Incidence</span> and <span className="text-orange-400 font-bold">Mismatching Impedances</span>.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Intensity Reflection Coeff.</p>
                  <p className="text-xs font-bold text-white italic">IRC = [(Z₂ - Z₁) / (Z₂ + Z₁)]²</p>
               </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Maximize2 size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Snell's Law (Refraction)</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 Refraction requires <span className="text-indigo-400 font-bold">Oblique Incidence</span> and <span className="text-indigo-400 font-bold">Different Propagation Speeds</span>.
               </p>
               <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Refraction Summary</p>
                  <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-tight">{interactionData.refractionDirection}</p>
               </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Info size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Exam Note</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  "If V2 is higher than V1, the refracted angle will be LARGER than the incident angle. Remember this for refraction questions!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
