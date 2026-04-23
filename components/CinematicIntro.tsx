
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { X, Loader2, Sparkles, Film, Zap, SkipForward, Play } from 'lucide-react';

interface CinematicIntroProps {
  title: string;
  type: 'module' | 'lesson' | 'tool';
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ title, type, onComplete }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Initializing Neural Synthesis...");
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
      if (selected) {
        generateIntro();
      }
    };
    checkKey();
  }, [title]);

  const handleSelectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
    generateIntro();
  };

  const generateIntro = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `A cinematic 9:16 vertical intro video for a ${type} titled "${title}". 
        Visuals: Futuristic medical technology, glowing ultrasonic waves, holographic transducer arrays, 
        and high-tech scanning interfaces. Cinematic lighting, deep blue and indigo tones, 
        hyper-realistic medical physics aesthetic. Fast-paced and high production value.`;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '9:16'
        }
      });

      const statuses = [
        `Assembling ${type} Heuristics...`,
        `Synthesizing "${title}" Visuals...`,
        "Calibrating Acoustic Shaders...",
        "Finalizing Neural Render..."
      ];
      let i = 0;

      while (!operation.done) {
        setStatus(statuses[i % statuses.length]);
        i++;
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
      } else {
        throw new Error("Intro synthesis failed.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key Error. Please re-select a paid key.");
      } else {
        setError("Neural connection timed out. Proceeding to manual mode.");
        setTimeout(onComplete, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[200] flex items-center justify-center animate-in fade-in duration-500 overflow-hidden">
      <div className="relative w-full max-w-[450px] aspect-[9/16] bg-black shadow-4xl sm:rounded-[3rem] overflow-hidden flex flex-col border border-white/10">
        
        {/* Skip Controls */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
           <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{type} Intro Synthesis</span>
           </div>
           <button 
             onClick={onComplete}
             className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white transition-all group"
           >
              <span className="text-[10px] font-black uppercase tracking-widest">Skip</span>
              <SkipForward size={14} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

        {!hasKey && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-4xl rotate-12">
               <Film size={40} className="text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Cinematic Entry <br/> Required</h2>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Initialize the cinematic intro for <strong>{title}</strong>. This requires a paid Gemini API key.
              </p>
            </div>
            <button 
              onClick={handleSelectKey}
              className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              <Zap size={18}/> Select API Key
            </button>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-12">
            <div className="relative">
              <div className="w-32 h-32 border-[10px] border-white/5 border-t-indigo-500 rounded-full animate-spin shadow-3xl" />
              <Sparkles className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-black text-xl uppercase italic tracking-widest animate-pulse">{status}</h3>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Building high-fidelity sequence</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
             <p className="text-rose-400 font-bold italic text-sm">{error}</p>
             <button onClick={onComplete} className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white">Manual Bypass</button>
          </div>
        )}

        {videoUrl && !loading && (
          <div className="flex-1 flex flex-col bg-black animate-in fade-in zoom-in-110 duration-1000 relative">
             <video 
               src={videoUrl} 
               autoPlay 
               playsInline 
               onEnded={onComplete}
               className="w-full h-full object-cover"
             />
             <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">{type} sequence</h4>
                   <h2 className="text-5xl font-black text-white italic tracking-tighter leading-none uppercase">{title}</h2>
                   <button 
                    onClick={onComplete}
                    className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-4xl hover:scale-105 active:scale-95 transition-all mt-8 flex items-center justify-center gap-3"
                   >
                     Begin Sequence <Play size={16} fill="currentColor" />
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
