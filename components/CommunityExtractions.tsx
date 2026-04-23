
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, MessageSquare, ThumbsUp, Send, 
  Search, Filter, Sparkles, User, 
  Clock, Hash, Loader2, AlertCircle
} from 'lucide-react';
import { db, handleFirestoreError } from '../firebase';
import { 
  collection, query, orderBy, limit, 
  onSnapshot, addDoc, updateDoc, doc, 
  increment, Timestamp, where 
} from 'firebase/firestore';
import { CommunityExtraction } from '../types';
import { toast } from 'sonner';

interface CommunityExtractionsProps {
  user: any;
  topic?: string;
}

export const CommunityExtractions: React.FC<CommunityExtractionsProps> = ({ user, topic }) => {
  const [extractions, setExtractions] = useState<CommunityExtraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newTopic, setNewTopic] = useState(topic || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let q = query(
      collection(db, 'community_extractions'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    if (topic) {
      q = query(
        collection(db, 'community_extractions'),
        where('topic', '==', topic),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommunityExtraction[];
      setExtractions(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, 'list' as any, 'community_extractions');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [topic]);

  const handlePost = async () => {
    if (!user) {
      toast.error("Authentication required to share logic pools.");
      return;
    }

    if (!newContent.trim() || !newTopic.trim()) {
      toast.error("Content and Topic are required");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'community_extractions'), {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous Sonographer',
        topic: newTopic,
        content: newContent,
        upvotes: 0,
        timestamp: Date.now(),
        tags: [newTopic.toLowerCase()]
      });
      setNewContent('');
      setIsAdding(false);
      toast.success("Extraction shared with the network!");
    } catch (e: any) {
      handleFirestoreError(e, 'create' as any, 'community_extractions');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Authentication required to upvote simulations.");
      return;
    }

    try {
      const docRef = doc(db, 'community_extractions', id);
      await updateDoc(docRef, {
        upvotes: increment(1)
      });
      toast.success("Upvoted!");
    } catch (e: any) {
      handleFirestoreError(e, 'update' as any, 'community_extractions');
    }
  };

  const filteredExtractions = extractions.filter(ex => 
    ex.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative flex-1 w-full">
           <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
           <input 
             type="text" 
             placeholder="Search community logic..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-16 pr-8 text-white font-bold italic focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
           />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
           <Plus size={18} /> Share Logic
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-10 rounded-[3rem] border border-indigo-500/30 space-y-6"
          >
             <div className="flex items-center gap-4 text-indigo-400">
                <Sparkles size={20} />
                <h4 className="text-xl font-black uppercase italic tracking-tight">Post Neural Extraction</h4>
             </div>
             <div className="space-y-4">
                <div className="space-y-1">
                   <label className="micro-label px-2">Topic (e.g. Doppler, Artifacts)</label>
                   <input 
                     type="text" 
                     value={newTopic}
                     onChange={(e) => setNewTopic(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-indigo-500 transition-all"
                   />
                </div>
                <div className="space-y-1">
                   <label className="micro-label px-2">Mnemonic or Insight</label>
                   <textarea 
                     value={newContent}
                     onChange={(e) => setNewContent(e.target.value)}
                     rows={4}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium italic outline-none focus:border-indigo-500 transition-all resize-none"
                     placeholder="How do you remember this logic?"
                   />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                   <button onClick={() => setIsAdding(false)} className="px-6 py-3 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Abort</button>
                   <button 
                    onClick={handlePost}
                    disabled={submitting}
                    className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-xl disabled:opacity-50"
                   >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Deploy Synapse</>}
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
             <Loader2 size={40} className="text-indigo-600 animate-spin" />
             <p className="micro-label animate-pulse">Syncing logic pools...</p>
          </div>
        ) : filteredExtractions.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <AlertCircle size={40} className="text-slate-700 mx-auto" />
             <p className="text-slate-500 font-bold italic">No shared logic found for this query.</p>
          </div>
        ) : (
          filteredExtractions.map((ex, idx) => (
            <motion.div 
              key={ex.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/20 transition-all flex flex-col md:flex-row gap-8 items-start hover:bg-white/[0.02]"
            >
               <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                     <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-[8px] font-black uppercase tracking-widest leading-none">
                        {ex.topic}
                     </span>
                     <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                        <User size={12} /> {ex.authorName}
                     </span>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-white italic leading-relaxed">
                     "{ex.content}"
                  </p>
                  <div className="flex items-center gap-6 pt-2">
                     <div className="flex items-center gap-2 text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                        <Clock size={12} /> {new Date(ex.timestamp).toLocaleDateString()}
                     </div>
                     <div className="flex items-center gap-2 text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                        <Hash size={12} /> {ex.tags?.join(', ')}
                     </div>
                  </div>
               </div>
               <div className="flex md:flex-col items-center gap-4">
                  <button 
                    onClick={(e) => handleUpvote(ex.id, e)}
                    className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-indigo-600 hover:text-white transition-all group/up"
                  >
                     <div className="flex flex-col items-center gap-1">
                        <ThumbsUp size={20} className="group-hover/up:scale-125 transition-transform" />
                        <span className="text-[10px] font-black">{ex.upvotes}</span>
                     </div>
                  </button>
                  <button className="p-4 bg-white/5 rounded-2xl border border-white/10 text-slate-600 hover:text-white transition-all">
                     <MessageSquare size={20} />
                  </button>
               </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
