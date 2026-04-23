
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { X, Play, Loader2, Sparkles, Film, ShieldAlert, ExternalLink, Zap } from 'lucide-react';

interface CinematicCommercialProps {
  onClose: () => void;
}

export const CinematicCommercial: React.FC<CinematicCommercialProps> = ({ onClose }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    const selected = await (window as any).aistudio.hasSelectedApiKey();
    setHasKey(selected);
  };

  const handleSelectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
    // Proceed to generate after key selection is triggered
    generateTrailer();
  };

  const generateTrailer = async () => {
    setLoading(true);
    setError(null);
    setLoadingStatus("Initializing Neural Render...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = "A cinematic, fast-paced high-tech commercial for a sonography physics app. 9:16 aspect ratio. Visuals include glowing blue acoustic waves, holographic transducer arrays, and professional medical lab environments with neon accents. Smooth camera movements, futuristic medical aesthetic, high production quality.";

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
        "Synthesizing Acoustic Waveforms...",
        "Assembling Transducer Logic...",
        "Applying Diagnostic Grade Shaders...",
        "Calibrating Registry Frequency...",
        "Finalizing Cinematic Export..."
      ];
      let statusIdx = 0;

      while (!operation.done) {
        setLoadingStatus(statuses[statusIdx % statuses.length]);
        statusIdx++;
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
      } else {
        throw new Error("Video generation yielded no results.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key verification failed. Please re-select a valid paid key.");
      } else {
        setError("Synthesis interrupted. The physics engine requires more bandwidth.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex items-center justify-center p-0 sm:p-6 animate-in fade-in duration-500 overflow-hidden">
      <div className="relative w-full max-w-[450px] aspect-[9/16] bg-black shadow-2xl sm:rounded-[3rem] overflow-hidden flex flex-col border border-white/5">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full z-50 hover:bg-white/10 transition-all"
        >
          <X size={24}/>
        </button>

        {!hasKey && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-4xl animate-pulse">
               <Film size={48} className="text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Cinematic Unlock</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                To generate the 9:16 Mastery Trailer, you must select a paid API key from a billing-enabled GCP project.
              </p>
            </div>
            <div className="w-full space-y-4">
               <button 
                onClick={handleSelectKey}
                className="w-full py-5 bg-white text-slate-950 rounded-full font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all shadow-2xl flex items-center justify-center gap-3"
               >
                 <Zap size={18}/> Select API Key
               </button>
               <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
               >
                 Learn about billing <ExternalLink size={12}/>
               </a>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-950 relative">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="relative space-y-12">
               <div className="w-32 h-32 border-[12px] border-white/5 border-t-indigo-500 rounded-full animate-spin mx-auto shadow-3xl"></div>
               <div className="space-y-4">
                  <h3 className="text-white font-black text-xl uppercase italic tracking-widest animate-pulse">{loadingStatus}</h3>
                  <div className="max-w-[200px] mx-auto space-y-1">
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 animate-progress-indefinite" />
                     </div>
                     <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Synthesis may take up to 2 minutes</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 gap-4 opacity-40">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">"Logic over Memorization"</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">"High Frequency Accuracy"</p>
               </div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
             <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-500">
                <ShieldAlert size={48} />
             </div>
             <p className="text-white font-bold italic">{error}</p>
             <button 
              onClick={generateTrailer}
              className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-white hover:bg-white/10"
             >
               Retry Synthesis
             </button>
          </div>
        )}

        {videoUrl && !loading && (
          <div className="flex-1 flex flex-col bg-black animate-in fade-in zoom-in-110 duration-1000">
             <video 
               src={videoUrl} 
               autoPlay 
               loop 
               playsInline 
               className="w-full h-full object-cover shadow-inner"
             />
             <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-600 rounded-lg"><Sparkles size={16} className="text-white"/></div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Mastery Engine V3.1</span>
                   </div>
                   <h2 className="text-5xl font-black text-white italic tracking-tighter leading-none uppercase">SPI MASTER <br/> ARCHIVES</h2>
                   <p className="text-sm font-bold text-slate-400 leading-relaxed italic">
                      The most advanced sonography prep interface ever created. Real-time physics, AI mentorship, and high-yield registry grounding.
                   </p>
                   <button 
                    onClick={onClose}
                    className="w-full py-6 bg-indigo-600 pointer-events-auto text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-4xl hover:scale-105 active:scale-95 transition-all mt-8"
                   >
                     Initialize Training
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes progress-indefinite {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-indefinite {
          width: 100%;
          animation: progress-indefinite 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
