
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, Send, X, MessageSquare, 
  Sparkles, Zap, ShieldCheck, 
  ChevronRight, Volume2, User, Activity
} from 'lucide-react';
import { askTutor } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

interface NeuralPreceptorProps {
  context?: string;
  onClose: () => void;
  isOpen: boolean;
  initialMessage?: string;
}

export const NeuralPreceptor: React.FC<NeuralPreceptorProps> = ({ 
  context, 
  onClose, 
  isOpen, 
  initialMessage 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'initial',
        role: 'ai',
        text: initialMessage || "Neural link established. I am HARVEY, your clinical preceptor. What complex physics sector shall we deconstruct today?",
        timestamp: Date.now()
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await askTutor(inputText, context);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-0 right-0 h-screen w-full md:w-[450px] bg-slate-950 border-l border-white/10 z-[1000] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="p-8 bg-indigo-600 flex items-center justify-between relative overflow-hidden">
             <div className="absolute inset-0 neural-grid opacity-20" />
             <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                   <Brain size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Neural <br/>Preceptor</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">Logic Pipe Active</span>
                   </div>
                </div>
             </div>
             <button 
               onClick={onClose}
               className="relative z-10 p-3 bg-black/20 text-white rounded-xl hover:bg-black/40 transition-all border border-white/10"
             >
                <X size={20} />
             </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth"
          >
             {messages.map((msg) => (
               <motion.div 
                 key={msg.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                 <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                       {msg.role === 'ai' ? (
                          <>
                            <Brain size={12} className="text-indigo-400" />
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">HARVEY</span>
                          </>
                       ) : (
                          <>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">USER PROBE</span>
                            <User size={12} className="text-emerald-400" />
                          </>
                       )}
                    </div>
                    <div className={`p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-xl ${
                      msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
                    }`}>
                      <div className="markdown-body">
                         <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                 </div>
               </motion.div>
             ))}
             {isTyping && (
               <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] rounded-tl-none space-x-1.5 flex items-center">
                     <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                     <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                     <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  </div>
               </div>
             )}
          </div>

          {/* Input Area */}
          <div className="p-6 md:p-8 bg-slate-900 border-t border-white/5">
             <div className="relative group">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about physics, clinical logic, or artifacts..."
                  className="w-full bg-black border border-white/10 rounded-2xl md:rounded-[2rem] py-4 md:py-5 pl-6 pr-16 text-xs md:text-sm text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim() || isTyping}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-xl md:rounded-[1.5rem] flex items-center justify-center hover:bg-indigo-500 disabled:opacity-50 disabled:grayscale transition-all shadow-2xl"
                >
                   <Send size={18} />
                </button>
             </div>
             <p className="mt-4 text-[7px] font-black text-slate-700 uppercase tracking-widest text-center">
                AI Intelligence can facilitate deep conceptual shifts, but manual knobology verification is mandatory.
             </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
