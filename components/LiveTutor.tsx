
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { X, Mic, MicOff, Volume2, Bot, Loader2, Sparkles, Activity, ChevronRight, ChevronLeft } from 'lucide-react';
import { BOT_PERSONAS, BotPersona } from '../data/personas';

interface LiveTutorProps {
  lessonTitle: string;
  onClose: () => void;
}

export const LiveTutor: React.FC<LiveTutorProps> = ({ lessonTitle, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [currentModelText, setCurrentModelText] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<BotPersona>(BOT_PERSONAS[0]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const connectLive = async () => {
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'models/gemini-3.1-flash-live-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedPersona.voice as any || 'Zephyr' } } },
          systemInstruction: selectedPersona.systemInstruction + ` Focus session on ${lessonTitle}. Be encouraging but technically precise. Keep responses under 30 seconds.`,
          outputAudioTranscription: {},
          inputAudioTranscription: {}
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setLoading(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const input = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(input.length);
              for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ 
                audio: { 
                  data: encode(new Uint8Array(int16.buffer)), 
                  mimeType: 'audio/pcm;rate=16000' 
                } 
              })).catch(err => console.error("Failed to send audio input:", err));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.outputTranscription) {
              setCurrentModelText(prev => prev + msg.serverContent!.outputTranscription!.text);
            }
            if (msg.serverContent?.turnComplete) {
              setTranscription(prev => [...prev, `${selectedPersona.name.toUpperCase()}: ` + currentModelText]);
              setCurrentModelText("");
            }
            
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsActive(false),
          onerror: (e) => {
            console.error("Live error", e);
            setIsActive(false);
          }
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const stopLive = () => {
    sessionRef.current?.then((s: any) => s.close());
    streamRef.current?.getTracks().forEach(t => t.stop());
    setIsActive(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
      <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-4xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[700px]">
        
        {/* Sidebar: Persona Selection */}
        <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Select Streamer</h3>
            {!isActive && <Sparkles size={16} className="text-indigo-600 animate-pulse" />}
          </div>
          
          <div className="space-y-4 flex-1">
            {BOT_PERSONAS.map((p) => (
              <button
                key={p.id}
                disabled={isActive}
                onClick={() => setSelectedPersona(p)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all group relative overflow-hidden ${
                  selectedPersona.id === p.id 
                    ? `bg-gradient-to-br ${p.color} text-white border-transparent shadow-xl ring-4 ring-indigo-500/10` 
                    : 'bg-white border-slate-100 hover:border-indigo-500/50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-2 rounded-xl ${selectedPersona.id === p.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                    <p.icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-[11px] uppercase tracking-wider">{p.name}</h4>
                    <p className={`text-[9px] font-bold ${selectedPersona.id === p.id ? 'text-white/70' : 'text-slate-400'} uppercase tracking-tighter`}>{p.specialization}</p>
                  </div>
                </div>
                {isActive && selectedPersona.id !== p.id && (
                  <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] cursor-not-allowed" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-[10px] font-bold text-indigo-900/60 uppercase tracking-widest leading-relaxed italic">
              "Live streams use low-latency neural processing. Speak clearly to engage with the AI expert."
            </p>
          </div>
        </div>

        {/* Main: Interaction Zone */}
        <div className="flex-1 flex flex-col relative bg-white p-8 md:p-12">
          <button onClick={() => { stopLive(); onClose(); }} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all z-20 border border-slate-50 bg-white/80">
            <X size={20} />
          </button>

          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="relative mb-8 md:mb-12">
              <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full bg-slate-50 border-8 border-white shadow-inner flex items-center justify-center transition-all duration-700 ${isActive ? 'scale-105 md:scale-110 shadow-[0_0_60px_rgba(99,102,241,0.3)] border-indigo-50' : ''}`}>
                <div className={`p-6 md:p-8 rounded-full transition-all duration-500 shadow-2xl ${isActive ? `bg-gradient-to-br ${selectedPersona.color} text-white animate-pulse` : 'bg-slate-200 text-slate-400'}`}>
                  <selectedPersona.icon size={40} className="md:w-14 md:h-14" />
                </div>
              </div>
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-full rounded-full border-[6px] md:border-[10px] border-indigo-400/20 animate-ping"></div>
                </div>
              )}
            </div>

            <div className="mb-6 md:mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                 <Sparkles size={16} className="text-indigo-600"/>
                 <h3 className={`text-2xl md:text-3xl font-black tracking-tight leading-none italic uppercase bg-clip-text text-transparent bg-gradient-to-br ${selectedPersona.color}`}>
                   {selectedPersona.name}
                 </h3>
              </div>
              {!isActive ? (
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  {selectedPersona.intro}
                </p>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-emerald-700 font-black uppercase tracking-widest text-[8px] md:text-[9px]">Live Stream Active</p>
                </div>
              )}
            </div>

            <div className="w-full h-48 md:h-64 overflow-y-auto mb-8 bg-slate-50 rounded-[2.5rem] p-6 md:p-8 text-left border border-slate-100 shadow-inner scrollbar-hide">
              {transcription.length === 0 && !isActive && (
                <div className="flex flex-col items-center justify-center h-full opacity-30">
                   <Activity size={24} className="mb-4 text-slate-400" />
                   <p className="text-[10px] font-bold text-slate-500 text-center italic max-w-xs uppercase tracking-widest">Awaiting Audio Handshake...</p>
                </div>
              )}
              <div className="space-y-4">
                {transcription.map((t, i) => (
                  <div key={i} className="animate-in slide-in-from-bottom-2 duration-300">
                    <p className={`text-[10px] md:text-xs font-black leading-relaxed p-4 rounded-2xl border shadow-sm ${t.startsWith(selectedPersona.name.toUpperCase()) ? 'bg-white text-indigo-900 border-indigo-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {t}
                    </p>
                  </div>
                ))}
                {currentModelText && (
                  <div className="animate-pulse">
                    <p className="text-[10px] md:text-xs font-black text-indigo-600 italic px-4 px-6">{selectedPersona.name}: {currentModelText}...</p>
                  </div>
                )}
              </div>
            </div>

            {!isActive ? (
              <button 
                onClick={connectLive} 
                disabled={loading}
                className="w-full md:w-auto px-12 md:px-20 py-4 md:py-6 bg-slate-950 text-white rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 group"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Mic size={20} className="group-hover:rotate-12 transition-transform" />}
                <span>{loading ? 'Initializing Stream...' : 'Start Live Interaction'}</span>
              </button>
            ) : (
              <button 
                onClick={stopLive}
                className="w-full md:w-auto px-12 md:px-20 py-4 md:py-6 bg-rose-500 text-white rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs shadow-2xl shadow-rose-200 hover:bg-rose-600 transition-all flex items-center justify-center gap-4 animate-in zoom-in duration-300"
              >
                <MicOff size={20} />
                <span>Disconnect Stream</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
