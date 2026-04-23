
import React, { useState, useMemo } from 'react';
import { Target, Ruler, Zap, ShieldCheck, Info, Sparkles, MoveDown, Layers, Box, Crosshair } from 'lucide-react';

type TestType = 'axial' | 'lateral' | 'dead-zone' | 'registration';

export const QAPhantomLab: React.FC = () => {
  const [activeTest, setActiveTest] = useState<TestType>('axial');
  const [frequency, setFrequency] = useState(5); // MHz

  const testData = useMemo(() => {
    switch (activeTest) {
      case 'axial':
        return {
          title: "Axial Resolution Test",
          description: "Pins are spaced vertically. Tests the minimum distance structures can be separated parallel to the beam.",
          formula: "SPL / 2",
          metric: `${(0.77 * 3 / frequency).toFixed(2)} mm`,
          unit: "Resolution Limit"
        };
      case 'lateral':
        return {
          title: "Lateral Resolution Test",
          description: "Pins are spaced horizontally. Tests resolution perpendicular to the beam. Best at the focus.",
          formula: "Beam Diameter",
          metric: "Variable",
          unit: "Focus Dependent"
        };
      case 'dead-zone':
        return {
          title: "Dead Zone Test",
          description: "Pins located very close to the transducer face. Tests the 'blind spot' caused by pulse duration.",
          formula: "Shallowest Pin Visualized",
          metric: `${(frequency > 10 ? 1 : 5)} mm`,
          unit: "Min Depth"
        };
      case 'registration':
        return {
          title: "Registration Accuracy",
          description: "Tests the machine's ability to place echoes at correct depths and positions.",
          formula: "Vertical vs Horizontal Distance",
          metric: "99%",
          unit: "Calibr. Accuracy"
        };
    }
  }, [activeTest, frequency]);

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <ShieldCheck size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Box className="text-emerald-400" size={24} />
              <h3 className="font-black text-2xl uppercase tracking-widest italic">QA Phantom Lab</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Tissue-Mimicking Calibration Simulator</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">{testData.unit}</span>
              <span className="text-xl font-black text-emerald-400">{testData.metric}</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Standard Speed</span>
              <span className="text-xl font-black text-indigo-400">1540 m/s</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {/* Visual Phantom Simulation */}
            <div className="bg-slate-800 rounded-[2.5rem] h-80 relative overflow-hidden border-4 border-slate-700 shadow-inner flex items-center justify-center p-8 group">
              {/* Phantom Block */}
              <div className="w-64 h-64 bg-slate-900 rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                 
                 {/* Test-Specific Pins */}
                 {activeTest === 'axial' && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse" style={{ opacity: 1 - (i * 0.15) }}></div>
                      ))}
                      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 h-40 w-px bg-indigo-500/20"></div>
                   </div>
                 )}

                 {activeTest === 'lateral' && (
                   <div className="absolute inset-0 flex items-center justify-center gap-8">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse"></div>
                      ))}
                      <div className="absolute top-1/2 left-0 w-full h-px bg-emerald-500/20"></div>
                   </div>
                 )}

                 {activeTest === 'dead-zone' && (
                   <div className="absolute inset-0">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" style={{ top: `${(i + 1) * 8}px`, left: `${40 + i * 15}%` }}></div>
                      ))}
                      <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
                   </div>
                 )}

                 {activeTest === 'registration' && (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-4 grid-rows-4 gap-12">
                         {[...Array(16)].map((_, i) => (
                           <div key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                         ))}
                      </div>
                      <Crosshair size={40} className="absolute text-indigo-500/30 animate-spin-slow" />
                   </div>
                 )}
              </div>

              <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                Mode: {testData.title}
              </div>
              
              <div className="absolute bottom-4 right-6 text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                Tissue-Mimicking Material (1540m/s)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {(['axial', 'lateral', 'dead-zone', 'registration'] as TestType[]).map((t) => (
                 <button 
                  key={t}
                  onClick={() => setActiveTest(t)}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    activeTest === t ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                  }`}
                 >
                   {t.replace('-', ' ')}
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] border border-indigo-500/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Ruler size={20} />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">{testData.title}</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">
                 {testData.description}
               </p>
               <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Registry Formula</span>
                  <span className="text-sm font-black text-white italic">{testData.formula}</span>
               </div>
            </div>

            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" /> Transducer Frequency (f)
                  </label>
                  <span className="text-xs font-black text-indigo-400">{frequency} MHz</span>
               </div>
               <input 
                  type="range" min="2" max="15" step="1"
                  value={frequency}
                  onChange={(e) => setFrequency(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <p className="text-[9px] text-slate-500 font-bold leading-relaxed italic">
                  Higher frequency reduces pulse length, which improves axial resolution and SHRINKS the dead zone.
                </p>
            </div>

            <div className="p-6 bg-slate-800 rounded-[2rem] border border-white/5 flex gap-4 items-center">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Sparkles size={24} className="text-amber-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Registry Note</h5>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  "Phantoms must mimic <span className="text-white">attenuation</span> and <span className="text-white">speed</span> of soft tissue. Standard test objects do NOT mimic attenuation."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
