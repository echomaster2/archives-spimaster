import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Info, AlertTriangle, ChevronRight } from 'lucide-react';

const artifacts = [
  {
    id: 'reverberation',
    name: 'Reverberation',
    physics: 'Sound bounces back and forth between two strong reflectors.',
    appearance: 'Multiple, equally spaced echoes at increasing depths.',
    assumptions_broken: 'Sound travels directly to a reflector and back.',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'comet-tail',
    name: 'Comet Tail',
    physics: 'A form of reverberation with very closely spaced reflectors.',
    appearance: 'Solid white line directed downward.',
    assumptions_broken: 'Sound travels directly to a reflector and back.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'shadowing',
    name: 'Shadowing',
    physics: 'High attenuation in a structure above.',
    appearance: 'Anechoic or hypoechoic region extending downward.',
    assumptions_broken: 'Intensity of a reflection is related to the tissue properties.',
    color: 'from-slate-700 to-slate-900'
  },
  {
    id: 'enhancement',
    name: 'Enhancement',
    physics: 'Low attenuation in a structure above (weak attenuator).',
    appearance: 'Hyperechoic region extending downward.',
    assumptions_broken: 'Intensity of a reflection is related to the tissue properties.',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'mirror-image',
    name: 'Mirror Image',
    physics: 'Sound reflects off a strong curved reflector (like diaphragm).',
    appearance: 'Second copy of a true reflector, deeper than the original.',
    assumptions_broken: 'Sound travels in a straight line.',
    color: 'from-purple-500 to-pink-500'
  }
];

export const ArtifactPhysicsLab: React.FC = () => {
  const [selectedArtifact, setSelectedArtifact] = useState(artifacts[0]);

  return (
    <div className="space-y-8 p-6 bg-slate-900/50 rounded-3xl border border-white/10">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-indigo-500/20 rounded-2xl">
          <Sparkles className="text-indigo-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Artifact Physics Lab</h2>
          <p className="text-slate-400 text-sm">Deconstruct the physics behind common imaging errors.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {artifacts.map((artifact) => (
            <button
              key={artifact.id}
              onClick={() => setSelectedArtifact(artifact)}
              className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between group ${
                selectedArtifact.id === artifact.id 
                ? 'bg-white text-black shadow-xl scale-[1.02]' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <span className="font-black uppercase tracking-tighter">{artifact.name}</span>
              <ChevronRight size={16} className={selectedArtifact.id === artifact.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} />
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <motion.div
            key={selectedArtifact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tech-card p-8 rounded-[2.5rem] relative overflow-hidden h-full"
          >
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedArtifact.color} opacity-10 blur-[80px]`} />
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{selectedArtifact.name}</h3>
                <div className="h-1 w-20 bg-indigo-500 rounded-full" />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="text-indigo-400" size={16} />
                      <h4 className="micro-label">Physics Mechanism</h4>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedArtifact.physics}</p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="text-emerald-400" size={16} />
                      <h4 className="micro-label">Visual Appearance</h4>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedArtifact.appearance}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-rose-500/10 rounded-3xl border border-rose-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="text-rose-400" size={16} />
                      <h4 className="micro-label text-rose-400">Assumption Broken</h4>
                    </div>
                    <p className="text-rose-100/80 text-sm leading-relaxed font-medium italic">"{selectedArtifact.assumptions_broken}"</p>
                  </div>

                  <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="text-indigo-400" size={16} />
                      <h4 className="micro-label">Registry Tip</h4>
                    </div>
                    <p className="text-indigo-100/80 text-xs leading-relaxed">
                      {selectedArtifact.id === 'reverberation' && "Look for 'ladder-like' appearance. It's caused by sound ping-ponging between two strong reflectors."}
                      {selectedArtifact.id === 'comet-tail' && "Often seen with small metallic objects or gas bubbles. It's a subset of reverberation."}
                      {selectedArtifact.id === 'shadowing' && "Shadowing is unrelated to the speed of sound in the medium; it's purely about attenuation."}
                      {selectedArtifact.id === 'enhancement' && "The opposite of shadowing. It proves the structure above is a weak attenuator."}
                      {selectedArtifact.id === 'mirror-image' && "The mirror is always the strong reflector. The artifact is always deeper than the real structure."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-black/40 rounded-[2rem] border border-white/5 flex items-center justify-center min-h-[200px]">
                <div className="relative w-full max-w-md h-32 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center">
                  {selectedArtifact.id === 'reverberation' && (
                    <div className="space-y-2">
                      {[1, 0.8, 0.6, 0.4, 0.2].map((op, i) => (
                        <motion.div 
                          key={i}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="h-1 w-48 bg-white rounded-full"
                          style={{ opacity: op }}
                        />
                      ))}
                    </div>
                  )}
                  {selectedArtifact.id === 'comet-tail' && (
                    <div className="w-1 h-24 bg-gradient-to-b from-white to-transparent rounded-full blur-[1px]" />
                  )}
                  {selectedArtifact.id === 'shadowing' && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 bg-slate-400 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                      <div className="w-12 h-24 bg-black/60 blur-md rounded-b-full" />
                    </div>
                  )}
                  {selectedArtifact.id === 'enhancement' && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 bg-blue-400/30 border border-blue-300 rounded-full" />
                      <div className="w-12 h-24 bg-white/20 blur-md rounded-b-full" />
                    </div>
                  )}
                  {selectedArtifact.id === 'mirror-image' && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute top-1/2 w-full h-0.5 bg-indigo-500/50 rotate-[-10deg]" />
                      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-emerald-500 rounded-full blur-[2px]" />
                      <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-emerald-500/30 rounded-full blur-[4px]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

import { Activity } from 'lucide-react';
