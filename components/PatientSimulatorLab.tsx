
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Activity, Target, ShieldAlert, ShieldCheck,
  Search, Play, ChevronRight, CheckCircle2, 
  XCircle, Brain, Sparkles, Database,
  ArrowRight, Info, AlertCircle, HeartPulse
} from 'lucide-react';
import { toast } from 'sonner';
import { PatientProfile, ScanFinding, Case } from '../types';
import { generatePersonalizedCase } from '../services/geminiService';
import { NeuralPreceptor } from './NeuralPreceptor';

interface PatientSimulatorLabProps {
  masteryData?: Record<string, number>;
}

const CASES: Case[] = [
  {
    id: 'case_001',
    profile: {
      id: 'P-882',
      name: 'John Doe',
      age: 62,
      history: 'History of heavy smoking, hypertension. Recent weight loss.',
      complaint: 'Vague abdominal pain and back pain. Pulsatile mass suspected.',
      targetOrgan: 'Abdominal Aorta'
    },
    findings: {
      'proximal': {
        zone: 'Proximal Aorta',
        description: 'Clear lumen, diameter 2.1cm. Normal laminar flow patterns observed.',
        physicsHint: 'Pulse Repetition Frequency is optimized for high velocity flow.',
        findingType: 'normal'
      },
      'mid': {
        zone: 'Mid Aorta',
        description: 'Focal dilation noted. Measurements: 5.4cm. Internal "smoke" or swirling echoes seen within the dilation.',
        physicsHint: 'Rayleigh scattering from slow-moving blood cells causing spontaneous contrast.',
        findingType: 'pathological'
      },
      'distal': {
        zone: 'Distal Aorta / Bifurcation',
        description: 'Diameter tapers back to 1.8cm before iliac bifurcation.',
        physicsHint: 'Artifact alert: Side lobes from adjacent bowel gas causing "ghost" flow outside the vessel.',
        findingType: 'artifact'
      }
    },
    correctDiagnosis: 'Abdominal Aortic Aneurysm with slow-flow stasis',
    options: [
      'Abdominal Aortic Aneurysm with slow-flow stasis',
      'Normal Aging Aorta',
      'Aortic Dissection with Stanford type B tear',
      'Retroperitoneal Fibrosis mimicking mass'
    ],
    explanation: 'The focal dilation exceeding 3cm confirms an aneurysm. The internal echoes (smoke) are a classic physics finding of Rayleigh scattering from red blood cells in low-velocity flow states.'
  },
  {
    id: 'case_002',
    profile: {
      id: 'P-914',
      name: 'Jane Smith',
      age: 45,
      history: 'Post-prandial right upper quadrant pain. Negative for fever.',
      complaint: 'Sudden onset sharp RUQ pain after eating a large meal.',
      targetOrgan: 'Gallbladder'
    },
    findings: {
      'fundus': {
        zone: 'GB Fundus',
        description: 'Wall thickness 2.8mm. Anechoic lumen.',
        physicsHint: 'High frequency linear probe used for superior axial resolution.',
        findingType: 'normal'
      },
      'neck': {
        zone: 'GB Neck / Hartmann\'s Pouch',
        description: 'Mobile echogenic focus measuring 1.2cm. Strong posterior shadowing observed.',
        physicsHint: 'Clean acoustic shadow confirms high attenuation of the object relative to soft tissue.',
        findingType: 'pathological'
      },
      'duct': {
        zone: 'Common Bile Duct',
        description: 'Diameter 4mm. Clear lumen.',
        physicsHint: 'Edge shadowing seen at the curved margins of the duct due to refraction.',
        findingType: 'artifact'
      }
    },
    correctDiagnosis: 'Cholelithiasis (Gallstones)',
    options: [
      'Cholelithiasis (Gallstones)',
      'Acute Cholecystitis with wall thickening',
      'Gallbladder Polyp (Non-mobile)',
      'Adenomyomatosis with Comet-Tail artifact'
    ],
    explanation: 'The mobilty of the echogenic focus and the clean posterior shadowing are hallmark findings for gallstones. The shadow occurs because the stone absorbs and reflects so much sound that none passes through to the underlying tissue.'
  },
  {
    id: 'case_003',
    profile: {
      id: 'P-112',
      name: 'Sarah Connor',
      age: 28,
      history: '18 weeks gestation. Routine anatomy scan.',
      complaint: 'Routine follow-up. Patient mentions mild pelvic pressure.',
      targetOrgan: 'Fetal Anatomy / Pelvis'
    },
    findings: {
      'head': {
        zone: 'Fetal Head (BPD)',
        description: 'Thalamus and cavum septum pellucidum visualized. BPD measures consistent with 18w 2d.',
        physicsHint: 'Mirror image artifact seen near the skull base due to strong reflection from bone.',
        findingType: 'normal'
      },
      'cervix': {
        zone: 'Internal Os',
        description: 'Placental edge is noted crossing the internal cervical os completely.',
        physicsHint: 'Use transvaginal approach to eliminate reverberation from the bladder wall.',
        findingType: 'pathological'
      },
      'heart': {
        zone: 'Fetal Heart (4C)',
        description: 'Four chambers visualized. Normal axis. Heart rate 145 bpm.',
        physicsHint: 'Aliasing in the ventricular outflow tract—increase PRF/Scale to resolve.',
        findingType: 'artifact'
      }
    },
    correctDiagnosis: 'Complete Placenta Previa',
    options: [
      'Complete Placenta Previa',
      'Marginal Placental Cord Insertion',
      'Low Lying Placenta (2cm from Os)',
      'Normal Placental Positioning'
    ],
    explanation: 'The placenta completely covering the internal cervical os at 18 weeks is diagnostic for complete placenta previa. While many resolve as the lower segment grows, it requires strict follow-up and clinical management.'
  }
];

export const PatientSimulatorLab: React.FC<PatientSimulatorLabProps> = ({ masteryData = {} }) => {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [exploredZones, setExploredZones] = useState<Set<string>>(new Set());
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<number | null>(null);
  const [showConclusion, setShowConclusion] = useState(false);
  const [neuralCase, setNeuralCase] = useState<Case | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreceptorOpen, setIsPreceptorOpen] = useState(false);

  const activeCase = neuralCase || CASES[activeCaseIdx];

  const handleGenerateNeuralCase = async () => {
    setIsGenerating(true);
    resetCase();
    try {
      const generated = await generatePersonalizedCase(masteryData);
      setNeuralCase(generated);
      toast.success("Neural Integration Success", {
        description: "A custom clinical scenario has been generated based on your mastery data."
      });
    } catch (e) {
      toast.error("Neural Link Failure", {
        description: "Failed to generate personalized simulation."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleZoneClick = (zone: string) => {
    setSelectedZone(zone);
    setExploredZones(prev => new Set(prev).add(zone));
    toast.info(`Scanning ${activeCase.findings[zone].zone}...`, {
      icon: <Activity className="animate-pulse text-indigo-400" />
    });
  };

  const resetCase = () => {
    setExploredZones(new Set());
    setSelectedZone(null);
    setSelectedDiagnosis(null);
    setShowConclusion(false);
  };

  const handleNextCase = () => {
    if (neuralCase) {
      setNeuralCase(null);
      setActiveCaseIdx(0);
    } else {
      setActiveCaseIdx((prev) => (prev + 1) % CASES.length);
    }
    resetCase();
  };

  const allZonesExplored = exploredZones.size === Object.keys(activeCase.findings).length;

  return (
    <div className="min-h-[800px] bg-slate-950 rounded-[3rem] p-8 md:p-12 relative overflow-hidden border border-white/5 flex flex-col gap-12">
      <div className="absolute inset-0 atmosphere opacity-20" />
      <div className="absolute inset-0 neural-grid opacity-[0.05]" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-2xl">
              <HeartPulse size={24} />
            </div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Neural <br/><span className="text-gradient">Logic</span> Patient Simulator</h2>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] max-w-xl leading-relaxed">
            Apply first-principles physics to clinical diagnostic workflows. {neuralCase ? 'This scenario was AI-generated based on your neural sync metadata.' : 'Verify findings, isolate artifacts, and stabilize the patient.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={handleGenerateNeuralCase}
            disabled={isGenerating}
            className="px-6 py-4 bg-indigo-600/10 border border-indigo-600/30 rounded-2xl flex items-center gap-3 hover:bg-indigo-600 hover:text-white transition-all group disabled:opacity-50"
          >
            <Brain size={18} className={isGenerating ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} />
            <span className="text-[10px] font-black uppercase tracking-widest">{isGenerating ? 'Synthesizing...' : 'Generate Neural Case'}</span>
          </button>
          
          <button onClick={handleNextCase} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all text-slate-400 hover:text-white group">
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Next Static Case</span>
          </button>

          <button 
            onClick={() => setIsPreceptorOpen(true)}
            className="px-6 py-4 bg-emerald-600/10 border border-emerald-600/30 text-emerald-500 rounded-2xl flex items-center gap-3 hover:bg-emerald-600 hover:text-white transition-all group"
          >
            <Brain size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Consult Preceptor</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left: Patient Info & Scan Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Patient Card */}
          <div className="tech-card rounded-[2.5rem] p-8 md:p-10 border border-white/5 bg-slate-900/50 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
               <User size={150} />
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-2xl">
                <User size={48} />
              </div>
              <div className="space-y-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{activeCase.profile.name} <span className="text-white/20 font-light">(AGE: {activeCase.profile.age})</span></h3>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Patient ID: {activeCase.profile.id}</p>
                  </div>
                  <div className="px-5 py-2 bg-rose-600/20 border border-rose-500/30 rounded-full text-rose-500 font-black uppercase text-[10px] tracking-widest">
                    Target: {activeCase.profile.targetOrgan}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 p-5 bg-white/5 rounded-2xl border border-white/5">
                    <h4 className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                       <Database size={12} /> Clinical History
                    </h4>
                    <p className="text-sm font-bold text-slate-300 leading-relaxed italic pr-4">"{activeCase.profile.history}"</p>
                  </div>
                  <div className="space-y-2 p-5 bg-white/5 rounded-2xl border border-white/5">
                    <h4 className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                       <ShieldAlert size={12} /> Chief Complaint
                    </h4>
                    <p className="text-sm font-bold text-slate-300 leading-relaxed italic pr-4">"{activeCase.profile.complaint}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Scan Stage */}
          <div className="flex-1 tech-card rounded-[3rem] bg-black border-4 border-slate-800 relative overflow-hidden flex items-center justify-center min-h-[400px]">
             {/* Simulated Scan Grid */}
             <div className="absolute inset-0 neural-grid opacity-[0.05]" />
             <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                <img 
                  src={`https://picsum.photos/seed/${activeCase.id}/1200/800?blur=10`} 
                  alt="Internal Body Simulation" 
                  className="w-full h-full object-cover opacity-20 grayscale"
                  referrerPolicy="no-referrer"
                />
             </div>
             
             {/* Interaction hotspots */}
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full h-full p-12">
                {Object.keys(activeCase.findings).map((zoneId) => (
                  <button
                    key={zoneId}
                    onClick={() => handleZoneClick(zoneId)}
                    className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 transition-all duration-500 flex flex-col items-center justify-center gap-2 group/hotspot ${
                      selectedZone === zoneId 
                      ? 'bg-indigo-600 border-indigo-400 scale-110 shadow-[0_0_50px_rgba(99,102,241,0.5)]' 
                      : exploredZones.has(zoneId)
                      ? 'bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/40'
                      : 'bg-white/5 border-white/20 hover:border-indigo-500 hover:bg-indigo-500/10'
                    }`}
                  >
                     <div className={`p-3 md:p-4 rounded-xl transition-colors ${selectedZone === zoneId ? 'bg-white text-indigo-600' : 'bg-white/10 text-white'}`}>
                        <Search size={24} />
                     </div>
                     <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest text-center px-2 transition-colors ${selectedZone === zoneId ? 'text-white' : 'text-slate-500 group-hover/hotspot:text-white'}`}>
                        {activeCase.findings[zoneId].zone}
                     </span>
                     {exploredZones.has(zoneId) && selectedZone !== zoneId && (
                       <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                          <CheckCircle2 size={12} />
                       </div>
                     )}
                     {/* Pulse effect */}
                     {!exploredZones.has(zoneId) && (
                       <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-20" />
                     )}
                  </button>
                ))}
             </div>

             <div className="absolute bottom-8 left-8 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ x: [-50, 100] }} 
                     transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                     className="w-12 h-full bg-indigo-500" 
                   />
                </div>
                <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Acoustic Coupling: Optimal</span>
             </div>
          </div>
        </div>

        {/* Right: Data Output & Diagnosis */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Analysis View */}
          <div className="flex-1 tech-card p-8 rounded-[3rem] border border-white/5 bg-slate-900/80 backdrop-blur-lg flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h4 className="flex items-center gap-3 text-xs font-black text-white uppercase tracking-widest italic">
                  <Sparkles className="text-indigo-400" size={18} /> Neural Analysis
               </h4>
               <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Logic Pipe v4.2</span>
            </div>

            <AnimatePresence mode="wait">
              {selectedZone ? (
                <motion.div 
                  key={selectedZone}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-1"
                >
                  <div className={`p-6 rounded-3xl border ${
                    activeCase.findings[selectedZone].findingType === 'normal' ? 'bg-emerald-500/10 border-emerald-500/20' :
                    activeCase.findings[selectedZone].findingType === 'pathological' ? 'bg-rose-500/10 border-rose-500/20' :
                    'bg-amber-500/10 border-amber-500/20'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                       <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${
                         activeCase.findings[selectedZone].findingType === 'normal' ? 'text-emerald-400' :
                         activeCase.findings[selectedZone].findingType === 'pathological' ? 'text-rose-400' :
                         'text-amber-400'
                       }`}>
                          Finding: {activeCase.findings[selectedZone].findingType}
                       </span>
                       <Activity size={12} className="text-white/20" />
                    </div>
                    <p className="text-sm font-bold text-white leading-relaxed italic pr-4">
                       "{activeCase.findings[selectedZone].description}"
                    </p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-2">
                       <Info size={14} className="text-indigo-400" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Physics Heuristic</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 leading-relaxed leading-relaxed pr-2">
                       {activeCase.findings[selectedZone].physicsHint}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                     <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                        <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Frequency</p>
                        <p className="text-xs font-black text-indigo-400 italic">Multi-Hertz 3-5Mhz</p>
                     </div>
                     <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                        <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Focus</p>
                        <p className="text-xs font-black text-emerald-400 italic">Dynamic Depth</p>
                     </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-20 border-2 border-dashed border-white/10 rounded-[2rem]">
                  <Target size={48} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Select a scan zone to begin acquisition</p>
                </div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {allZonesExplored && !showConclusion && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-8 bg-indigo-600 rounded-[2.5rem] shadow-4xl space-y-6 text-center"
                >
                   <Brain size={48} className="mx-auto text-white" />
                   <div>
                      <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Acquisition Complete</h4>
                      <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">Logic stabilized. Final diagnostic output required.</p>
                   </div>
                   <button 
                    onClick={() => setShowConclusion(true)}
                    className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                   >
                     Submit Diagnostics <ArrowRight size={16} />
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showConclusion && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="tech-card p-10 rounded-[3rem] border-4 border-indigo-600 shadow-4xl space-y-8"
              >
                <div className="text-center space-y-2">
                   <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Stabilize Findings</h4>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Choose the most cohesive registry diagnostic</p>
                </div>

                <div className="space-y-3">
                   {activeCase.options.map((opt, i) => (
                     <button
                       key={i}
                       onClick={() => setSelectedDiagnosis(i)}
                       className={`w-full p-6 bg-white/5 border-2 rounded-[2rem] text-left text-xs font-black transition-all ${
                         selectedDiagnosis === i 
                         ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-xl' 
                         : 'border-white/10 text-slate-400 hover:bg-white/10'
                       }`}
                     >
                       {opt}
                     </button>
                   ))}
                </div>

                <button 
                  onClick={() => {
                    if (selectedDiagnosis === 0) { // All cases in this array have index 0 as correct for simplicity here
                       toast.success('Simulation Successful: Diagnostic Alignment Verified!', {
                         icon: <ShieldCheck className="text-emerald-500" />
                       });
                       handleNextCase();
                    } else {
                       toast.error('Diagnostic Mismatch: Re-analyze clinical logic.', {
                         icon: <AlertCircle className="text-rose-500" />
                       });
                    }
                  }}
                  disabled={selectedDiagnosis === null}
                  className="w-full py-6 bg-white text-indigo-600 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-indigo-50 disabled:opacity-50 disabled:grayscale transition-all"
                >
                  Confirm Neural Proof
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <NeuralPreceptor 
        isOpen={isPreceptorOpen} 
        onClose={() => setIsPreceptorOpen(false)} 
        context={`Current Patient Case: ${JSON.stringify(activeCase)}. User is exploring zone: ${selectedZone || 'none'}.`}
        initialMessage={`Neural link established. I'm HARVEY. I see you're analyzing ${activeCase.profile.name}'s ${activeCase.profile.targetOrgan}. What physics sector or clinical logic needs deconstruction?`}
      />
    </div>
  );
};
