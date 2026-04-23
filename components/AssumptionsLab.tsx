
import React, { useState } from 'react';
import { Layers, Zap, Target, Activity, Info, Sparkles, Filter, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

const ASSUMPTIONS = [
  { 
    id: 1, 
    text: "Sound travels in a straight line.", 
    violation: "Refraction", 
    details: "Sound bends at an interface, causing the machine to misplace a reflector laterally.",
    icon: <ChevronRight size={18} className="text-indigo-400" />
  },
  { 
    id: 2, 
    text: "Sound travels directly to a reflector and back.", 
    violation: "Reverberation / Mirror Image", 
    details: "Bouncing sound creates false images that appear deeper than the true structure.",
    icon: <Zap size={18} className="text-amber-400" />
  },
  { 
    id: 3, 
    text: "Sound travels in soft tissue at exactly 1,540 m/s.", 
    violation: "Speed Error (Step-off)", 
    details: "Mismatching speeds cause reflectors to be placed at the wrong depth.",
    icon: <Activity size={18} className="text-emerald-400" />
  },
  { 
    id: 4, 
    text: "Reflections arise only from structures along the beam's main axis.", 
    violation: "Side Lobes / Grating Lobes", 
    details: "Energy from outside the main beam creates false 'cloudy' anatomy.",
    icon: <Target size={18} className="text-rose-400" />
  },
  { 
    id: 5, 
    text: "The imaging plane is very thin.", 
    violation: "Slice Thickness / Elevation Artifact", 
    details: "Structures above or below the thin beam bleed into the image (e.g. cystic fill-in).",
    icon: <Layers size={18} className="text-cyan-400" />
  },
  { 
    id: 6, 
    text: "The strength of a reflection is related to the characteristics of the tissue.", 
    violation: "Shadowing / Enhancement", 
    details: "Intensity changes due to the path (high/low attenuation) rather than the tissue itself.",
    icon: <Filter size={18} className="text-purple-400" />
  }
];

export const AssumptionsLab: React.FC = () => {
  const [selected, setSelected] = useState(0);

  const current = ASSUMPTIONS[selected];

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <ShieldAlert size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <CheckCircle2 className="text-emerald-400" size={24} />
               <h3 className="font-black text-2xl uppercase tracking-widest italic">Assumption Violation Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">The 6 Laws of Ultrasound Logic</p>
          </div>
          
          <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400">
             Registry Critical Knowledge
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Assumption List */}
          <div className="lg:col-span-5 space-y-3">
             {ASSUMPTIONS.map((a, i) => (
               <button 
                 key={a.id}
                 onClick={() => setSelected(i)}
                 className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${
                   selected === i 
                    ? 'bg-indigo-600 border-indigo-500 shadow-xl' 
                    : 'bg-white/5 border-transparent hover:border-white/10 text-slate-500 hover:text-white'
                 }`}
               >
                  <div className="flex items-center gap-4">
                     <span className={`text-xs font-black transition-colors ${selected === i ? 'text-indigo-200' : 'text-slate-700'}`}>0{a.id}</span>
                     <p className={`text-[10px] font-bold text-left leading-tight transition-colors ${selected === i ? 'text-white' : 'text-slate-400'}`}>
                        {a.text}
                     </p>
                  </div>
                  <ChevronRight size={14} className={`transition-transform ${selected === i ? 'translate-x-0 text-white' : '-translate-x-2 opacity-0 text-slate-600'}`} />
               </button>
             ))}
          </div>

          {/* Visualization / Detail */}
          <div className="lg:col-span-7 space-y-8">
             <div className="bg-white rounded-[2.5rem] p-10 text-slate-900 shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">{current.icon}</div>
                
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4 block">violation result</span>
                <h2 className="text-4xl font-black tracking-tight mb-6">{current.violation}</h2>
                
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10 max-w-md italic">
                   {current.details}
                </p>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-4 items-start">
                   <Info size={20} className="text-indigo-600 shrink-0 mt-1"/>
                   <p className="text-[11px] font-bold text-slate-700 leading-relaxed">
                      Systems are programmed to believe this assumption is <span className="text-indigo-600 font-black">ALWAYS TRUE</span>. When physics breaks the rule, the machine can only display a "false" image (artifact).
                   </p>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-slate-800 rounded-[2.5rem] border border-white/5 flex gap-6 items-center">
           <div className="p-4 bg-amber-500/20 rounded-2xl shadow-inner">
              <Sparkles size={32} className="text-amber-500" />
           </div>
           <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Master Tip: Assumption #3</h5>
              <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
                "The system assumes exactly 1.54 km/s. If the media is <span className="text-white font-bold">FAT (1450m/s)</span>, sound takes LONGER to return, so the machine places the echo <span className="text-white font-bold">TOO DEEP</span>."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
