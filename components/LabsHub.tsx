
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Activity, Radio, Target, Layers, 
  Maximize2, Calculator, ArrowRight, Sparkles, Stethoscope,
  Search, Filter, Play, Info, Database, ShieldCheck, Clock, Volume2, Trophy, TrendingUp
} from 'lucide-react';
import { PhysicsLab } from './PhysicsLab';
import { TransducerLab } from './TransducerLab';
import { PulsedWaveLab } from './PulsedWaveLab';
import { DopplerLab } from './DopplerLab';
import { ArtifactExplorer } from './ArtifactExplorer';
import { ResolutionLab } from './ResolutionLab';
import { SafetyLab } from './SafetyLab';
import { HemodynamicsLab } from './HemodynamicsLab';
import { InstrumentationLab } from './InstrumentationLab';
import { MathematicsLab } from './MathematicsLab';
import { AttenuationLab } from './AttenuationLab';
import { IntensityLab } from './IntensityLab';
import { DigitalMemoryLab } from './DigitalMemoryLab';
import { MediaInteractionLab } from './MediaInteractionLab';
import { BioeffectsLab } from './BioeffectsLab';
import { BeamFormingLab } from './BeamFormingLab';
import { ColorDopplerLab } from './ColorDopplerLab';
import { HarmonicsLab } from './HarmonicsLab';
import { ArtifactPhysicsLab } from './ArtifactPhysicsLab';
import { DopplerEquationLab } from './DopplerEquationLab';
import { ArtifactGauntlet } from './ArtifactGauntlet';
import { DecibelMathLab } from './DecibelMathLab';
import { PatientSimulatorLab } from './PatientSimulatorLab';
import { NyquistLimitLab } from './NyquistLimitLab';
import { RangeResolutionLab } from './RangeResolutionLab';
import { TemporalResolutionLab } from './TemporalResolutionLab';
import { AdvancedImagingLab } from './AdvancedImagingLab';
import { PhysicsCalculator } from './PhysicsCalculator';
import { DopplerAudioSimulator } from './DopplerAudioSimulator';
import { ArtifactSandbox } from './ArtifactSandbox';
import { MockRegistryExam } from './MockRegistryExam';
import { MasteryRadar } from './MasteryRadar';
import { FlashcardSystem } from './FlashcardSystem';
import { RegistryHotTopics } from './RegistryHotTopics';

import { VirtualClinicalRotation } from './VirtualClinicalRotation';
import { ClinicalScenarioLab } from './ClinicalScenarioLab';

const labs = [
  { id: 'clinical-rotation', title: 'Clinical Rotation', icon: Stethoscope, component: VirtualClinicalRotation, category: 'Clinical', description: 'High-pressure clinical shifts. Handle multiple patients, optimize physics, and stabilize diagnostics.' },
  { id: 'clinical-scenario', title: 'Clinical Scenario Lab', icon: Target, component: ClinicalScenarioLab, category: 'Clinical', description: 'Solve real-world clinical physics challenges with image interpretation logic.' },
  { id: 'patient-sim', title: 'Virtual Patient Hub', icon: Activity, component: PatientSimulatorLab, category: 'Clinical', description: 'Simulate full clinical workflows: Acquisition, Logic, and Diagnosis.' },
  { id: 'physics', title: 'Acoustic Field Simulator', icon: Activity, component: PhysicsLab, category: 'Physics', description: 'Visualize wave parameters, frequency, and amplitude in soft tissue.' },
  { id: 'transducer', title: 'Transducer Array Lab', icon: Radio, component: TransducerLab, category: 'Hardware', description: 'Explore linear, phased, and convex arrays with real-time beam steering.' },
  { id: 'doppler', title: 'Spectral Doppler Lab', icon: Zap, component: DopplerLab, category: 'Doppler', description: 'Master the Doppler equation, angle correction, and Nyquist limits.' },
  { id: 'doppler-audio', title: 'Doppler Audio Sim', icon: Volume2, component: DopplerAudioSimulator, category: 'Doppler', description: 'Hear the shift. Manipulate velocity and hear the pitch change in real-time.' },
  { id: 'attenuation', title: 'Attenuation Matrix', icon: Layers, component: AttenuationLab, category: 'Physics', description: 'Study absorption, reflection, and scattering across different media.' },
  { id: 'intensity', title: 'Intensity & Bioeffects', icon: Activity, component: IntensityLab, category: 'Safety', description: 'Analyze SPTA, SPTP, and other intensity parameters for safety.' },
  { id: 'memory', title: 'Digital Memory Lab', icon: Database, component: DigitalMemoryLab, category: 'Hardware', description: 'Explore bit depth, pixel density, and contrast resolution.' },
  { id: 'media', title: 'Media Interaction', icon: Target, component: MediaInteractionLab, category: 'Physics', description: 'Visualize reflection, refraction, and Snell\'s Law in action.' },
  { id: 'bioeffects', title: 'Bioeffects Simulator', icon: ShieldCheck, component: BioeffectsLab, category: 'Safety', description: 'Analyze TI and MI indices and their relation to ultrasound safety.' },
  { id: 'beamforming', title: 'Beam Forming Lab', icon: Layers, component: BeamFormingLab, category: 'Hardware', description: 'Explore apodization, dynamic aperture, and focusing techniques.' },
  { id: 'colordoppler', title: 'Color Doppler Physics', icon: Zap, component: ColorDopplerLab, category: 'Doppler', description: 'Master color maps, velocity scales, and aliasing in color flow.' },
  { id: 'harmonics', title: 'Harmonic Imaging', icon: Sparkles, component: HarmonicsLab, category: 'Imaging', description: 'Visualize non-linear propagation and tissue harmonic imaging.' },
  { id: 'artifact-sandbox', title: 'Artifact Sandbox', icon: Sparkles, component: ArtifactSandbox, category: 'Imaging', description: 'Intentionally create and resolve artifacts by manipulating PRF and depth.' },
  { id: 'artifact-physics', title: 'Artifact Physics', icon: Sparkles, component: ArtifactPhysicsLab, category: 'Imaging', description: 'Deep dive into the physics behind reverberation, comet tail, and more.' },
  { id: 'mock-exam', title: 'Mock Registry Exam', icon: Trophy, component: MockRegistryExam, category: 'Challenges', description: 'Full timed simulation. High-stakes neuro-retention test for SPI mastery.' },
  { id: 'registry-pulse', title: 'Registry Trend Pulse', icon: TrendingUp, component: RegistryHotTopics, category: 'Tools', description: 'Live tracking of high-yield topics and emerging registry focus areas.' },
  { id: 'mastery-radar', title: 'Neural Mastery Radar', icon: Activity, component: MasteryRadar, category: 'Tools', description: 'Visual heatmap of your physics strengths and concept-level gaps.' },
  { id: 'flashcards', title: 'Neural Flashcards', icon: Zap, component: FlashcardSystem, category: 'Tools', description: 'Spaced repetition deck for rapid-fire terminology and formula mastery.' },
  { id: 'doppler-eq', title: 'Doppler Equation', icon: Zap, component: DopplerEquationLab, category: 'Doppler', description: 'Interactive breakdown of the Doppler equation and its variables.' },
  { id: 'decibel', title: 'Decibel Math Lab', icon: Calculator, component: DecibelMathLab, category: 'Basics', description: 'Master the logarithmic scale of decibels for intensity and power.' },
  { id: 'nyquist', title: 'Nyquist Limit Lab', icon: Activity, component: NyquistLimitLab, category: 'Doppler', description: 'Visualize aliasing and how PRF affects the Nyquist limit.' },
  { id: 'range-res', title: 'Range Resolution', icon: Target, component: RangeResolutionLab, category: 'Imaging', description: 'Explore axial resolution and the impact of pulse duration.' },
  { id: 'temporal-res', title: 'Temporal Resolution', icon: Clock, component: TemporalResolutionLab, category: 'Imaging', description: 'Analyze frame rate, depth, and sector width tradeoffs.' },
  { id: 'pulse', title: 'Pulsed Wave Dynamics', icon: Maximize2, component: PulsedWaveLab, category: 'Physics', description: 'Analyze SPL, PD, and the 13 microsecond rule for depth.' },
  { id: 'resolution', title: 'Resolution Lab', icon: Target, component: ResolutionLab, category: 'Imaging', description: 'Compare axial, lateral, and elevational resolution tradeoffs.' },
  { id: 'artifact-explorer', title: 'Artifact Explorer', icon: Sparkles, component: ArtifactExplorer, category: 'Imaging', description: 'Identify and resolve common ultrasound artifacts in real-time.' },
  { id: 'hemo', title: 'Hemodynamics Lab', icon: Activity, component: HemodynamicsLab, category: 'Doppler', description: 'Visualize laminar vs. turbulent flow and Bernoulli principles.' },
  { id: 'instrument', title: 'Instrumentation Lab', icon: Calculator, component: InstrumentationLab, category: 'Hardware', description: 'Master the receiver chain: amplification, compensation, and more.' },
  { id: 'safety', title: 'Bioeffects & Safety', icon: Info, component: SafetyLab, category: 'Safety', description: 'Understand Thermal and Mechanical Indices (TI/MI) and ALARA.' },
  { id: 'math', title: 'Mathematics Hub', icon: Calculator, component: MathematicsLab, category: 'Basics', description: 'Practice metric conversions, logarithms, and scientific notation.' },
  { id: 'gauntlet', title: 'The Artifact Gauntlet', icon: ShieldCheck, component: ArtifactGauntlet, category: 'Challenges', description: 'Master knobology in this high-stakes image clean-up challenge.' },
  { id: 'advanced', title: 'Advanced Imaging', icon: Sparkles, component: AdvancedImagingLab, category: 'Imaging', description: 'Explore harmonics, contrast agents, and elastography.' },
  { id: 'calculator', title: 'Physics Calculator', icon: Calculator, category: 'Tools', description: 'Solve complex equations for 13us, Snell\'s Law, and Axial Res.' },
  { id: 'radio', title: 'Neural Radio', icon: Radio, category: 'Tools', description: 'Synchronize your neural pathways with SPI Physics beats.' }
];

const categories = ['All', 'Clinical', 'Physics', 'Hardware', 'Doppler', 'Imaging', 'Safety', 'Basics', 'Challenges', 'Tools'];

interface LabsHubProps {
  onOpenRadio?: () => void;
  masteryData: Record<string, number>;
}

export const LabsHub: React.FC<LabsHubProps> = ({ onOpenRadio, masteryData }) => {
  const [activeLabId, setActiveLabId] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLabs = labs.filter(lab => {
    const matchesFilter = filter === 'All' || lab.category === filter;
    const matchesSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lab.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeLab = labs.find(l => l.id === activeLabId);
  const activeLabIdx = labs.findIndex(l => l.id === activeLabId);

  const handleNext = () => {
    const nextIdx = (activeLabIdx + 1) % labs.length;
    setActiveLabId(labs[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (activeLabIdx - 1 + labs.length) % labs.length;
    setActiveLabId(labs[prevIdx].id);
  };

  return (
    <div className="space-y-8 md:space-y-16 animate-in fade-in duration-1000 px-4 md:px-0 max-w-7xl mx-auto pb-40">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-2 md:space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-indigo-600 rounded-xl md:rounded-2xl text-white shadow-xl shadow-indigo-500/20">
              <Activity size={16} className="md:w-6 md:h-6" />
            </div>
            <h2 className="text-2xl md:text-7xl font-black tracking-tighter uppercase italic text-white">Interaction Lab</h2>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[7px] md:text-xs tracking-[0.2em] md:tracking-[0.4em] max-w-xl leading-relaxed">
            A centralized hub for all interactive ultrasound physics simulations and diagnostic tools.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 md:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 md:px-6 py-1.5 md:py-2 rounded-full text-[7px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === cat ? 'bg-white text-black shadow-xl' : 'bg-white/5 text-slate-500 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none text-slate-500">
          <Search size={14} className="md:w-4.5 md:h-4.5" />
        </div>
        <input 
          type="text"
          placeholder="Search for a specific lab or concept..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-[2rem] py-3 md:py-6 pl-10 md:pl-16 pr-6 md:pr-8 text-[9px] md:text-sm text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
        {filteredLabs.map((lab, idx) => (
          <motion.button
            key={lab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => {
              if (lab.id === 'radio' && onOpenRadio) {
                onOpenRadio();
              } else {
                setActiveLabId(lab.id);
              }
            }}
            className="group relative tech-card rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 text-left border-b-4 border-indigo-500/20 hover:scale-[1.02] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 neural-grid opacity-[0.05] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-700">
              <lab.icon size={100} className="md:w-40 md:h-40" />
            </div>
            
            <div className="relative z-10 space-y-6 md:space-y-10">
              <div className="flex items-center justify-between">
                <div className={`p-3 md:p-5 rounded-2xl md:rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xl`}>
                  <lab.icon size={20} className="md:w-8 md:h-8" />
                </div>
                <span className="micro-label opacity-40">{lab.category}</span>
              </div>
              
              <div>
                <h3 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase italic mb-2 md:mb-4 leading-none">{lab.title}</h3>
                <p className="text-[9px] md:text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-[0.2em]">{lab.description}</p>
              </div>

              <div className="flex items-center gap-3 text-indigo-400 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] pt-6 md:pt-8 border-t border-white/5">
                Initialize Simulation <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform duration-500 md:w-4 md:h-4" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeLabId && activeLab && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#05080f]/95 backdrop-blur-3xl flex flex-col"
          >
            {/* Lab Toolbar */}
            <div className="h-16 md:h-20 border-b border-white/5 bg-[#05080f]/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-12 relative z-20">
              <div className="flex items-center gap-6">
                 <button 
                  onClick={() => setActiveLabId(null)}
                  className="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10 hover:text-white transition-all border border-white/10"
                >
                  <ArrowRight size={20} className="rotate-180" />
                </button>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="micro-label !opacity-40">{activeLab.category} Lab</span>
                  <h3 className="text-sm md:text-xl font-black text-white italic uppercase tracking-tighter leading-none">{activeLab.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 mr-4">
                   <button onClick={handlePrev} className="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10 hover:text-white transition-all border border-white/10 flex items-center gap-2">
                     <ArrowRight size={14} className="rotate-180" />
                     <span className="micro-label">Prev</span>
                   </button>
                   <button onClick={handleNext} className="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10 hover:text-white transition-all border border-white/10 flex items-center gap-2">
                     <span className="micro-label">Next</span>
                     <ArrowRight size={14} />
                   </button>
                </div>
                <button 
                  onClick={() => setActiveLabId(null)}
                  className="p-3 md:p-4 bg-rose-500/10 text-rose-500 rounded-xl md:rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 group"
                >
                  <Maximize2 size={20} className="rotate-45 group-hover:rotate-0 transition-transform" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Quick Switch Sidebar (Desktop) */}
              <div className="hidden xl:flex w-80 border-r border-white/5 flex-col bg-black/20">
                <div className="p-8 border-b border-white/5">
                  <h4 className="micro-label mb-2">Internal Index</h4>
                  <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">Quick switch between available cognitive simulations.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                  {labs.filter(l => l.category === activeLab.category || activeLab.category === 'All').map(l => (
                    <button
                      key={l.id}
                      onClick={() => setActiveLabId(l.id)}
                      className={`w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all group ${
                        activeLabId === l.id ? 'bg-white text-black shadow-xl' : 'text-slate-400 hover:bg-white/5 hover:border-white/10 border border-transparent'
                      }`}
                    >
                      <l.icon size={16} className={activeLabId === l.id ? 'text-indigo-600' : 'group-hover:text-white'} />
                      <span className="text-[10px] font-black uppercase tracking-wider truncate">{l.title}</span>
                    </button>
                  ))}
                  <div className="pt-8 pb-4 px-4 opacity-20">
                    <div className="h-px w-full bg-white mb-4" />
                    <span className="micro-label">End of Category</span>
                  </div>
                </div>
              </div>

              {/* Lab Content Stage */}
              <div className="flex-1 overflow-y-auto p-4 md:p-12 relative scrollbar-hide">
                <div className="max-w-6xl mx-auto pb-40">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeLabId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="animate-in zoom-in duration-700"
                    >
                      {activeLab.id === 'clinical-rotation' && <VirtualClinicalRotation />}
                      {activeLab.id === 'clinical-scenario' && <ClinicalScenarioLab />}
                      {activeLab.id === 'patient-sim' && <PatientSimulatorLab masteryData={masteryData} />}
                      {activeLab.id === 'physics' && <PhysicsLab topic="General Physics" hotMicEnabled={false} />}
                      {activeLab.id === 'gauntlet' && <ArtifactGauntlet />}
                      {activeLab.id === 'transducer' && <TransducerLab />}
                      {activeLab.id === 'doppler' && <DopplerLab hotMicEnabled={false} />}
                      {activeLab.id === 'doppler-audio' && <DopplerAudioSimulator />}
                      {activeLab.id === 'artifact-sandbox' && <ArtifactSandbox />}
                      {activeLab.id === 'mock-exam' && <MockRegistryExam />}
                      {activeLab.id === 'registry-pulse' && <RegistryHotTopics />}
                      {activeLab.id === 'mastery-radar' && <MasteryRadar data={masteryData} />}
                      {activeLab.id === 'flashcards' && <FlashcardSystem />}
                      {activeLab.id === 'attenuation' && <AttenuationLab topic="General Attenuation" />}
                      {activeLab.id === 'intensity' && <IntensityLab />}
                      {activeLab.id === 'memory' && <DigitalMemoryLab />}
                      {activeLab.id === 'media' && <MediaInteractionLab />}
                      {activeLab.id === 'bioeffects' && <BioeffectsLab />}
                      {activeLab.id === 'beamforming' && <BeamFormingLab />}
                      {activeLab.id === 'colordoppler' && <ColorDopplerLab />}
                      {activeLab.id === 'harmonics' && <HarmonicsLab />}
                      {activeLab.id === 'artifact-physics' && <ArtifactPhysicsLab />}
                      {activeLab.id === 'doppler-eq' && <DopplerEquationLab />}
                      {activeLab.id === 'decibel' && <DecibelMathLab />}
                      {activeLab.id === 'nyquist' && <NyquistLimitLab />}
                      {activeLab.id === 'range-res' && <RangeResolutionLab />}
                      {activeLab.id === 'temporal-res' && <TemporalResolutionLab />}
                      {activeLab.id === 'pulse' && <PulsedWaveLab />}
                      {activeLab.id === 'resolution' && <ResolutionLab />}
                      {activeLab.id === 'artifact-explorer' && <ArtifactExplorer />}
                      {activeLab.id === 'hemo' && <HemodynamicsLab />}
                      {activeLab.id === 'instrument' && <InstrumentationLab />}
                      {activeLab.id === 'safety' && <SafetyLab />}
                      {activeLab.id === 'math' && <MathematicsLab topic="General Math" />}
                      {activeLab.id === 'advanced' && <AdvancedImagingLab topic="Advanced Concepts" />}
                      {activeLab.id === 'calculator' && <PhysicsCalculator onClose={() => setActiveLabId(null)} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
