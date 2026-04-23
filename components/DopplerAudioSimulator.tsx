
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Activity, Volume2, Target, Info, Zap } from 'lucide-react';

export const DopplerAudioSimulator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [velocity, setVelocity] = useState(0); // -100 to 100
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const baseFrequency = 440; // A4

  const startAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Create Noise Buffer for realistic "whoosh"
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFrequency, now);
    filter.Q.setValueAtTime(5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume * 0.2, now + 0.1);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start();
    
    // Also keep a subtle oscillator for the "pure" tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFrequency, now);
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(volume * 0.05, now + 0.1);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start();

    oscillatorRef.current = osc;
    filterRef.current = filter;
    gainNodeRef.current = gain;
    noiseGainRef.current = oscGain;
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (gainNodeRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.1);
      noiseGainRef.current?.gain.linearRampToValueAtTime(0, now + 0.1);
      
      setTimeout(() => {
        oscillatorRef.current?.stop();
        oscillatorRef.current?.disconnect();
        filterRef.current?.disconnect();
        gainNodeRef.current?.disconnect();
        noiseGainRef.current?.disconnect();
        oscillatorRef.current = null;
        filterRef.current = null;
        gainNodeRef.current = null;
        noiseGainRef.current = null;
      }, 150);
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      const shift = baseFrequency * (1 + velocity / 200);
      
      if (filterRef.current) {
        filterRef.current.frequency.setTargetAtTime(shift, now, 0.05);
        filterRef.current.Q.setTargetAtTime(2 + Math.abs(velocity) / 20, now, 0.05);
      }
      if (oscillatorRef.current) {
        oscillatorRef.current.frequency.setTargetAtTime(shift, now, 0.05);
      }
    }
  }, [velocity]);

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume * 0.1, audioContextRef.current.currentTime, 0.1);
    }
  }, [volume]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const relX = (x / width) * 2 - 1; // -1 to 1
    setVelocity(relX * 100);
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
      
      <div className="relative z-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <div className="flex items-center gap-3">
                <Volume2 className="text-rose-500" size={24} />
                <h3 className="text-2xl font-black uppercase italic tracking-widest">Doppler Audio Simulator</h3>
             </div>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Auditory Representation of Frequency Shift</p>
          </div>
          <button 
            onClick={isPlaying ? stopAudio : startAudio}
            className={`px-8 py-4 rounded-full font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 ${
              isPlaying ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            {isPlaying ? 'Disable Audio' : 'Initialize Audio'}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setVelocity(0)}
              className="bg-black/40 h-64 rounded-[2rem] border-2 border-dashed border-white/10 relative flex items-center justify-center cursor-crosshair group overflow-hidden"
            >
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 group-hover:bg-white/20 transition-colors" />
              
              <motion.div 
                animate={{ 
                  scale: isPlaying ? [1, 1.2, 1] : 1,
                  opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.1
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className={`w-32 h-32 rounded-full blur-[40px] ${velocity > 0 ? 'bg-rose-500' : velocity < 0 ? 'bg-blue-500' : 'bg-indigo-500'}`}
                style={{
                  transform: `translateX(${velocity}% )`
                }}
              />

              <div className="relative z-10 text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Simulated Vessel</p>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-blue-500 uppercase italic">Away</span>
                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500"
                         animate={{ x: `${velocity}%` }}
                       />
                    </div>
                    <span className="text-[10px] font-black text-rose-500 uppercase italic">Toward</span>
                 </div>
              </div>

              {!isPlaying && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-8 text-center">
                  <p className="text-xs font-bold text-slate-300 italic">"Initialize audio to hear the shift. Move your cursor horizontally to change flow direction and velocity."</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Monitor Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-4">
               <div className="flex items-center gap-3">
                  <Target className="text-indigo-400" size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Registry Audio Logic</h4>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
                 Doppler audio is the <span className="text-indigo-400 font-bold">Unprocessed Neural Data</span>. 
                 Higher velocity = Higher Pitch. 
                 Blood moving toward the transducer creates a Positive Shift (Higher Pitch).
               </p>
               <div className="pt-4 grid grid-cols-2 gap-4 border-t border-white/5">
                  <div className="space-y-1">
                     <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Physics Rule</span>
                     <span className="text-[10px] font-bold text-emerald-400 italic">2 * V * f * cos θ / c</span>
                  </div>
                  <div className="space-y-1 text-right">
                     <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Human Range</span>
                     <span className="text-[10px] font-bold text-white tracking-widest italic">20Hz - 20,000Hz</span>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-500/20 flex gap-4 items-start">
               <div className="p-2.5 bg-indigo-600 rounded-xl text-white shrink-0">
                  <Zap size={20} />
               </div>
               <div>
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">MasterClass Insight</h5>
                  <p className="text-xs font-bold text-slate-300 italic leading-relaxed">
                    Spectral analysis (FFT) converts this auditory data into the visual display you see on screen. Audio is the rawest form of truth in Doppler physics.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
