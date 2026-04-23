
import React, { useState, useMemo } from 'react';
import { Target, Zap, Activity, Info, Sparkles, Image as ImageIcon, CheckCircle2, XCircle, AlertCircle, HelpCircle, MessageSquare } from 'lucide-react';
import { NeuralPreceptor } from './NeuralPreceptor';

interface Scenario {
  id: number;
  title: string;
  problem: string;
  imageAlt: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  physicsConcept: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "The Cystic Mystery",
    problem: "While imaging a simple liver cyst, you notice low-level internal echoes that look like debris, but they disappear when you move the transducer. What is the likely physics cause?",
    imageAlt: "Cyst with internal echoes",
    options: [
      "True sediment (sludge)",
      "Slice thickness artifact",
      "Reverberation",
      "Mirror image"
    ],
    correctIdx: 1,
    explanation: "Slice thickness artifact occurs when the beam width is thicker than the structure, causing echoes from adjacent tissue to 'bleed' into the anechoic cyst.",
    physicsConcept: "Elevational Resolution"
  },
  {
    id: 2,
    title: "Vascular Ghosting",
    problem: "You are performing a carotid Doppler and see color 'bleeding' outside the vessel walls onto the surrounding tissue. Which adjustment should you make first?",
    imageAlt: "Color Doppler bleeding",
    options: [
      "Increase Color Gain",
      "Decrease PRF (Scale)",
      "Increase Wall Filter",
      "Change Doppler Angle"
    ],
    correctIdx: 2,
    explanation: "Ghosting or clutter artifacts are caused by low-frequency, high-amplitude shifts from vessel wall motion. Increasing the high-pass Wall Filter removes these signals.",
    physicsConcept: "Wall Filtering"
  },
  {
    id: 3,
    title: "The Vanishing Flow",
    problem: "You are scanning a renal artery and see high-velocity flow on the spectral trace, but the color box is empty. The color gain is already at 70%. What is the most likely issue?",
    imageAlt: "Spectral flow but no color",
    options: [
      "The velocity is too high for color",
      "The incident angle is 90 degrees",
      "The Wall Filter is too low",
      "The PRF is too high"
    ],
    correctIdx: 1,
    explanation: "If the beam is perpendicular (90°) to flow, the Doppler shift is zero (cos 90 = 0). While spectral might pick up some shift due to beam divergence, the color box will often appear anechoic.",
    physicsConcept: "Doppler Equation & Angle"
  },
  {
    id: 4,
    title: "Aliasing Ambiguity",
    problem: "A spectral Doppler trace of the SMA shows the peak velocity 'wrapping around' from the top to the bottom of the display. Which of the following will RESOLVE this?",
    imageAlt: "Spectral aliasing",
    options: [
      "Decrease the PRF",
      "Increase the transducer frequency",
      "Shift the baseline downward",
      "Decrease the sample volume size"
    ],
    correctIdx: 2,
    explanation: "To fix aliasing, you can: 1. Increase PRF (Scale), 2. Use a lower frequency transducer, 3. Decrease the depth, or 4. Shift the baseline. Decreasing PRF would make it worse.",
    physicsConcept: "Nyquist Limit"
  },
  {
    id: 5,
    title: "The Speed Error Step-off",
    problem: "A patient with a large fatty mass (lipoma) in the abdominal wall is scanned. The underlying peritoneal line appears displaced deeper than the rest of the line. Why?",
    imageAlt: "Fatty mass with displaced line",
    options: [
      "Fat has a high attenuation coefficient",
      "Sound travels slower in fat than 1,540 m/s",
      "Refraction at the fat-muscle interface",
      "The lipoma is pushing the line back"
    ],
    correctIdx: 1,
    explanation: "Sound travels at ~1,450 m/s in fat. The machine assumes 1,540 m/s, so it takes 'longer' for the echo to return, making the machine think the structure is deeper than it actually is.",
    physicsConcept: "Propagation Speed Error"
  },
  {
    id: 6,
    title: "Axial Ambiguity",
    problem: "You are trying to measure the thickness of a vessel wall, but the front and back surfaces appear blurred into one thick line. Which change improves this?",
    imageAlt: "Blurred vessel wall",
    options: [
      "Move the focal zone to the wall",
      "Use a higher frequency transducer",
      "Decrease the output power",
      "Increase the dynamic range"
    ],
    correctIdx: 1,
    explanation: "Axial resolution is improved by shorter Spatial Pulse Length (SPL). Higher frequency transducers produce shorter wavelengths and pulses, improving the ability to distinguish structures along the beam's axis.",
    physicsConcept: "Axial Resolution"
  }
];

export const ClinicalScenarioLab: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isPreceptorOpen, setIsPreceptorOpen] = useState(false);

  const scenario = SCENARIOS[currentIdx];

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setCurrentIdx((currentIdx + 1) % SCENARIOS.length);
  };

  return (
    <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl animate-in fade-in duration-700 overflow-hidden relative border border-white/5">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none hidden md:block">
        <ImageIcon size={200} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Target size={20} className="text-amber-400 md:w-6 md:h-6" />
              <h3 className="font-black text-lg md:text-2xl uppercase tracking-widest italic">Clinical Scenario Lab</h3>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Image Interpretation & Logic Test</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPreceptorOpen(true)}
              className="px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-3"
            >
              <MessageSquare size={16} /> Consult Harvey
            </button>
            <div className="bg-white/5 px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/10 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 w-fit">
             <AlertCircle size={12} className="md:w-3.5 md:h-3.5"/> Challenge {currentIdx + 1} of {SCENARIOS.length}
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="space-y-6 md:space-y-8">
            <div className="bg-black rounded-[1.5rem] md:rounded-[2.5rem] aspect-video relative overflow-hidden border-4 border-slate-700 shadow-inner group flex items-center justify-center">
               <div className="text-center p-8 md:p-12 space-y-4">
                  <ImageIcon size={32} className="text-slate-700 mx-auto md:w-12 md:h-12" />
                  <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Simulated Diagnostic View</p>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Image: {scenario.imageAlt}
                  </p>
               </div>
               
               <div className="absolute top-4 left-6 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 text-[7px] md:text-[8px] font-black uppercase text-amber-500">
                  Registry Case File
               </div>
            </div>

            <div className="bg-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10">
               <div className="flex gap-3 md:gap-4 items-start mb-6">
                  <div className="p-2 md:p-2.5 bg-amber-600 rounded-lg md:rounded-xl text-white shadow-lg shrink-0">
                    <HelpCircle size={18} className="md:w-5 md:h-5" />
                  </div>
                  <h4 className="text-sm md:text-lg font-black tracking-tight leading-snug">{scenario.problem}</h4>
               </div>
               
               <div className="grid gap-2.5 md:gap-3">
                  {scenario.options.map((opt, i) => (
                    <button 
                      key={i}
                      disabled={showResult}
                      onClick={() => setSelected(i)}
                      className={`w-full p-4 md:p-5 rounded-xl md:rounded-2xl text-left text-[10px] md:text-xs font-black transition-all border-2 flex items-center justify-between ${
                        selected === i 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg scale-[1.01]' 
                          : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <span>{opt}</span>
                      {selected === i && <Zap size={12} className="animate-pulse" />}
                    </button>
                  ))}
               </div>

               {!showResult && selected !== null && (
                 <button 
                  onClick={() => setShowResult(true)}
                  className="w-full mt-6 py-4 bg-white text-slate-900 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all"
                 >
                   Verify Physics Logic
                 </button>
               )}
            </div>
          </div>

          <div className="space-y-6 lg:min-h-[400px]">
             {showResult ? (
                <div className="animate-in slide-in-from-right duration-500 space-y-6">
                   <div className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-4 ${selected === scenario.correctIdx ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-rose-900/20 border-rose-500/30'}`}>
                      <div className="flex items-center gap-3 md:gap-4 mb-6">
                         {selected === scenario.correctIdx ? (
                           <div className="p-2 md:p-3 bg-emerald-600 rounded-xl md:rounded-2xl text-white shadow-lg animate-bounce">
                              <CheckCircle2 size={20} className="md:w-6 md:h-6" />
                           </div>
                         ) : (
                           <div className="p-2 md:p-3 bg-rose-600 rounded-xl md:rounded-2xl text-white shadow-lg">
                              <XCircle size={20} className="md:w-6 md:h-6" />
                           </div>
                         )}
                         <div>
                            <h4 className="text-lg md:text-xl font-black tracking-tight">
                               {selected === scenario.correctIdx ? 'Concept Mastered!' : 'Incorrect Logic'}
                            </h4>
                            <p className="text-[8px] md:text-[10px] font-black uppercase text-slate-500">Knowledge Domain: {scenario.physicsConcept}</p>
                         </div>
                      </div>
                      
                      <p className="text-xs md:text-sm font-medium text-slate-300 leading-relaxed italic mb-8">
                         {scenario.explanation}
                      </p>

                      <button 
                        onClick={handleNext}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-500"
                      >
                        Next Case Scenario
                      </button>
                   </div>

                   <div className="p-6 md:p-8 bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 flex gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-indigo-600/20 rounded-xl md:rounded-2xl shrink-0 h-fit">
                        <Sparkles size={20} className="text-indigo-400 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Registry Flash-Point</h5>
                        <p className="text-[10px] md:text-xs font-bold text-slate-400 italic">
                          Artifacts are the #1 way examiners test your understanding of "Normal" vs "Broken" physics assumptions.
                        </p>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 md:p-12 text-center opacity-30 border-2 border-dashed border-white/10 rounded-[2rem] md:rounded-[3rem]">
                   <Activity size={48} className="mb-4 md:mb-6 md:w-16 md:h-16" />
                   <h4 className="text-base md:text-lg font-black uppercase tracking-widest italic">Awaiting Analysis</h4>
                   <p className="text-[10px] md:text-xs font-medium max-w-xs mx-auto mt-2 md:mt-4">Select an answer to reveal the physics breakdown and registry insights.</p>
                </div>
             )}
          </div>
        </div>
      </div>
      
      <NeuralPreceptor 
        isOpen={isPreceptorOpen} 
        onClose={() => setIsPreceptorOpen(false)}
        context={JSON.stringify({
          labId: 'clinical-scenario',
          topic: `Clinical Case: ${scenario.title}`,
          problem: scenario.problem,
          physicsConcept: scenario.physicsConcept,
          correctExplanation: scenario.explanation
        })}
      />
    </div>
  );
};
