
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Radio, Target, Zap, Info, Cpu, Layers, Maximize2 } from 'lucide-react';

type TransducerType = 'linear' | 'phased' | 'convex';

export const TransducerLab: React.FC = () => {
  const [type, setType] = useState<TransducerType>('linear');
  const [steeringAngle, setSteeringAngle] = useState(0);

  const transducerData = {
    linear: {
      title: "Linear Sequential Array",
      description: "Large footprint. Elements are fired in small groups. Produces a rectangular image. Used for vascular and small parts.",
      shape: "Rectangular",
      steering: "Electronic Slopes (Color Doppler only)",
      focusing: "Electronic Curvature",
      color: "bg-blue-500",
      registryTip: "If one element is damaged, a vertical dropout line appears directly below the crystal."
    },
    phased: {
      title: "Linear Phased Array",
      description: "Small footprint. All elements are fired almost simultaneously. Produces a sector/pie-shaped image. Used for cardiac imaging.",
      shape: "Sector",
      steering: "Electronic (Sloped pattern)",
      focusing: "Electronic (Curved pattern)",
      color: "bg-purple-500",
      registryTip: "Damage to one element results in erratic steering and focusing, not a single dropout line."
    },
    convex: {
      title: "Curved/Convex Array",
      description: "Large footprint with a curved face. Elements fired in groups. Produces a blunted sector image. Used for abdominal and OB/GYN.",
      shape: "Blunted Sector",
      steering: "Natural (due to curved face)",
      focusing: "Electronic Curvature",
      color: "bg-emerald-500",
      registryTip: "The image width is wider in the far field than the near field."
    }
  };

  const current = transducerData[type];

  return (
    <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-right duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1)_0%,transparent_60%)]" />
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Cpu size={180} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Radio className="text-indigo-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest">Transducer Array Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Clinical Beam Dynamics Simulator</p>
          </div>
          <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10">
            {(['linear', 'phased', 'convex'] as TransducerType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setType(t); setSteeringAngle(0); }}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  type === t ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 h-96 flex flex-col items-center justify-start relative overflow-hidden shadow-inner">
               <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_20px]" />
               
               {/* Transducer Head */}
               <motion.div 
                 layout
                 className={`w-40 h-10 ${current.color} rounded-t-2xl relative z-20 flex justify-center items-center gap-1 px-3 border-t-2 border-white/30 shadow-[0_-4px_15px_rgba(255,255,255,0.1)] mt-8`}
               >
                 {[...Array(12)].map((_, i) => (
                   <motion.div 
                     key={i} 
                     animate={{ opacity: [0.2, 0.5, 0.2] }}
                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                     className="flex-1 h-6 bg-white/20 rounded-sm" 
                   />
                 ))}
               </motion.div>
               
               {/* Beam Visualization */}
               <div className="mt-0 w-full flex justify-center perspective-1000 relative z-10 h-64 overflow-hidden">
                  <motion.div 
                    layout
                    className={`h-64 transition-all duration-700 bg-gradient-to-b from-indigo-500/40 via-indigo-500/10 to-transparent relative shadow-[0_0_30px_rgba(99,102,241,0.3)] origin-top ${
                      type === 'linear' ? 'w-40' : 
                      type === 'phased' ? 'w-4 h-64 scale-x-[20]' : 
                      'w-40 h-64 rounded-b-[100%] scale-x-125'
                    }`}
                    style={{
                      clipPath: type === 'phased' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
                    }}
                    animate={{ 
                      rotate: type === 'phased' || type === 'linear' ? steeringAngle : 0,
                      filter: Math.abs(steeringAngle) > 5 ? 'hue-rotate(30deg)' : 'hue-rotate(0deg)'
                    }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                  >
                    {/* Beam Scan Lines */}
                    {[...Array(12)].map((_, i) => {
                      const baseRotation = type === 'phased' ? (i - 5.5) * 6 : 0;
                      return (
                        <motion.div 
                          key={i} 
                          animate={{ opacity: [0.1, 0.3, 0.1] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                          className="absolute inset-0 border-r border-white/5 h-full" 
                          style={{ 
                            left: `${(i+1) * 7.6}%`, 
                            transform: `rotate(${baseRotation}deg)`, 
                            transformOrigin: 'top' 
                          }} 
                        />
                      );
                    })}
                    
                    {/* Electronic Focus Point */}
                    <motion.div 
                      animate={{ y: [80, 110, 80] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-1/2 -translate-x-1/2 w-full h-px bg-white/60 shadow-[0_0_15px_white] z-20"
                    />
                  </motion.div>
               </div>

               <div className="absolute bottom-8 left-8 right-8 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Electronic Slope Control</span>
                    <span className="text-white font-mono">{steeringAngle}°</span>
                  </div>
                  <input 
                    type="range" min="-30" max="30" step="1"
                    disabled={type === 'convex'}
                    value={steeringAngle}
                    onChange={(e) => setSteeringAngle(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-30"
                  />
                  {type === 'convex' && (
                    <p className="text-[8px] text-center text-slate-600 font-bold uppercase italic">Convex arrays use natural steering due to physical geometry.</p>
                  )}
               </div>
            </div>

            <div className="p-6 bg-amber-500/10 rounded-3xl border border-amber-500/20 flex gap-4">
               <div className="p-3 bg-amber-500 rounded-2xl text-white shrink-0 h-fit shadow-lg shadow-amber-500/20">
                 <Zap size={20} />
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Registry Mastery Hack</h4>
                  <p className="text-xs font-medium text-amber-100/80 leading-relaxed italic">{current.registryTip}</p>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
               <h4 className="text-xl font-black mb-4 tracking-tight">{current.title}</h4>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">{current.description}</p>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Image Shape</span>
                     <span className="text-xs font-bold text-white uppercase">{current.shape}</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Steering</span>
                     <span className="text-xs font-bold text-white uppercase">{current.steering}</span>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/20">
               <div className="flex items-center gap-3 mb-4">
                  <Layers className="text-indigo-200" size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Dynamic Focusing Logic</h4>
               </div>
               <p className="text-xs font-medium text-indigo-100 leading-relaxed">
                 Electronic focusing is achieved by creating curved patterns in the pulse delays. 
                 <span className="block mt-2 font-black italic">Curvature = Focus Depth. Slope = Steering Direction.</span>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
