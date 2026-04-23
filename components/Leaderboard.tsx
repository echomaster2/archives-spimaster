
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, Medal, Star, TrendingUp, 
  User, BarChart3, ListOrdered, Sparkles,
  ChevronUp, ChevronDown, Minus, Loader2
} from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { db, handleFirestoreError } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { AVATAR_OPTIONS } from '../data/avatars';

interface LeaderboardProps {
  currentUserId: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserId }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'public_profiles'),
      orderBy('xp', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newEntries = snapshot.docs.map((doc, index) => ({
        userId: doc.id,
        displayName: doc.data().displayName || 'Anonymous',
        avatarId: doc.data().avatarId || 'default',
        avatarUrl: doc.data().avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
        xp: doc.data().xp || 0,
        rank: index + 1,
        level: Math.floor((doc.data().xp || 0) / 1000) + 1
      }));
      setEntries(newEntries);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, 'list' as any, 'public_profiles');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-8">
        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">Synchronizing Neural Rankings...</p>
      </div>
    );
  }

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  const getAvatar = (avatarId?: string) => {
    return AVATAR_OPTIONS.find(a => a.id === avatarId) || AVATAR_OPTIONS[0];
  };

  return (
    <div className="space-y-8 md:space-y-12 max-w-4xl mx-auto pb-20 px-2 md:px-0 animate-in fade-in duration-1000">
      {/* Podiums */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 items-end pt-8 md:pt-12 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/5 to-transparent opacity-50 blur-3xl pointer-events-none" />
        {/* 2nd Place */}
        <PodiumEntry entry={topThree[1]} avatar={getAvatar(topThree[1]?.avatarId)} rank={2} height="h-24 md:h-40" color="bg-slate-400/20" icon={<Medal className="text-slate-400 md:w-5 md:h-5" size={14} />} />
        {/* 1st Place */}
        <PodiumEntry entry={topThree[0]} avatar={getAvatar(topThree[0]?.avatarId)} rank={1} height="h-32 md:h-56" color="bg-yellow-500/20" icon={<Trophy className="text-yellow-400 md:w-5 md:h-5" size={14} />} />
        {/* 3rd Place */}
        <PodiumEntry entry={topThree[2]} avatar={getAvatar(topThree[2]?.avatarId)} rank={3} height="h-20 md:h-32" color="bg-amber-600/20" icon={<Medal className="text-amber-500 md:w-5 md:h-5" size={14} />} />
      </div>

      {/* List */}
      <div className="glass-panel rounded-[1.5rem] md:rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-4 md:p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2.5 md:p-3 bg-indigo-600 rounded-xl md:rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <ListOrdered size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-black uppercase italic tracking-tighter text-gradient-vibrant">Neural Rankings</h3>
              <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest">Global Sonography Network</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 glass-panel px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-indigo-500/30">
            <Sparkles size={12} className="text-indigo-400 md:w-4 md:h-4" />
            <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest">Top 100</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {remaining.map((entry, idx) => {
            const avatar = getAvatar(entry.avatarId);
            return (
              <div 
                key={entry.userId}
                className={`p-4 md:p-6 flex items-center justify-between hover:bg-white/5 transition-colors group
                  ${entry.userId === currentUserId ? 'bg-indigo-500/10' : ''}`}
              >
                <div className="flex items-center gap-3 md:gap-6">
                  <span className="text-sm md:text-xl font-black text-slate-600 w-6 md:w-8 text-center group-hover:text-indigo-400 transition-colors glitch-text" data-text={entry.rank}>{entry.rank}</span>
                  <div className="relative">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 shadow-md overflow-hidden group-hover:scale-110 transition-transform flex items-center justify-center ${avatar.color && `bg-gradient-to-br ${avatar.color}`} text-white`}>
                      <avatar.icon size={24} className="md:w-8 md:h-8" />
                    </div>
                    {entry.userId === currentUserId && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-indigo-600 rounded-full border-2 border-black shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs md:text-base font-black uppercase italic tracking-tight text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">{entry.displayName}</p>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Level {Math.floor(entry.xp / 1000) + 1}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                  <div className="text-right">
                    <p className="text-sm md:text-lg font-black text-indigo-400 italic glitch-text" data-text={entry.xp.toLocaleString()}>{entry.xp.toLocaleString()}</p>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">XP</p>
                  </div>
                  <div className="flex flex-col items-center group-hover:scale-125 transition-transform">
                    {idx % 3 === 0 ? <ChevronUp className="text-emerald-400 md:w-4 md:h-4" size={14} /> : idx % 3 === 1 ? <ChevronDown className="text-rose-400 md:w-4 md:h-4" size={14} /> : <Minus className="text-slate-600 md:w-4 md:h-4" size={14} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PodiumEntry: React.FC<{ entry: LeaderboardEntry | undefined, avatar: any, rank: number, height: string, color: string, icon: React.ReactNode }> = ({ entry, avatar, rank, height, color, icon }) => (
  <div className="flex flex-col items-center gap-2 md:gap-4 group/podium">
    <div className="relative">
      <div className={`w-14 h-14 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] border border-white/10 shadow-xl overflow-hidden group-hover/podium:scale-110 transition-transform duration-700 flex items-center justify-center ${rank === 1 ? 'scale-110 border-yellow-500/30' : ''} ${entry ? (avatar.color && `bg-gradient-to-br ${avatar.color}`) : 'bg-white/5'} text-white`}>
        {entry ? (
          <avatar.icon size={32} className="md:w-16 md:h-16" />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-slate-600">
            <User size={24} className="md:w-8 md:h-8" />
          </div>
        )}
      </div>
      <div className={`absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg border border-white/10 ${color} backdrop-blur-md group-hover/podium:scale-125 transition-transform`}>
        {icon}
      </div>
    </div>
    <div className="text-center">
      <p className="text-[10px] md:text-base font-black uppercase italic tracking-tight text-slate-100 line-clamp-1 group-hover/podium:text-indigo-400 transition-colors">{entry?.displayName || '???'}</p>
      <p className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest glitch-text" data-text={entry?.xp.toLocaleString() || 0}>{entry?.xp.toLocaleString() || 0} XP</p>
    </div>
    <div className={`w-full ${height} ${color} rounded-t-xl md:rounded-t-[2rem] border-x border-t border-white/10 shadow-inner flex items-center justify-center backdrop-blur-md relative overflow-hidden group-hover/podium:brightness-125 transition-all`}>
      <div className="absolute inset-0 noise-overlay opacity-10" />
      <span className="text-2xl md:text-4xl font-black text-white/20 italic glitch-text" data-text={rank}>{rank}</span>
    </div>
  </div>
);
