
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Brain, Loader2, User, Bot, X, Mic, MicOff, ChevronDown } from 'lucide-react';
import { askTutor } from '../services/geminiService';
import { ChatMessage } from '../types';
import { BOT_PERSONAS, BotPersona } from '../data/personas';

interface AIChatProps {
  lessonTitle: string;
  lectureScript: string;
  onClose: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ lessonTitle, lectureScript, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<BotPersona>(BOT_PERSONAS[0]);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInput(transcript);
        }
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const distilledSummary = lectureScript
        .replace(/\[BLOCK_\d\]/g, '')
        .substring(0, 1500);

      const contextString = `You are acting as: ${selectedPersona.name}.
      Specialization: ${selectedPersona.specialization}.
      Style: ${selectedPersona.style}.
      ${selectedPersona.systemInstruction}
      The student is actively learning: "${lessonTitle}". 
      Current Masterclass Summary: ${distilledSummary}. 
      Task: Provide concise, high-authority technical guidance suitable for ARDMS SPI registry preparation.
      Constraint: Do not use the following symbols in your output: *, #, %, &, !, @.`;

      const response = await askTutor(userMsg, contextString);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that resonance." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Acoustic communication failure. Please retry." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl z-[60] flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-500">
      <div className="p-4 md:p-6 border-b bg-slate-950 text-white flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-gradient-to-br ${selectedPersona.color} rounded-xl shadow-lg`}>
             <selectedPersona.icon className="w-5 h-5 text-white" />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2 group text-left"
            >
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest leading-none italic">{selectedPersona.name}</h3>
                <p className="text-[8px] text-indigo-400 uppercase tracking-[0.2em] font-black mt-1">Status: Online</p>
              </div>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${showPersonaMenu ? 'rotate-180' : ''}`} />
            </button>

            {showPersonaMenu && (
              <div className="absolute top-12 left-0 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-4xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-white/5">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Switch Expert</span>
                </div>
                {BOT_PERSONAS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPersona(p); setShowPersonaMenu(false); }}
                    className={`w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors text-left ${selectedPersona.id === p.id ? 'bg-white/10' : ''}`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${p.color}`}>
                      <p.icon size={14} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-wider">{p.name}</h4>
                      <p className="text-[7px] text-slate-400 uppercase font-bold tracking-tighter">{p.specialization}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={20} /></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-[#FDFDFF] scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-20 px-8">
            <div className={`w-20 h-20 bg-gradient-to-br ${selectedPersona.color} rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse`}>
              <selectedPersona.icon className="w-10 h-10 text-white" />
            </div>
            <p className="text-slate-900 font-black text-xl tracking-tight leading-tight uppercase italic">{selectedPersona.name} Protocol</p>
            <p className="text-slate-400 text-xs mt-4 leading-relaxed font-medium uppercase tracking-widest">
              {selectedPersona.intro}
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-4 md:p-6 rounded-[1.8rem] flex gap-3 md:gap-4 shadow-sm ${
              m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
              <div className="flex-shrink-0 pt-1">
                {m.role === 'user' ? <User size={14} /> : <selectedPersona.icon size={14} className="text-indigo-600" />}
              </div>
              <p className="text-[11px] md:text-sm leading-relaxed whitespace-pre-wrap font-bold italic">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 md:p-6 rounded-[1.8rem] shadow-sm border border-slate-100 flex items-center gap-4">
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              <span className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest italic">{selectedPersona.name} is processing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="flex gap-3">
          <button 
            onClick={toggleVoiceInput}
            className={`p-4 rounded-2xl transition-all shadow-sm ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {isListening ? <MicOff size={24}/> : <Mic size={24}/>}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : `Ask ${selectedPersona.name}...`}
            className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-4 text-[10px] md:text-sm font-black focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300 italic"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-4 bg-slate-950 text-white rounded-2xl hover:bg-indigo-600 disabled:opacity-50 transition-all shadow-xl"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
