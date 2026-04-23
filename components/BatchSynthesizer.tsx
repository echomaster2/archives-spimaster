import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Loader2, CheckCircle, AlertCircle, Play, Pause, Database, Rocket, Sparkles, Brain } from 'lucide-react';
import { modules } from '../data/modules';
import { generateLectureScript, generateTTS, generateVisualSummary, generateQuiz, getRegistryPulse } from '../services/geminiService';
import { get, set } from '../services/neuralCache';

const labsList = [
  { id: 'lab-physics', title: 'Acoustic Field Simulator' },
  { id: 'lab-transducer', title: 'Transducer Array Lab' },
  { id: 'lab-doppler', title: 'Spectral Doppler Lab' },
  { id: 'lab-attenuation', title: 'Attenuation Matrix' },
  { id: 'lab-intensity', title: 'Intensity & Bioeffects' },
  { id: 'lab-memory', title: 'Digital Memory Lab' },
  { id: 'lab-media', title: 'Media Interaction' },
  { id: 'lab-bioeffects', title: 'Bioeffects Simulator' },
  { id: 'lab-beamforming', title: 'Beam Forming Lab' },
  { id: 'lab-colordoppler', title: 'Color Doppler Physics' },
  { id: 'lab-harmonics', title: 'Harmonic Imaging' },
  { id: 'lab-artifact-physics', title: 'Artifact Physics' },
  { id: 'lab-doppler-eq', title: 'Doppler Equation' },
  { id: 'lab-decibel', title: 'Decibel Math Lab' },
  { id: 'lab-nyquist', title: 'Nyquist Limit Lab' },
  { id: 'lab-range-res', title: 'Range Resolution' },
  { id: 'lab-temporal-res', title: 'Temporal Resolution' },
  { id: 'lab-pulse', title: 'Pulsed Wave Dynamics' },
  { id: 'lab-resolution', title: 'Resolution Lab' },
  { id: 'lab-artifact', title: 'Artifact Sandbox' },
  { id: 'lab-hemo', title: 'Hemodynamics Lab' },
  { id: 'lab-instrument', title: 'Instrumentation Lab' },
  { id: 'lab-safety', title: 'Bioeffects & Safety' },
  { id: 'lab-math', title: 'Mathematics Hub' },
  { id: 'lab-advanced', title: 'Advanced Imaging' }
];

interface SynthesisStatus {
  lessonId: string;
  title: string;
  status: 'idle' | 'scripting' | 'synthesizing' | 'visualizing' | 'quizzing' | 'pulsing' | 'completed' | 'error';
  error?: string;
}

export const BatchSynthesizer: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statuses, setStatuses] = useState<SynthesisStatus[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [storageEstimate, setStorageEstimate] = useState<{ usage: number, quota: number } | null>(null);

  const updateStorageEstimate = useCallback(async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      setStorageEstimate({
        usage: estimate.usage || 0,
        quota: estimate.quota || 0
      });
    }
  }, []);

  useEffect(() => {
    updateStorageEstimate();
    const lessons = modules.flatMap(m => m.lessons.map(l => ({ id: l.id, title: l.title })));
    const all = [...lessons, ...labsList];
    setTotalLessons(all.length);
    setStatuses(all.map(l => ({
      lessonId: l.id,
      title: l.title,
      status: 'idle'
    })));
  }, []);

  const hashString = async (str: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const startBatchSynthesis = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setCurrentProgress(0);

    const lessons = modules.flatMap(m => m.lessons.map(l => ({ id: l.id, title: l.title })));
    const all = [...lessons, ...labsList];
    const concurrencyPool = 3;
    const queue = [...all];
    let itemsCompleted = 0;

    const processItemInQueue = async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (!item) break;

        const cacheKey = `item_${item.id}`;
        
        try {
          // 1. Check if script exists
          setStatuses(prev => prev.map(s => s.lessonId === item.id ? { ...s, status: 'scripting' } : s));
          
          let script: string;
          const cachedItem = await get(cacheKey);
          
          if (cachedItem && cachedItem.script) {
            script = cachedItem.script;
          } else {
            script = await generateLectureScript(item.title);
          }

          // 2. Check if audio exists
          setStatuses(prev => prev.map(s => s.lessonId === item.id ? { ...s, status: 'synthesizing' } : s));
          
          const cleanText = script.replace(/\[BLOCK_\d+\]/g, '').trim();
          const audioCacheKey = `tts_v2_Harvey_${await hashString(cleanText)}`;
          const cachedAudio = await get(audioCacheKey);

          if (!cachedAudio) {
            await generateTTS(script, 'Harvey');
          }

          // 3. Check if visual exists
          setStatuses(prev => prev.map(s => s.lessonId === item.id ? { ...s, status: 'visualizing' } : s));
          const visualCacheKey = `visual_v1_${await hashString(item.title)}`;
          const cachedVisual = await get(visualCacheKey);
          if (!cachedVisual) {
            await generateVisualSummary(item.title);
          }

          // 4. Check if quiz exists
          setStatuses(prev => prev.map(s => s.lessonId === item.id ? { ...s, status: 'quizzing' } : s));
          const quizCacheKey = `quiz_v1_${await hashString(item.title)}`;
          const cachedQuiz = await get(quizCacheKey);
          if (!cachedQuiz) {
            await generateQuiz(item.title);
          }

          // 5. Check if pulse exists
          setStatuses(prev => prev.map(s => s.lessonId === item.id ? { ...s, status: 'pulsing' } : s));
          const pulseCacheKey = `pulse_v1_${await hashString(item.title)}`;
          const cachedPulse = await get(pulseCacheKey);
          if (!cachedPulse) {
            await getRegistryPulse(item.title);
          }

          setStatuses(prev => prev.map(s => s.lessonId === item.id ? { ...s, status: 'completed' } : s));
          updateStorageEstimate();
        } catch (error) {
          console.error(`Error synthesizing ${item.title}:`, error);
          setStatuses(prev => prev.map(s => s.lessonId === item.id ? { ...s, status: 'error', error: String(error) } : s));
        }

        itemsCompleted++;
        setCurrentProgress(itemsCompleted);
        // Small delay to prevent hitting rate limits too aggressively
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };

    // Run workers in parallel
    const workers = Array.from({ length: concurrencyPool }, () => processItemInQueue());
    await Promise.all(workers);

    setIsProcessing(false);
  };

  const completedCount = statuses.filter(s => s.status === 'completed').length;
  const errorCount = statuses.filter(s => s.status === 'error').length;
  const progressPercent = totalLessons > 0 ? (currentProgress / totalLessons) * 100 : 0;

  return (
    <div className="space-y-8 p-8 bg-slate-900/50 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Brain size={200} />
      </div>

      <div className="relative z-10 flex flex-col gap-8 md:gap-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-indigo-500/20 rounded-xl">
                <Sparkles className="text-indigo-400" size={24} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Neural Forge</h2>
            </div>
            <p className="text-slate-400 text-sm font-medium">Pre-generate all lecture scripts and audio narrations for offline mastery.</p>
          </div>

          <div className="flex items-center gap-4">
            {storageEstimate && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Local Archive Health</span>
                  <div className="flex items-center gap-4">
                    <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${(storageEstimate.usage / storageEstimate.quota) * 100}%` }} 
                      />
                    </div>
                    <span className="text-[10px] font-black text-white">
                      {(storageEstimate.usage / (1024 * 1024)).toFixed(1)}MB / {(storageEstimate.quota / (1024 * 1024 * 1024)).toFixed(1)}GB
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={startBatchSynthesis}
              disabled={isProcessing}
              className={`px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all flex items-center gap-3 shadow-2xl ${
                isProcessing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Rocket size={18} />
                  Initialize Full Archive
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4 mb-12">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="micro-label text-indigo-400">System Progress</span>
              <div className="text-4xl font-black text-white tracking-tighter italic">
                {Math.round(progressPercent)}%
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className="micro-label text-slate-500">Status Report</span>
              <div className="text-sm font-bold text-slate-300">
                {completedCount} / {totalLessons} Lessons Synced
              </div>
            </div>
          </div>
          <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
          {statuses.map((status) => (
            <div 
              key={status.lessonId}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                status.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20' :
                status.status === 'error' ? 'bg-rose-500/10 border-rose-500/20' :
                status.status !== 'idle' ? 'bg-indigo-500/10 border-indigo-500/20 animate-pulse' :
                'bg-white/5 border-white/10 opacity-50'
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{status.lessonId}</span>
                <span className="text-xs font-bold text-white truncate max-w-[150px]">{status.title}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {status.status === 'completed' && <CheckCircle className="text-emerald-400" size={16} />}
                {status.status === 'error' && <AlertCircle className="text-rose-400" size={16} />}
                {(status.status === 'scripting' || status.status === 'synthesizing' || status.status === 'visualizing' || status.status === 'quizzing' || status.status === 'pulsing') && <Loader2 className="animate-spin text-indigo-400" size={16} />}
                {status.status === 'idle' && <Database className="text-slate-600" size={16} />}
              </div>
            </div>
          ))}
        </div>

        {errorCount > 0 && (
          <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3">
            <AlertCircle className="text-rose-400" size={20} />
            <p className="text-xs font-bold text-rose-200">
              {errorCount} neural links failed to stabilize. System will retry on next initialization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
