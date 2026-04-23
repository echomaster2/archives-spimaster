import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tv, 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  ShieldCheck, 
  BadgeCheck, 
  Zap, 
  Mic, 
  Video, 
  Flame, 
  Search,
  MoreVertical,
  SkipForward,
  Play,
  Volume2
} from 'lucide-react';

interface Streamer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isVerified: boolean;
  specialty: string;
  bio: string;
  currentTopic: string;
  viewers: number;
  color: string;
  responseStyle?: string;
  keywords?: string[];
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  isModerator?: boolean;
  isSubscriber?: boolean;
  timestamp: number;
}

const STREAMERS: Streamer[] = [
  {
    id: 'sono_guru',
    name: 'Prof. Echo',
    handle: '@sonoguru_official',
    avatar: 'https://picsum.photos/seed/prof/200/200',
    isVerified: true,
    specialty: 'Registry Prep & Physics',
    bio: 'Former clinical director turned educator. Here to help you crush the SPI.',
    currentTopic: 'Live Review: Resolving Artifacts vs Pathology',
    viewers: 1240,
    color: 'indigo',
    responseStyle: 'Academic and supportive. Uses "Physics-first" logic.',
    keywords: ['frequency', 'wavelength', 'attenuation', 'impedance']
  },
  {
    id: 'ergosono',
    name: 'Alex Scanlon',
    handle: '@ergosono_live',
    avatar: 'https://picsum.photos/seed/ergosono/200/200',
    isVerified: true,
    specialty: 'Clinical Ergonomics & MSK',
    bio: 'Dedicated to saving your wrist and shoulder. Real-time scanning workshops.',
    currentTopic: 'The 3-Point Grip: MSK Shoulder Scanning Mastery',
    viewers: 856,
    color: 'emerald',
    responseStyle: 'Practical and ergonomic-focused. Direct and casual.',
    keywords: ['grip', 'shoulder', 'wrist', 'ergonomics']
  },
  {
    id: 'tech_talks',
    name: 'Sarah Doppler',
    handle: '@sara_doppler',
    avatar: 'https://picsum.photos/seed/doppler/200/200',
    isVerified: true,
    specialty: 'Vascular & Hemodynamics',
    bio: 'Physics of blood flow simplified. All about that spectral waveform.',
    currentTopic: 'Venous Insufficiency: Getting the Perfect Reflux Time',
    viewers: 2100,
    color: 'rose',
    responseStyle: 'Data-driven and energetic. Loves talking waveforms.',
    keywords: ['velocity', 'peak systolic', 'diastolic', 'waveform']
  },
  {
    id: 'fresh_scan',
    name: 'Newbie Nick',
    handle: '@fresh_scan_vlogs',
    avatar: 'https://picsum.photos/seed/newbie/200/200',
    isVerified: false,
    specialty: 'Student Life',
    bio: 'Current student documenting the journey to RDMS. Study with me sessions.',
    currentTopic: 'Late night physics grind - Let\'s tackle Nyquist Limit',
    viewers: 432,
    color: 'amber',
    responseStyle: 'Relatable student vibe. Asks questions back.',
    keywords: ['registry', 'exam', 'nyquist', 'aliasing']
  }
];

const CHAT_POOL = [
  "Wait, can you explain the PRF relationship again?",
  "This is so much clearer than my textbook!",
  "LUL that artifact looked like a smiley face",
  "Is this going up on the VOD later?",
  "F in the chat for my shoulder after a 10 hour shift",
  "Just passed my SPI because of these streams!!",
  "Hey Nick, good luck on the exam tomorrow!",
  "What probe frequency are you using for that?",
  "Knobology is the hardest part for me as a student",
  "PogChamp that waveform was crisp",
  "Can we talk about aliasing next?",
  "Registry Ready!! Let's goooo",
  "The ergonomic tips literally saved my life last week",
  "Sono-Squad checking in from London!",
  "Physics doesn't seem so scary now"
];

export const SimulatedStreams: React.FC = () => {
  const [selectedStream, setSelectedStream] = useState<Streamer | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [likes, setLikes] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedStream) {
      // Initialize with some messages
      const initial = Array(10).fill(0).map((_, i) => ({
        id: Math.random().toString(),
        user: `User_${Math.floor(Math.random() * 1000)}`,
        text: CHAT_POOL[Math.floor(Math.random() * CHAT_POOL.length)],
        timestamp: Date.now() - (10 - i) * 10000,
        isSubscriber: Math.random() > 0.7
      }));
      setMessages(initial);
      setLikes(Math.floor(Math.random() * 10000));
    }
  }, [selectedStream]);

  useEffect(() => {
    if (selectedStream && isLive) {
      const interval = setInterval(() => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          user: `User_${Math.floor(Math.random() * 1000)}`,
          text: CHAT_POOL[Math.floor(Math.random() * CHAT_POOL.length)],
          timestamp: Date.now(),
          isSubscriber: Math.random() > 0.8,
          isModerator: Math.random() > 0.95
        };
        setMessages(prev => [...prev.slice(-49), newMessage]);
      }, 3000 + Math.random() * 4000);

      return () => clearInterval(interval);
    }
  }, [selectedStream, isLive]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAddMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      text,
      timestamp: Date.now(),
      isSubscriber: true
    };
    setMessages(prev => [...prev.slice(-49), newMessage]);

    // AI Response logic
    if (selectedStream) {
      setTimeout(() => {
        const responses: Record<string, string[]> = {
          sono_guru: [
            "Great catch! Remember, axial resolution is always better than lateral because it depends on SPL.",
            "That's a classic Registry question. Think about the 13 microsecond rule for depth.",
            "Exactly. As frequency increases, attenuation also increases—it's a critical tradeoff."
          ],
          ergosono: [
            "Don't forget to relax your shoulder there! We're scanning for a decade, not a day.",
            "If you move the probe like that, you'll get much better contact without the strain.",
            "Look at that acoustic coupling. Smooth motion is key to a clean MSK scan."
          ],
          tech_talks: [
            "Check that spectral window! Pure laminar flow is what we want to see here.",
            "The peak systolic velocity there is exactly what the textbook describes for mild stenosis.",
            "Wait until you see how the waveform changes when we adjust the angle correction."
          ],
          fresh_scan: [
            "I literally just read about that in the Edelman book! So cool to see it live.",
            "Wait, does the Nyquist limit change if we change the depth? Let me check...",
            "Registry life is tough but we're going to crush it. Thanks for being here, You!"
          ]
        };

        const streamerResponses = responses[selectedStream.id] || ["Thanks for the comment! Keeping the scan clean is priority one."];
        const randomResponse = streamerResponses[Math.floor(Math.random() * streamerResponses.length)];

        const aiMsg: ChatMessage = {
          id: Date.now().toString() + '_ai',
          user: selectedStream.name,
          text: randomResponse,
          timestamp: Date.now(),
          isModerator: true,
          isSubscriber: true
        };
        setMessages(prev => [...prev.slice(-49), aiMsg]);
      }, 2000);
    }
  };

  if (!selectedStream) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-rose-500 font-black uppercase text-xs tracking-widest">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Live Now
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
                Neural <span className="text-white/20 font-light">Cast</span>
              </h1>
              <p className="text-slate-500 max-w-xl font-bold uppercase text-[10px] md:text-xs tracking-[0.3em] leading-relaxed">
                Connect with the world's leading sonographers and educators in real-time. Simulated livestreams powered by AI personas.
              </p>
            </div>
            <div className="relative group max-w-md w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search Topics or Streamers..."
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-6 text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {STREAMERS.map((streamer) => (
              <motion.div
                key={streamer.id}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedStream(streamer)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all group-hover:border-white/30">
                  <img 
                    src={streamer.avatar} 
                    alt={streamer.name}
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  
                  {/* Badge */}
                  <div className="absolute top-6 left-6 px-3 py-1 bg-rose-600 text-white font-black uppercase text-[10px] tracking-widest rounded-full shadow-xl flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live
                  </div>
                  <div className="absolute top-6 right-6 px-3 py-1 bg-black/60 backdrop-blur-md text-white font-black uppercase text-[10px] tracking-widest rounded-full shadow-xl flex items-center gap-2">
                    <Users size={12} />
                    {(streamer.viewers / 1000).toFixed(1)}K
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <Play fill="currentColor" size={24} className="ml-1" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 px-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10">
                        <img src={streamer.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h3 className="text-white font-black uppercase text-sm tracking-tight flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                          {streamer.currentTopic}
                          {streamer.isVerified && <BadgeCheck size={16} className="text-sky-400" />}
                        </h3>
                        <p className="text-slate-500 font-bold text-xs">{streamer.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/5 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                      {streamer.specialty}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col xl:flex-row overflow-hidden">
      {/* Sidebar Overlay on scroll for mobile if needed, but here we layout horizontally */}
      
      {/* Video Content */}
      <div className="flex-1 overflow-y-auto bg-black relative">
        {/* Top Navbar */}
        <div className="absolute top-0 left-0 right-0 p-6 z-20 flex items-center justify-between pointer-events-none">
          <button 
            onClick={() => setSelectedStream(null)}
            className="p-4 bg-black/60 backdrop-blur-xl border border-white/10 text-white rounded-2xl hover:bg-white hover:text-black transition-all pointer-events-auto"
          >
            <SkipForward className="rotate-180" size={20} />
          </button>
          
          <div className="flex items-center gap-3 p-3 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl pointer-events-auto">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Live: {selectedStream.currentTopic}
          </div>
        </div>

        {/* Video Stage */}
        <div className="relative aspect-video bg-slate-900 group">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
             {/* Simulated video background */}
             <div className="w-full h-full relative">
                <img 
                  src={selectedStream.avatar} 
                  alt="" 
                  className="w-full h-full object-cover blur-3xl opacity-30" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40" />
                
                {/* Simulated Content Area */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-4/5 h-4/5 rounded-[3rem] overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-8 p-12 text-center shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                    <div className="w-40 h-40 rounded-full border-4 border-indigo-500/30 p-2 overflow-hidden bg-black/20">
                      <img src={selectedStream.avatar} alt="" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                    </div>
                    <div className="space-y-4">
                       <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{selectedStream.name}</h2>
                       <div className="flex items-center justify-center gap-3 text-indigo-400 font-black uppercase text-sm tracking-widest">
                          <Mic size={20} /> Starting Presentation...
                       </div>
                    </div>
                    {/* Visualizer bars */}
                    <div className="flex items-end gap-1 h-12">
                      {[1,2,3,4,5,6,7,8,7,6,5,4,3,2,1].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [`${h*10}%`, `${(Math.random()*60)+20}%`, `${h*10}%`] }}
                          transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                          className="w-1 bg-white/20 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-6">
              <button className="text-white hover:text-indigo-400 transition-colors"><Play size={28} fill="currentColor" /></button>
              <div className="flex items-center gap-4 text-white">
                <Volume2 size={24} />
                <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-indigo-500" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white font-mono text-sm">
                42:15 / LIVE
              </div>
              <button className="p-2 text-white hover:bg-white/10 rounded-xl transition-all">
                 <MoreVertical size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="flex gap-8">
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white/5 ring-4 ring-indigo-500/20 flex-shrink-0">
                <img src={selectedStream.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedStream.name}</h1>
                    {selectedStream.isVerified && <BadgeCheck className="text-sky-400" size={32} />}
                  </div>
                  <p className="text-slate-500 font-black uppercase text-xs tracking-[0.2em]">{selectedStream.handle}</p>
                </div>
                <p className="text-slate-400 font-bold leading-relaxed">{selectedStream.bio}</p>
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} /> Medical Educator
                  </div>
                  <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Zap size={14} /> Physics Expert
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <button className="flex-1 md:flex-none px-8 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3">
                  <Flame size={18} /> Support
               </button>
               <button className="p-5 bg-white/5 border border-white/10 text-white rounded-[2rem] hover:bg-white/10 transition-all flex items-center justify-center">
                  <Share2 size={20} />
               </button>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Related Tags / Info */}
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase text-sm tracking-widest italic flex items-center gap-3">
              <Video className="text-slate-500" size={18} /> About this stream
            </h4>
            <div className="bg-white/5 rounded-[3rem] p-8 md:p-12 border border-white/5 space-y-6">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{selectedStream.currentTopic}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                In today's session, we are deep-diving into practical application techniques. Whether you're a student preparing for registries or a seasoned sonographer looking to sharpen your diagnostic edge, this walkthrough covers everything from basic physics principles to advanced clinical recognition.
              </p>
              <div className="flex flex-wrap gap-4">
                {['#Sonography', '#UltrasoundRegistry', '#LifeOfASonographer', '#PhysicsMadeEasy'].map(tag => (
                   <span key={tag} className="text-indigo-400 font-black text-xs hover:underline cursor-pointer">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-full xl:w-[450px] h-[500px] xl:h-screen bg-slate-900 border-l border-white/5 flex flex-col">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-500/20 text-indigo-500 rounded-xl">
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 className="text-white font-black uppercase text-xs tracking-widest italic">Live Chat</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Real-time collaboration</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-rose-500 font-black text-xs">
                <Users size={14} />
                {selectedStream.viewers.toLocaleString()}
             </div>
             <button className="text-slate-500 hover:text-white transition-colors">
                <MoreVertical size={18} />
             </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                  {msg.user[0]}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {msg.isModerator && (
                       <span className="p-1 bg-emerald-500/20 text-emerald-500 rounded-lg"><ShieldCheck size={10} /></span>
                    )}
                    {msg.isSubscriber && (
                       <span className="p-1 bg-amber-500/20 text-amber-500 rounded-lg"><Zap size={10} /></span>
                    )}
                    <span className={`text-[11px] font-black uppercase tracking-tight ${msg.user === 'You' ? 'text-indigo-400' : 'text-slate-300'}`}>
                      {msg.user}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-bold selection:bg-indigo-500/30">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-6 space-y-4 bg-slate-950/50 border-t border-white/5">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setLikes(prev => prev + 1)}
               className="flex-1 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest"
             >
               <Heart size={16} fill={likes > 0 ? "currentColor" : "none"} />
               {likes.toLocaleString()}
             </button>
             <button className="p-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl hover:bg-white/10 transition-all">
                <Share2 size={16} />
             </button>
          </div>
          
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Send a message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  handleAddMessage(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-12 text-sm text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors">
               <Zap size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
